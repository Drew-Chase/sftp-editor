import {Input, Textarea} from "@nextui-org/react";
import {useEffect, useState} from "react";

export interface FileInputProps
{
    id?: string;
    label?: string;
    description?: string;
    variant?: "multiline" | "single-line";
    value?: string;
    valueType?: "name" | "path" | "base64" | "blob" | "file" | "contents";
    type?: "file" | "directory";
    /**
     * Called when the value changes
     * @param content
     */
    onChange?: (content: string) => void;
    /**
     * Called when the file input changes
     * @param file
     */
    onFileChange?: (file: FileList | null) => void;
}


export default function FileInput(props: FileInputProps)
{
    const [value, setValue] = useState<string>(props.value || "");
    useEffect(() => setValue(props.value || ""), [props.value]);

    const createInput = () =>
    {
        const input = document.createElement("input");
        if (props.type === "directory")
        {
            input.setAttribute("webkitdirectory", "");
            input.setAttribute("directory", "");
            input.multiple = true;
        }
        input.type = "file";
        if (props.id)
            input.id = props.id;
        input.onchange = () =>
        {
            props.onFileChange && props.onFileChange!(input.files);
            if (input.files !== null && input.files.length > 0)
            {
                const file = input.files[0];
                if (props.valueType === "name")
                {
                    props.onChange && props.onChange(file.name);
                    setValue(file.name);
                } else if (props.valueType === "path")
                {
                    props.onChange && props.onChange(URL.createObjectURL(file));
                    setValue(URL.createObjectURL(file));
                } else if (props.valueType === "base64")
                {
                    const reader = new FileReader();
                    reader.onload = (e) =>
                    {
                        props.onChange && props.onChange(e.target?.result as string);
                        setValue(e.target?.result as string);
                    };
                    reader.readAsDataURL(file);
                } else if (props.valueType === "blob")
                {
                    const reader = new FileReader();
                    reader.onload = (e) =>
                    {
                        props.onChange && props.onChange(e.target?.result as string);
                        setValue(e.target?.result as string);
                    };
                    reader.readAsDataURL(new Blob([file]));
                } else if (props.valueType === "file")
                {
                    props.onChange && props.onChange(file.toString() as string);
                    setValue(file.toString());
                } else if (props.valueType === "contents")
                {
                    const reader = new FileReader();
                    reader.onload = (e) =>
                    {
                        props.onChange && props.onChange(e.target?.result as string);
                        setValue(e.target?.result as string);
                    };
                    reader.readAsText(file);
                }
            }
        };
        input.click();
    };
    return (
        props.variant === "single-line" ?
            <Input classNames={{
                input: "cursor-pointer",
                inputWrapper: "cursor-pointer",
                mainWrapper: "cursor-pointer",
                innerWrapper: "cursor-pointer"
            }} label={props.label} description={props.description} value={value} isReadOnly onFocus={(e) =>
            {
                createInput();
                // @ts-ignore
                e.target.blur();

            }}/> :
            <Textarea classNames={{
                input: "cursor-pointer",
                inputWrapper: "cursor-pointer",
                mainWrapper: "cursor-pointer"
            }} label={props.label} description={props.description} value={value} isReadOnly onFocus={(e) =>
            {
                createInput();
                // @ts-ignore
                e.target.blur();
            }}/>
    );
}