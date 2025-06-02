from fastapi import APIRouter
from utils.command_executor import execute_command
from utils.constants import PRODUCT_TYPE_TO_MODEL
from models.device_info import DeviceInfo
from fastapi import HTTPException
import tempfile
import os
import shutil
from fastapi.responses import FileResponse
from fastapi import BackgroundTasks

router = APIRouter()

"""
This module provides endpoints for device management operations such as pairing, unpairing,
getting device information, restarting, shutting down the device, and extracting logs.
"""

@router.post("/pair", summary="Pair device", description="Pairs the device with the computer")
async def pair_device():
    exit_code, output = execute_command(["idevicepair", "pair"])
    if exit_code == 0:
        return {"status":200, "message": "Dispositivo emparejado con éxito"}
    raise HTTPException(status_code=500, detail="Error al emparejar el dispositivo")


@router.post("/unpair", summary="Unpair device", description="Unpairs the device with the computer")
async def unpair_device():
    exit_code, output = execute_command(["idevicepair", "unpair"])
    if exit_code == 0:
        return {"status":200, "message": "Dispositivo desemparejado con éxito"}
    raise HTTPException(status_code=500, detail="Error al desemparejar el dispositivo")


@router.get("/info", summary="Get device information", description="Retrieves detailed device information", response_model=DeviceInfo)
async def get_device_info():
    exit_code, output = execute_command(["ideviceinfo"])
    if exit_code != 0:
        raise HTTPException(
            status_code=500, detail="Error al obtener la información del dispositivo")

    device_info = DeviceInfo()

    # iterate over the output lines and assign values to the corresponding fields
    for line in output.splitlines():
        if ":" in line:
            key, value = map(str.strip, line.split(":", 1))
            if key in DeviceInfo.model_fields:  # verify if the key is a valid field
                # assign the value to the corresponding field
                setattr(device_info, key, value)
    
    # Replace ProductType with the corresponding model name
    if hasattr(device_info, "ProductType") and device_info.ProductType in PRODUCT_TYPE_TO_MODEL:
        device_info.ProductType = PRODUCT_TYPE_TO_MODEL[device_info.ProductType]

    # return only the specified fields
    return device_info.model_dump(exclude_none=True)

@router.post("/restart", summary="Restart device", description="Restarts the device")
async def restart_device():
    exit_code, output = execute_command(["idevicediagnostics", "restart"])
    if exit_code == 0:
        return {"status":200, "message": "Dispositivo reiniciado con éxito"}
    return HTTPException(status_code=500, detail="Error reiniciando el dispositivo")


@router.post("/shutdown", summary="Shut down device", description="Shuts down the device")
async def shutdown_device():
    exit_code, output = execute_command(["idevicediagnostics", "shutdown"])
    if exit_code == 0:
        return {"status":200, "message": "Dispositivo apagado con éxito"}
    return HTTPException(status_code=500, detail="Error apagando el dispositivo")

def device_is_activated():
    """
    Checks if the device is activated.
    Returns True if activated, False otherwise.
    """
    exit_code, output = execute_command(["ideviceactivation", "state"])
    
    if exit_code == 1 and "Activated" in output:
        return True
    return False

@router.post("/activate", summary="Activate device", description="Activates the device")
async def activate_device():
    """Activates the device if it is not already activated."""
    
    if device_is_activated():
        return {"status":200, "message": "El dispositivo ya está activado"}
    
    exit_code, output = execute_command(["ideviceactivation", "activate"])
    if exit_code == 0:
        return {"message": "Dispositivo activado con éxito"}
    return HTTPException(status_code=500, detail="Error activando el dispositivo")

# Temporary directory for logs
LOGS_DIR = os.path.join(tempfile.gettempdir(), "device_logs")

def verify_and_extract_logs():
    """
    Verifies if logs are available and extracts them to a persistent directory.
    Returns the directory where the logs are located.
    """
    # Create the logs directory if it does not exist
    os.makedirs(LOGS_DIR, exist_ok=True)

    # Execute the command to extract the logs
    exit_code, output = execute_command(["idevicecrashreport", "-e", LOGS_DIR])
    print("exit_code", exit_code)
    if exit_code != 0:
        raise HTTPException(status_code=500, detail=f"Error al extraer logs: {output.strip()}")

    # Check if the logs directory is empty
    if not os.listdir(LOGS_DIR):
        raise HTTPException(status_code=404, detail="No hay logs disponibles en el dispositivo")

    return LOGS_DIR

@router.get("/extract-logs", summary="Get device logs", description="Retrieves device crash logs")
async def extract_logs(background_tasks: BackgroundTasks):
    """
    Retrieves the logs as a ZIP file.
    """
    try:
        # Verify and extract the logs
        log_dir = verify_and_extract_logs()

        # Compress the logs into a ZIP file
        zip_file = os.path.join(LOGS_DIR, "crash_logs.zip")
        shutil.make_archive(os.path.join(LOGS_DIR, "crash_logs"), "zip", log_dir)

        # Check if the ZIP file was created
        if not os.path.exists(zip_file):
            raise HTTPException(status_code=500, detail="Error al crear el archivo ZIP de logs")

        # Schedule cleanup of the ZIP file and logs directory
        background_tasks.add_task(cleanup_logs, zip_file, log_dir)

        # Return the ZIP file as a response
        return FileResponse(zip_file, media_type="application/zip", filename="crash_logs.zip")

    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Ocurrió un error inesperado: {str(e)}")

def cleanup_logs(zip_file, log_dir):
    """
    Removes the ZIP file and the logs directory.
    """
    try:
        if os.path.exists(zip_file):
            os.remove(zip_file)
        if os.path.exists(log_dir):
            shutil.rmtree(log_dir)
    except Exception as e:
        print(f"Error durante la limpieza: {str(e)}")