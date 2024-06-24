import React from "react";
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
import SiteBrowser from "./pages/SiteBrowser.tsx";

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
    const navigate = useNavigate();
    return (
        <NextUIProvider navigate={navigate}>
            <MenuBar/>
            <Routes>
                <Route>
                    <Route path="/" element={<Home/>}/>
                    <Route path="/site-browser/:id?" element={<SiteBrowser/>}/>
                    <Route path="/connection/:id?" element={<Browser/>}/>
                    <Route path="/settings/:tab?" element={<Settings/>}/>
                </Route>
            </Routes>
        </NextUIProvider>
    );
}

function Home()
{
    window.location.href = "/site-browser/";
    return (<></>);
}