from fastapi import APIRouter, Body, HTTPException
import httpx
from utils.command_executor import execute_command
from models.firmware import Firmware

router = APIRouter()

"""
This module provides endpoints for device management operations such as entering recovery mode,
exiting recovery mode, restoring the device, creating backups, and restoring backups.
"""

def get_device_id():
    """
    Retrieves the device ID using the idevice_id command.
    Returns:
        str: The device ID if found, otherwise None.
    """
    exit_code, output = execute_command(["idevice_id", "-l"])
    if exit_code == 0:
        return output.strip()
    return None


@router.post("/enter-recovery", summary="Enter recovery mode", description="Enters the device into recovery mode")
async def enter_recovery_mode():
    device_id = get_device_id()
    if not device_id:
        return HTTPException(status_code=500, detail="Error obteniendo el ID del dispositivo")
    exit_code, output = execute_command(["ideviceenterrecovery", device_id])
    if exit_code == 0:
        return {"status":200, "message": "El dispositivo ha entrado en modo de recuperación exitosamente"}
    return HTTPException(status_code=500, detail="Error al entrar en modo de recuperación")


@router.post("/exit-recovery", summary="Exit recovery mode", description="Exits the device from recovery mode")
async def exit_recovery_mode():
    exit_code, output = execute_command(["irecovery", "-n"])
    if exit_code == 0:
        return {"status":200, "message": "El dispositivo ha salido del modo de recuperación exitosamente"}
    return HTTPException(status_code=500, detail="Error al salir del modo de recuperación")


@router.post("/backup", summary="Create device backup", description="Creates a backup of the device")
async def create_backup(backup_path: str = Body(..., embed=True)):
    exit_code, output = execute_command(
        ["idevicebackup2", "backup", backup_path])
    if exit_code == 0:
        return {"status":200, "message": "Respaldo creado exitosamente"}
    return HTTPException(status_code=500, detail=f"Error al crear el respaldo {output}")


@router.post("/restore-backup", summary="Restore device backup", description="Restores a backup to the device")
async def restore_backup(backup_path: str = Body(..., embed=True)):
    exit_code, output = execute_command(["idevicebackup2", "restore", backup_path])
    if exit_code == 0:
        return {"status":200, "message": "Respaldo restaurado exitosamente"}
    return HTTPException(status_code=500, detail=f"Error: El directorio de respaldo es invalido.")


@router.post("", summary="Restore device", description="Restores the device using an IPSW file")
async def restore_device(ipsw_file_path: str = Body(..., embed=True)):
    exit_code, output = execute_command(
        ["idevicerestore", "-e", ipsw_file_path])
    if exit_code == 0:
        return {"status":200, "message": "El dispositivo ha sido restaurado exitosamente."}
    return HTTPException(status_code=500, detail="Error restoring the device")


@router.get("/get-signed-firmwares", summary="Get all signed firmwares", description="Gets all signed firmwares for the connected device", response_model=list[Firmware])
async def get_signed_firmwares():
    exit_code, identifier = execute_command(["ideviceinfo", "-k", "ProductType"])

    if exit_code != 0:
        raise HTTPException(
            status_code=500, detail="Error al obtener el identificador del dispositivo")
        
    identifier = identifier.strip()
    if not identifier:
        raise HTTPException(
            status_code=500, detail="El identificador del dispositivo está vacío")

    ipsw_api_url = f"https://api.ipsw.me/v4/device/{identifier}?type=ipsw"
    
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(ipsw_api_url)
            response.raise_for_status()
            data = response.json()

            # Filtrar los firmwares para obtener solo los firmwares firmados
            signed_firmwares = [
                firmware for firmware in data.get("firmwares", [])
                if firmware.get("signed", False)
            ]

            if not signed_firmwares:
                raise HTTPException(status_code=404, detail="No hay firmware firmado disponible para este dispositivo.")

            # Mapear los firmwares firmados a objetos Firmware
            firmware_list = [
                Firmware(
                    version=fw["version"],
                    buildid=fw["buildid"],
                    url=fw["url"],
                    releasedate=fw["releasedate"]
                ).model_dump()
                for fw in signed_firmwares
            ]

            return firmware_list

    except httpx.HTTPError as e:
        raise HTTPException(
            status_code=500, detail=f"Error al obtener los datos del firmware: {str(e)}")