import { app, BrowserWindow, ipcMain, dialog } from 'electron';
import path from 'path';
import { exec } from 'child_process';
import spawn from 'cross-spawn';
import kill from 'tree-kill';
import waitOn from 'wait-on';
import { fileURLToPath } from 'url';
import fs from 'fs';
import https from 'https';

const __dirname = fileURLToPath(new URL('.', import.meta.url)); // Define __dirname

let mainWindow;
let viteProcess;
let backendProcess;

app.disableHardwareAcceleration();

function startVite() {
    console.log('Iniciando Vite...');
    if (process.platform === 'win32') {
        viteProcess = spawn('npm', ['run', 'dev'], {
            cwd: __dirname,
            stdio: 'inherit',
            shell: true
        });
    } else {
        viteProcess = spawn('npm', ['run', 'dev'], {
            cwd: __dirname,
            stdio: 'inherit',
        });
    }

    viteProcess.on('close', (code) => {
        console.log(`Vite process exited with code ${code}`);
    });

    viteProcess.on('error', (err) => {
        console.error('Error al iniciar Vite:', err.message);
    });
}

function stopVite() {
    if (viteProcess) {
        kill(viteProcess.pid, 'SIGINT', (err) => {
            if (err) {
                console.error('Error al detener Vite:', err.message);
            } else {
                console.log('Vite detenido correctamente.');
            }
        });
        viteProcess = null;

        const killCommand = process.platform === 'win32'
            ? 'for /f "tokens=5" %a in (\'netstat -ano ^| findstr :5173\') do taskkill /PID %a /F'
            : 'lsof -t -i:5173 | xargs kill -9';

        exec(killCommand, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error al ejecutar el comando: ${error.message}`);
                return;
            }
            if (stderr) {
                console.error(`Error en la salida estándar: ${stderr}`);
                return;
            }
            console.log('Proceso en el puerto 5173 detenido correctamente.');
        });
    }
}

function startBackend() {
    const backendPath = path.join(__dirname, 'dist', 'backend', 'backend');
    backendProcess = spawn(backendPath, [], {
        detached: true,
        stdio: 'ignore'
    });
    backendProcess.unref();
    console.log('Backend iniciado asincrónicamente.');
}

function stopBackend() {
    if (backendProcess && backendProcess.pid) {
        try {
            process.kill(backendProcess.pid);
            console.log('Backend detenido.');
        } catch (e) {
            console.error('Error al detener el backend:', e.message);
        }
        backendProcess = null;
    }
}

app.on('ready', async () => {
    mainWindow = new BrowserWindow({
        width: 1280,
        height: 720,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            nodeIntegration: false,
            disableHardwareAcceleration: true,
        }
    });

    mainWindow.setMenuBarVisibility(false);
    
    mainWindow.loadFile('loading.html');

    startBackend();
    startVite();

    try {
        await waitOn({ resources: ['http://localhost:5173'], timeout: 60000 });
        console.log('Vite está listo.');
        mainWindow.loadURL('http://localhost:5173');
    } catch (err) {
        console.error('Error al esperar a Vite:', err.message);
        app.quit();
    }
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('before-quit', () => {
    console.log('Cerrando la aplicación...');
    stopVite();
    stopBackend();
});

// Manejar el evento para abrir el diálogo de selección de archivos
ipcMain.handle('dialog:openFile', async () => {
    const result = await dialog.showOpenDialog(mainWindow, {
        properties: ['openFile']
    });
    return result.filePaths[0]; // Retorna solo el primer archivo seleccionado
});

// Manejar el evento para abrir el diálogo de selección de carpetas
ipcMain.handle('dialog:openFolder', async () => {
    const result = await dialog.showOpenDialog(mainWindow, {
        properties: ['openDirectory']
    });
    return result.filePaths[0]; // Retorna solo la primera carpeta seleccionada
});

let abortController = null; // Declarar abortController en un ámbito global

ipcMain.handle('start-download', async (event, url) => {
    abortController = new AbortController(); // Inicializar abortController
    const signal = abortController.signal;

    mainWindow.webContents.send('download-started'); // Notifica que la descarga ha comenzado

    return new Promise((resolve, reject) => {
        https.get(url, { signal }, (response) => {
            if (response.statusCode !== 200) {
                reject(new Error(`HTTP Status Code: ${response.statusCode}`));
                return;
            }

            // Obtener el nombre del archivo desde los encabezados o la URL
            const contentDisposition = response.headers['content-disposition'];
            let fileName = 'archivo_descargado.zip'; // Nombre predeterminado

            if (contentDisposition && contentDisposition.includes('filename=')) {
                const match = contentDisposition.match(/filename="?(.+?)"?$/);
                if (match) {
                    fileName = match[1];
                }
            } else {
                // Extraer el nombre del archivo de la URL si no está en los encabezados
                const urlPath = new URL(url).pathname;
                fileName = path.basename(urlPath);
            }

            const filePath = path.join(app.getPath('downloads'), fileName);
            const file = fs.createWriteStream(filePath);

            const total = parseInt(response.headers['content-length'] || '0', 10);
            let downloaded = 0;

            response.pipe(file);

            response.on('data', (chunk) => {
                downloaded += chunk.length;
                const progress = downloaded / total;
                mainWindow.webContents.send('download-progress', progress); // Envía el progreso al frontend
            });

            file.on('finish', () => {
                file.close();
                resolve();
            });

            response.on('error', (err) => {
                reject(err);
            });

            // Manejar la cancelación
            signal.addEventListener('abort', () => {
                file.close(); // Cierra el archivo antes de eliminarlo
                fs.unlink(filePath, (err) => {
                    if (err) {
                        console.error('Error al eliminar el archivo cancelado:', err.message);
                    } else {
                        console.log('Archivo cancelado eliminado correctamente.');
                    }
                });
                reject(new Error('Descarga cancelada'));
            });
        }).on('error', (err) => {
            reject(err);
        });
    }).catch((err) => {
        if (err.message === 'Descarga cancelada') {
            console.log('La descarga fue cancelada por el usuario.');
        } else {
            console.error('Error durante la descarga:', err.message);
        }
    });
});

ipcMain.handle('cancel-download', () => {
    if (abortController) {
        abortController.abort(); // Cancela la descarga
        abortController = null; // Reinicia el controlador para futuras descargas
    } else {
        console.error('No hay una descarga activa para cancelar.');
    }
});