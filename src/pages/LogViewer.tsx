import {Autocomplete, AutocompleteItem, DateRangePicker, Switch} from "@nextui-org/react";
import Log from "../components/LogView/Log.tsx";
import {useState} from "react";
import {parseZonedDateTime} from "@internationalized/date";

export default function LogViewer()
{
    const [showDebug, setShowDebug] = useState<boolean>(true);
    const [showInfo, setShowInfo] = useState<boolean>(true);
    const [showWarn, setShowWarn] = useState<boolean>(true);
    const [showError, setShowError] = useState<boolean>(true);
    const [limit, setLimit] = useState<number>(100);

    return (
        <div className={"m-8"}>
            <div className={"flex-row flex mb-3 gap-4"}>
                <div className={"flex flex-col gap-3"}>
                    <div className={"flex flex-row gap-3"}>
                        <Switch
                            isSelected={showDebug}
                            size={"sm"}
                            className={"dark:bg-[#101010] hover:dark:bg-[#151515] bg-[#c0c0c0] hover:bg-[#c9c9c9] rounded-md p-3 transition-all"}
                            onValueChange={
                                value =>
                                {
                                    setShowDebug(value);
                                }
                            }
                        >
                            Debug
                        </Switch>
                        <Switch
                            isSelected={showInfo}
                            size={"sm"}
                            className={"dark:bg-[#101010] hover:dark:bg-[#151515] bg-[#c0c0c0] hover:bg-[#c9c9c9] rounded-md p-3 transition-all"}
                            onValueChange={
                                value =>
                                {
                                    setShowInfo(value);
                                }
                            }
                        >
                            Info
                        </Switch>
                        <Switch
                            isSelected={showWarn}
                            size={"sm"}
                            className={"dark:bg-[#101010] hover:dark:bg-[#151515] bg-[#c0c0c0] hover:bg-[#c9c9c9] rounded-md p-3 transition-all"}
                            onValueChange={
                                value =>
                                {
                                    setShowWarn(value);
                                }
                            }
                        >
                            Warnings
                        </Switch>
                        <Switch
                            isSelected={showError}
                            size={"sm"}
                            className={"dark:bg-[#101010] hover:dark:bg-[#151515] bg-[#c0c0c0] hover:bg-[#c9c9c9] rounded-md p-3 transition-all"}
                            onValueChange={
                                value =>
                                {
                                    setShowError(value);
                                }
                            }
                        >
                            Errors
                        </Switch>
                    </div>
                    <div className={"flex flex-row w-full gap-3"}>
                        <DateRangePicker
                            label={"Time Range"}
                            hideTimeZone
                            visibleMonths={2}
                            classNames={{
                                base: "w-90"
                            }}
                            defaultValue={(() =>
                            {
                                let end: Date | string = new Date();
                                let start: Date | string = new Date(end.setDate(end.getDate() - 1));

                                end = end.toISOString();
                                start = start.toISOString();

                                end = `${end.split("T")[0]}T${end.split("T")[1].split(".")[0]}`;
                                start = `${start.split("T")[0]}T${start.split("T")[1].split(".")[0]}`;


                                return {
                                    start: parseZonedDateTime(`${start}[America/New_York]`),
                                    end: parseZonedDateTime(`${end}[America/New_York]`)
                                };
                            })()}
                        />
                        <Autocomplete
                            label={"Limit"}
                            defaultSelectedKey={limit.toString()}
                            allowsCustomValue
                            classNames={{
                                base: "w-32"
                            }}
                            onValueChange={value =>
                            {
                                console.debug(`Limit Filter Changed`, value);
                                const limit = parseInt(value);
                                if (limit && !isNaN(limit))
                                    setLimit(limit);
                            }}
                            onSelectionChange={value =>
                            {
                                console.log(`Selection Changed: ${value}`);
                                if (value === null) return;
                                const limit = parseInt(value.toString());
                                if (limit && !isNaN(limit))
                                    setLimit(limit);
                            }}
                        >

                            <AutocompleteItem key={"10"}>10</AutocompleteItem>
                            <AutocompleteItem key={"25"}>25</AutocompleteItem>
                            <AutocompleteItem key={"50"}>50</AutocompleteItem>
                            <AutocompleteItem key={"100"}>100</AutocompleteItem>
                            <AutocompleteItem key={"500"}>500</AutocompleteItem>
                            <AutocompleteItem key={"1000"}>1000</AutocompleteItem>
                        </Autocomplete>
                    </div>
                </div>
            </div>
            <Log showDebug={showDebug} showInfo={showInfo} showWarn={showWarn} showError={showError} limit={limit}/>
        </div>
    );
}