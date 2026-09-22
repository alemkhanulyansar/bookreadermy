const { app, BrowserWindow, Menu, dialog } = require('electron');
const { autoUpdater } = require('electron-updater');
const path = require('node:path');

function createWindow() {
    const window = new BrowserWindow({
        width: 1200,
        height: 800,
        minWidth: 760,
        minHeight: 560,
        backgroundColor: '#f2f4f7',
        webPreferences: {
            contextIsolation: true,
            nodeIntegration: false
        }
    });

    window.loadFile(path.join(__dirname, 'index.html'));
}

function configureUpdates() {
    if (!app.isPackaged) return;

    autoUpdater.autoDownload = true;
    autoUpdater.autoInstallOnAppQuit = true;

    autoUpdater.on('update-downloaded', async () => {
        const result = await dialog.showMessageBox({
            type: 'info',
            buttons: ['Перезапустить сейчас', 'Позже'],
            defaultId: 0,
            cancelId: 1,
            title: 'Доступно обновление',
            message: 'Новая версия FB2 Reader скачана.',
            detail: 'Перезапустите программу, чтобы установить обновление.'
        });
        if (result.response === 0) autoUpdater.quitAndInstall();
    });

    autoUpdater.on('error', error => {
        console.error('Ошибка автоматического обновления:', error);
    });

    autoUpdater.checkForUpdates().catch(error => {
        console.error('Не удалось проверить обновления:', error);
    });
    setInterval(() => autoUpdater.checkForUpdates(), 4 * 60 * 60 * 1000);
}

app.whenReady().then(() => {
    createWindow();
    Menu.setApplicationMenu(null);
    configureUpdates();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});
