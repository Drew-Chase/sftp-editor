import {BreadcrumbItem, Breadcrumbs} from "@nextui-org/react";
import Log from "../../assets/ts/Logger.ts";

export default function PathBreadcrumb({path, onPathSelected}: { path: string, onPathSelected: (path: string) => void })
{
    Log.debug(`Loading PathBreadcrumb with path: {0}`, path);
    return (
        <Breadcrumbs className={"mt-4"}>
            {path.split("/").map((item, index) =>
            {
                const newPath = path.split("/").slice(0, index + 1).join("/");
                return (
                    <BreadcrumbItem
                        key={index}
                        onClick={() => onPathSelected(newPath === "" ? "/" : newPath)}
                    >
                        {index === 0 && (item == "" || item == "/") ? "root" : item}
                    </BreadcrumbItem>
                );
            })
            }
        </Breadcrumbs>
    );

}