import {Accordion, AccordionItem} from "@nextui-org/react";

export default function JsonHierarchyComponent({content}: { content: any })
{
    const keys = Object.keys(content);
    const supportedTypes = ["number", "string", "boolean"];
    return (
        <Accordion style={{backgroundColor: "rgba(0,0,0,0.2)"}}>
            {
                keys.map((key: string) =>
                {
                    return (
                        <AccordionItem startContent={<div className={"text-medium inline-flex"}><span className={"font-bold pr-2"}>{key}</span><div className={"truncate max-w-[200px] opacity-70"}>{content[key]}</div></div>}>
                            {supportedTypes.includes(typeof content[key]) ? <span className={"text-medium pl-4"}><span className={"font-bold pr-2"}>{key}:</span>{content[key]}</span> : <JsonHierarchyComponent content={content[key]}/>}
                        </AccordionItem>
                    );
                })
            }
        </Accordion>
    );
}