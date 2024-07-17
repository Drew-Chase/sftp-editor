import {Accordion, AccordionItem} from "@nextui-org/react";

export default function JsonHierarchyComponent({key, content}: {key:string, content: any })
{
    const keys = Object.keys(content);
    const supportedTypes = ["number", "string", "boolean"];
    return (
        <Accordion key={key} style={{backgroundColor: "rgba(0,0,0,0.2)"}}>
            {
                keys.map((k: string) =>
                {
                    return (
                        <AccordionItem startContent={<div className={"text-medium inline-flex"}><span className={"font-bold pr-2"}>{k}</span><div className={"truncate max-w-[200px] opacity-70"}>{content[k]}</div></div>}>
                            {supportedTypes.includes(typeof content[k]) ? <span className={"text-medium pl-4"}><span className={"font-bold pr-2"}>{k}:</span>{content[k]}</span> : <JsonHierarchyComponent key={`${key}-${k}`} content={content[k]}/>}
                        </AccordionItem>
                    );
                })
            }
        </Accordion>
    );
}