import React from "react";
import {Navbar, NavbarContent, NavbarItem} from "@nextui-org/navbar";
import {Button, Dropdown, DropdownItem, DropdownMenu, DropdownSection, DropdownTrigger, Kbd, NavbarMenuToggle} from "@nextui-org/react";
import {MaximizeIcon, MinimizeIcon, XIcon} from "./Icons.tsx";
import WindowChrome from "../assets/ts/WindowChrome.ts";
import "../assets/scss/chrome.scss";
import ConnectionManager, {calculateTimeDifference, Connection} from "../assets/ts/ConnectionManager.ts";
import {useNavigate} from "react-router-dom";
import KeyboardShortcuts, {ModifierKey} from "../assets/ts/KeyboardShortcuts.ts";


export default function MenuBar()
{
    const connections = ConnectionManager.instance.getConnections();
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);
    const byJoined: Connection[] = connections.sort((a, b) => b.last_connected_at.getTime() - a.last_connected_at.getTime()).slice(0, 3).filter(i => i.created_at !== i.last_connected_at);
    const navigate = useNavigate();

    // Register the keyboard shortcuts for the menu bar.
    // This will allow the user to press the control key and the letter "b" to navigate to the site browser.
    KeyboardShortcuts.instance.push({
        key: ["b"],
        modifierKeys: [ModifierKey.Control],
        description: "Navigate to the site browser.",
        callback: () => navigate("/site-browser/new")
    });

    // This will allow the user to press the control key, the alt key, and the letter "s" to navigate to the settings page.
    KeyboardShortcuts.instance.push({
        key: ["s"],
        modifierKeys: [ModifierKey.Control, ModifierKey.Alt],
        description: "Navigate to the settings page.",
        callback: () => navigate("/settings")
    });


    return (
        <Navbar id={"window-chrome"} onMenuOpenChange={setIsMenuOpen} maxWidth={"full"} height={"32px"} classNames={{base: "m-0", wrapper: "px-0"}}>
            <NavbarContent id={"window-menu-bar"}>
                <NavbarMenuToggle aria-label={isMenuOpen ? "Close menu" : "Open menu"} className="sm:hidden"/>
                <NavbarItem>
                    <Dropdown>
                        <DropdownTrigger>
                            <Button variant={"light"} size={"sm"}>SFTP Editor</Button>
                        </DropdownTrigger>
                        <DropdownMenu>
                            <DropdownItem
                                key={"site-browser"}
                                shortcut={<Kbd keys={["command"]}>B</Kbd>}
                                description={"list of saved connections"}
                                href={"/site-browser/new"}
                            >
                                Site Browser
                            </DropdownItem>
                            <DropdownItem
                                key={"settings"}
                                shortcut={<Kbd keys={["command", "option"]}>S</Kbd>}
                                description={"preferences for sftp editor"}
                                href={"/settings"}
                            >
                                Settings
                            </DropdownItem>
                            <DropdownSection title={"Recent Connections"}>
                                {byJoined.map(connection =>
                                {
                                    return (
                                        <DropdownItem key={connection.id}
                                                      description={`Last joined: ${calculateTimeDifference(connection.last_connected_at)}`}
                                                      onClick={() =>
                                                      {
                                                          ConnectionManager.instance.connect(connection);

                                                          // This uses the useNavigate hook from react-router-dom to navigate to the connection page.
                                                          // The function looks a little funny because it's a hook that returns a FunctionComponent.
                                                          // For more information on useNavigate see: https://reactrouter.com/en/main/hooks/use-navigate
                                                          navigate(`/connection/${connection.id}`);
                                                      }}
                                        >
                                            {connection.name}
                                        </DropdownItem>
                                    );
                                })}
                            </DropdownSection>
                        </DropdownMenu>
                    </Dropdown>
                    <Dropdown>
                        <DropdownTrigger>
                            <Button variant={"light"} size={"sm"}>Help</Button>
                        </DropdownTrigger>
                        <DropdownMenu>
                            <DropdownItem
                                key={"check-updates"}
                                description={"Current version: 0.0.0"}
                            >
                                Check for Updates
                            </DropdownItem>
                            <DropdownItem
                                key={"source-code"}
                                description={"view the github page"}
                                href={"https://github.com/drew-chase/sftp-editor"}
                                target={"_blank"}
                            >
                                Source Code
                            </DropdownItem>
                            <DropdownItem
                                key={"report-issue"}
                                description={"report a bug on github"}
                                href={"https://github.com/drew-chase/sftp-editor/issues/new/?assignees=drew-chase&labels=bug&template=bug_report.md&title=[BUG]%3A+"}
                                target={"_blank"}
                            >
                                Report Issue
                            </DropdownItem>
                            <DropdownItem
                                key={"request-feature"}
                                description={"request a feature on github"}
                                href={"https://github.com/drew-chase/sftp-editor/issues/new/?assignees=drew-chase&labels=enhancement&template=feature_request.md&title=[FEATURE]%3A+"}
                                target={"_blank"}
                            >
                                Feature Request
                            </DropdownItem>
                            <DropdownItem
                                key={"about-app"}
                                description={"more information about the app"}
                                href={"/settings/about"}
                            >
                                About
                            </DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                </NavbarItem>
            </NavbarContent>
            <NavbarContent id={"window-drag-bar"} className={"w-full bg-transparent hover:bg-foreground/10 transition-[background] rounded-md"} data-tauri-drag-region></NavbarContent>
            <NavbarContent id={"window-chrome-actions"} justify={"end"} className={"gap-0"}>
                <NavbarItem className={"m-0"}> <Button variant={"light"} size={"sm"} className={"max-w-[24px] h-6"} onClick={() => WindowChrome.getInstance().toggleMinimize()}> <MinimizeIcon opacity={.5} size={12}/> </Button> </NavbarItem>
                <NavbarItem className={"m-0"}> <Button variant={"light"} size={"sm"} className={"w-6 h-6"} onClick={() => WindowChrome.getInstance().toggleMaximize()}> <MaximizeIcon opacity={.5} size={12}/> </Button> </NavbarItem>
                <NavbarItem className={"m-0"}> <Button variant={"light"} size={"sm"} color={"danger"} className={"w-6 h-6"} onClick={() => WindowChrome.getInstance().close()}> <XIcon opacity={.5} size={18}/> </Button> </NavbarItem>
            </NavbarContent>

        </Navbar>
    );
}

