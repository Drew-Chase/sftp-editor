import React, {useEffect} from "react";
import {BrowserRouter, Route, Routes, useNavigate} from "react-router-dom";
import ReactDOM from "react-dom/client";
import $ from "jquery";
import {NextUIProvider} from "@nextui-org/react";

import "./assets/scss/index.scss";
import {applyTheme} from "./assets/ts/Theme.ts";
import Browser from "./pages/Browser.tsx";
import Settings from "./pages/Settings.tsx";
import MenuBar from "./components/MenuBar.tsx";
import {GetSettings} from "./assets/ts/Settings.ts";
import ConnectionsList from "./pages/ConnectionsList.tsx";
import KeyboardShortcuts from "./assets/ts/KeyboardShortcuts.ts";
import ConnectionManager from "./assets/ts/ConnectionManager.ts";
import LogViewer from "./pages/LogViewer.tsx";
import Log from "./assets/ts/Logger.ts";

await GetSettings();
applyTheme();

ReactDOM.createRoot($("#root")[0]!).render(
    <React.StrictMode>
        <BrowserRouter>
            <PageContent/>
        </BrowserRouter>
    </React.StrictMode>
);


function PageContent()
{
    Log.debug("Test message: {0}", "Hello, World!", {test: 0})
    Log.info("Test message: {0}", "Hello, World!", {test: 0})
    Log.warn("Test message: {0}", "Hello, World!", {test: 0})
    Log.error("Test message: {0}", "Hello, World!", {test: 0})
    // return;
    // Initialize the singletons
    KeyboardShortcuts.instance;
    ConnectionManager.instance;

    // Disable the default right-click context menu
    $(document).on("contextmenu", (e) => e.preventDefault());




    const navigate = useNavigate();
    useEffect(() =>
    {
        if (ConnectionManager.instance.hasDefault())
        {
            ConnectionManager.instance.connect(ConnectionManager.instance.getDefault());

            // This uses the useNavigate hook from react-router-dom to navigate to the connection page.
            // The function looks a little funny because it's a hook that returns a FunctionComponent.
            // For more information on useNavigate see: https://reactrouter.com/en/main/hooks/use-navigate
            navigate(`/connection/${ConnectionManager.instance.getDefault().id}`);
        } else
        {
            navigate("/site-browser/new");// Redirect to the connections list page.
        }
    }, []);

    return (
        <>
            <NextUIProvider navigate={navigate}>
                <MenuBar/>
                <Routes>
                    <Route>
                        <Route path="/" element={<Home/>}/>
                        <Route path="/site-browser/:id?" element={<ConnectionsList/>}/>
                        <Route path="/connection/:id" element={<Browser/>}/>
                        <Route path="/settings/:tab?" element={<Settings/>}/>
                        <Route path="/logs" element={<LogViewer/>}/>
                    </Route>
                </Routes>
            </NextUIProvider>
        </>
    );
}

function Home()
{
    return (<></>);
}