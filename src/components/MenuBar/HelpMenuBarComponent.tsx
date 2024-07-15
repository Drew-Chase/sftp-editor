import {Button, Dropdown, DropdownItem, DropdownMenu, DropdownSection, DropdownTrigger} from "@nextui-org/react";
import {useNavigate} from "react-router-dom";

export default function HelpMenuBarComponent() {
    const navigate = useNavigate();
    return (
        <Dropdown>
            <DropdownTrigger>
                <Button variant={"light"} size={"sm"}>Help</Button>
            </DropdownTrigger>
            <DropdownMenu>
                <DropdownSection title={"open source"} showDivider>
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
                </DropdownSection>

                <DropdownItem
                    key={"check-updates"}
                    description={"Current version: 0.0.0"}
                >
                    Check for Updates
                </DropdownItem>
                <DropdownItem
                    key={"view-logs"}
                    description={"view the logs for the app"}
                    onClick={() => navigate("/logs")}
                >
                    View Logs
                </DropdownItem>
                <DropdownItem
                    key={"about-app"}
                    description={"more information about the app"}
                    onClick={() => navigate("/settings/about")}
                >
                    About
                </DropdownItem>
            </DropdownMenu>
        </Dropdown>
    )
}