import {cn, Switch} from "@nextui-org/react";

export default function SwitchOption(props: { label: string, description: string, selected?: boolean, onToggle?: (value: boolean) => void })
{
    return (
        <Switch
            isSelected={props.selected}
            onValueChange={props.onToggle}
            classNames={{
                base: cn(
                    "inline-flex flex-row-reverse w-full max-w-full bg-content1 hover:bg-content2 items-center",
                    "justify-between cursor-pointer rounded-lg gap-2 p-4 border-2 border-transparent my-1 ",
                    "data-[selected=true]:border-primary flex-grow",
                ),
                wrapper: "p-0 h-4 overflow-visible",
                thumb: cn("w-6 h-6 border-2 shadow-lg",
                    "group-data-[hover=true]:border-primary",
                    //selected
                    "group-data-[selected=true]:ml-6",
                    // pressed
                    "group-data-[pressed=true]:w-7",
                    "group-data-[selected]:group-data-[pressed]:ml-4"
                )
            }}
        >
            <div className="flex flex-col gap-1">
                <p className="text-medium">{props.label}</p>
                <p className="text-tiny text-default-400">{props.description}</p>
            </div>
        </Switch>
    );
}