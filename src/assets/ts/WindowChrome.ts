import {appWindow} from "@tauri-apps/api/window";

export default class WindowChrome
{
    private static _instance: WindowChrome;
    public isMaximized: boolean = false;
    public isMinimized: boolean = false;

    private constructor()
    {
        appWindow.isMaximized().then(value => this.isMaximized = value);
        appWindow.isMinimized().then(value => this.isMinimized = value);
    }

    public static getInstance(): WindowChrome
    {
        if (!WindowChrome._instance)
        {
            WindowChrome._instance = new WindowChrome();
        }

        return WindowChrome._instance;
    }

    public async close()
    {
        await appWindow.close();
    }

    public async toggleMinimize()
    {
        if (this.isMinimized)
        {
            await appWindow.unminimize();
        } else
        {
            await appWindow.minimize();
        }
        this.isMinimized = !this.isMinimized;
    }

    public async toggleMaximize()
    {
        if (this.isMaximized)
        {
            await appWindow.unmaximize();
        } else
        {
            await appWindow.maximize();
        }
        this.isMaximized = !this.isMaximized;
    }

    public async maximize()
    {
        await appWindow.maximize();
        this.isMaximized = true;
    }

    public async unmaximize()
    {
        await appWindow.unmaximize();
        this.isMaximized = false;
    }
}