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
                    <Route path="/" element={<Browser/>}/>
                    <Route path="/settings/:tab?" element={<Settings/>}/>
                </Route>
            </Routes>
        </NextUIProvider>
    );
}
