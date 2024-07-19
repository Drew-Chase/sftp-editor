import React from "react";
import {Navbar, NavbarContent, NavbarItem} from "@nextui-org/navbar";
import {Button, NavbarMenuToggle} from "@nextui-org/react";
import {MaximizeIcon, MinimizeIcon, XIcon} from "./Icons.tsx";
import WindowChrome from "../assets/ts/WindowChrome.ts";
import "../assets/scss/chrome.scss";
import SFTPEditorMenuBarComponent from "./MenuBar/SFTPEditorMenuBarComponent.tsx";
import HelpMenuBarComponent from "./MenuBar/HelpMenuBarComponent.tsx";

export interface ChromeActionOptions
{
    minimize?: boolean;
    maximize?: boolean;
    close?: boolean;
    onMinimize?: (isCurrentlyMinimized: boolean) => void;
    onMaximize?: (isCurrentlyMaximized: boolean) => void;
    onClose?: () => void;
}

const defaultActions: ChromeActionOptions = {
    minimize: true,
    maximize: true,
    close: true,
    onMinimize: () => WindowChrome.getInstance().toggleMinimize(),
    onMaximize: (_: boolean) => WindowChrome.getInstance().toggleMaximize(),
    onClose: () => WindowChrome.getInstance().close()
};


export default function MenuBar({title, hideMenu, actions}: { title?: string, hideMenu?: boolean, actions?: ChromeActionOptions })
{
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);

    if (!actions) actions = defaultActions; // If no actions are provided, use the default actions

    return (
        <Navbar id={"window-chrome"} onMenuOpenChange={setIsMenuOpen} maxWidth={"full"} height={"32px"} classNames={{base: "m-0", wrapper: "px-0"}}>
            <NavbarContent id={"window-menu-bar"} className={!title ? "hidden" : ""}>
                <NavbarItem>
                    <p className={"ml-3"}>{title}</p>
                </NavbarItem>
            </NavbarContent>
            <NavbarContent id={"window-menu-bar"} className={hideMenu ? "hidden" : ""}>
                <NavbarMenuToggle aria-label={isMenuOpen ? "Close menu" : "Open menu"} className="sm:hidden"/>
                <NavbarItem>
                    <SFTPEditorMenuBarComponent/>
                    <HelpMenuBarComponent/>
                </NavbarItem>
            </NavbarContent>
            <NavbarContent id={"window-drag-bar"} className={"w-full bg-transparent hover:bg-foreground/10 transition-[background] rounded-md"} data-tauri-drag-region></NavbarContent>
            <NavbarContent id={"window-chrome-actions"} justify={"end"} className={"gap-0"}>
                <NavbarItem className={"m-0"} style={{display: actions.minimize ? "" : "none"}}>
                    <Button variant={"light"} size={"sm"} className={"max-w-[24px] h-6"} onClick={() => actions.onMaximize!(WindowChrome.getInstance().isMinimized)}> <MinimizeIcon opacity={.5} size={12}/> </Button>
                </NavbarItem>
                <NavbarItem className={"m-0"} style={{display: actions.maximize ? "" : "none"}}>
                    <Button variant={"light"} size={"sm"} className={"w-6 h-6"} onClick={() => actions.onMaximize!(WindowChrome.getInstance().isMaximized)}>
                        <MaximizeIcon opacity={.5} size={12}/>
                    </Button>
                </NavbarItem>
                <NavbarItem className={"m-0"} style={{display: actions.close ? "" : "none"}}>
                    <Button variant={"light"} size={"sm"} color={"danger"} className={"w-6 h-6"} onClick={() => actions.onClose!()}>
                        <XIcon opacity={.5} size={18}/>
                    </Button>
                </NavbarItem>
            </NavbarContent>

        </Navbar>
    );
}

