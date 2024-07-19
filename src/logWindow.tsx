import React from "react";
import {BrowserRouter} from "react-router-dom";
import ReactDOM from "react-dom/client";
import $ from "jquery";

import "./assets/scss/index.scss";
import {applyTheme} from "./assets/ts/Theme.ts";
import {GetSettings} from "./assets/ts/Settings.ts";
import KeyboardShortcuts from "./assets/ts/KeyboardShortcuts.ts";
import LogViewer from "./pages/LogViewer.tsx";
import Log, {closeLogWindow} from "./assets/ts/Logger.ts";
import MenuBar from "./components/MenuBar.tsx";


ReactDOM.createRoot($("#root")[0]!).render(
    <React.StrictMode>
        <BrowserRouter>
            <PageContent/>
        </BrowserRouter>
    </React.StrictMode>
);


function PageContent()
{
    GetSettings();
    applyTheme();
    // Initialize the singletons
    Log.initialize();
    KeyboardShortcuts.instance;

    // Disable the default right-click context menu
    $(document).on("contextmenu", (e) => e.preventDefault());

    return (
        <>
            <MenuBar title={"Log Viewer"} hideMenu actions={{
                minimize: false,
                maximize: false,
                close: true,
                onClose: () => {closeLogWindow()}
            }}/>
            <LogViewer/>
        </>
    );
}
