import KeyboardShortcuts, {ModifierKey} from "../../assets/ts/KeyboardShortcuts.ts";
import {useNavigate} from "react-router-dom";
import {Button, Dropdown, DropdownItem, DropdownMenu, DropdownSection, DropdownTrigger, Kbd} from "@nextui-org/react";
import ConnectionManager, {calculateTimeDifference, Connection} from "../../assets/ts/ConnectionManager.ts";

export default function SFTPEditorMenuBarComponent() {

    const connections = ConnectionManager.instance.getConnections();
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
        <>

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
                        {byJoined.map(connection => {
                            return (
                                <DropdownItem key={connection.id}
                                              description={`Last joined: ${calculateTimeDifference(connection.last_connected_at)}`}
                                              onClick={() => {
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

        </>
    );
}