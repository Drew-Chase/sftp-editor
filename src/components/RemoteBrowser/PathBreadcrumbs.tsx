import {BreadcrumbItem, Breadcrumbs} from "@nextui-org/react";

export default function PathBreadcrumb({path, onPathSelected}: { path: string, onPathSelected: (path: string) => void })
{
    console.log(`Loading PathBreadcrumb with path: ${path}`);
    return (
        <Breadcrumbs className={"ml-8 mt-4"}>
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