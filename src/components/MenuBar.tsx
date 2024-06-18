import React from "react";
import {Navbar, NavbarContent, NavbarItem} from "@nextui-org/navbar";
import {Button, Dropdown, DropdownItem, DropdownMenu, DropdownSection, DropdownTrigger, Kbd, NavbarMenuToggle} from "@nextui-org/react";


export default function MenuBar()
{
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);

    return (
        <Navbar onMenuOpenChange={setIsMenuOpen} maxWidth={"full"} height={"32px"}>
            <NavbarContent>
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
                            >
                                Site Browser
                            </DropdownItem>
                            <DropdownItem
                                key={"settings"}
                                shortcut={<Kbd keys={["command", "option"]}>S</Kbd>}
                                description={"preferences for sftp editor"}
                            >
                                Settings
                            </DropdownItem>
                            <DropdownSection title={"Recent Connections"}>
                                <DropdownItem key={"recent-1"}> Connection 1 </DropdownItem>
                                <DropdownItem key={"recent-2"}> Connection 2 </DropdownItem>
                                <DropdownItem key={"recent-3"}> Connection 3 </DropdownItem>
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
                                key={"check-updates"}
                                description={"more information about the app"}
                            >
                                About
                            </DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                </NavbarItem>
            </NavbarContent>
        </Navbar>
    );
}

