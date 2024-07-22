import {useState} from "react";
import {Autocomplete, AutocompleteItem, Button, cn, DateRangePicker, Input, Switch} from "@nextui-org/react";
import {parseZonedDateTime} from "@internationalized/date";

export interface LogFilter
{
    showDebug: boolean;
    showInfo: boolean;
    showWarn: boolean;
    showError: boolean;
    limit: number;
    startDate: Date;
    endDate: Date;
    search?: string;
}

export default function LogFilterPanel({filter, isOpen, onFilterChange}: { filter?: LogFilter, isOpen: boolean, onFilterChange?: (filter: LogFilter) => void })
{
    const [showDebug, setShowDebug] = useState(filter?.showDebug ?? true);
    const [showInfo, setShowInfo] = useState(filter?.showInfo ?? true);
    const [showWarn, setShowWarn] = useState(filter?.showWarn ?? true);
    const [showError, setShowError] = useState(filter?.showError ?? true);
    const [limit, setLimit] = useState(filter?.limit ?? 100);
    const [startDate, setStartDate] = useState(filter?.startDate ?? new Date());
    const [endDate, setEndDate] = useState(filter?.endDate ?? new Date());
    const [search, setSearch] = useState(filter?.search ?? "");
    let hasValueChanged = true;

    const applyFilter = () =>
    {
        if (onFilterChange)
        {
            onFilterChange({
                showDebug: showDebug,
                showInfo: showInfo,
                showWarn: showWarn,
                showError: showError,
                limit: limit,
                startDate: startDate,
                endDate: endDate,
                search: search
            });
            hasValueChanged = false;
        }
    };

    return (
        <div id={"log-filter-panel"} className={`fixed top-0 left-0 w-full h-full backdrop-blur-sm z-[11] ${isOpen ? "open" : "closed"}`}>

            <div className={"bg-[hsla(0,5%,5%,100%)] w-[50%] min-w-[400px] max-w-[600px] h-[calc(100vh_-_4rem)] flex flex-col mt-[3rem] ml-[1rem] pl-4 pr-2 pb-[5rem] gap-3 overflow-y-scroll relative rounded-lg"}>
                <Input label={"Search"} variant={"underlined"} value={search} onValueChange={setSearch}/>

                <Autocomplete
                    label={"Limit"}
                    defaultSelectedKey={limit.toString()}
                    allowsCustomValue
                    variant={"underlined"}
                    onValueChange={value =>
                    {
                        const limit = parseInt(value);
                        if (limit && !isNaN(limit))
                        {
                            setLimit(limit);
                            hasValueChanged = true;
                        }

                    }}
                    onSelectionChange={value =>
                    {
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
                <Switch
                    isSelected={showDebug}
                    onValueChange={setShowDebug}
                    classNames={{
                        base: cn(
                            "inline-flex flex-row-reverse w-full max-w-full bg-content1 hover:bg-content2 items-center max-h-[6rem]",
                            "justify-between cursor-pointer rounded-lg gap-2 p-4 border-2 border-transparent my-1 "
                        ),
                        wrapper: "p-0 h-4 overflow-visible",
                        thumb: cn("w-6 h-6 border-2 shadow-lg",
                            "group-data-[hover=true]:border-primary",
                            "group-data-[selected=true]:ml-6",
                            "group-data-[pressed=true]:w-7",
                            "group-data-[selected]:group-data-[pressed]:ml-4"
                        )
                    }}
                >
                    <div className="flex flex-col gap-1">
                        <p className="text-medium">Debug</p>
                    </div>
                </Switch>

                <Switch
                    isSelected={showInfo}
                    onValueChange={setShowInfo}
                    classNames={{
                        base: cn(
                            "inline-flex flex-row-reverse w-full max-w-full bg-content1 hover:bg-content2 items-center max-h-[6rem]",
                            "justify-between cursor-pointer rounded-lg gap-2 p-4 border-2 border-transparent my-1 "
                        ),
                        wrapper: "p-0 h-4 overflow-visible",
                        thumb: cn("w-6 h-6 border-2 shadow-lg",
                            "group-data-[hover=true]:border-primary",
                            "group-data-[selected=true]:ml-6",
                            "group-data-[pressed=true]:w-7",
                            "group-data-[selected]:group-data-[pressed]:ml-4"
                        )
                    }}
                >
                    <div className="flex flex-col gap-1">
                        <p className="text-medium">Info</p>
                    </div>
                </Switch>

                <Switch
                    isSelected={showWarn}
                    onValueChange={setShowWarn}
                    classNames={{
                        base: cn(
                            "inline-flex flex-row-reverse w-full max-w-full bg-content1 hover:bg-content2 items-center max-h-[6rem]",
                            "justify-between cursor-pointer rounded-lg gap-2 p-4 border-2 border-transparent my-1 "
                        ),
                        wrapper: "p-0 h-4 overflow-visible",
                        thumb: cn("w-6 h-6 border-2 shadow-lg",
                            "group-data-[hover=true]:border-primary",
                            "group-data-[selected=true]:ml-6",
                            "group-data-[pressed=true]:w-7",
                            "group-data-[selected]:group-data-[pressed]:ml-4"
                        )
                    }}
                >
                    <div className="flex flex-col gap-1">
                        <p className="text-medium">Warn</p>
                    </div>
                </Switch>

                <Switch
                    isSelected={showError}
                    onValueChange={setShowError}
                    classNames={{
                        base: cn(
                            "inline-flex flex-row-reverse w-full max-w-full bg-content1 hover:bg-content2 items-center max-h-[6rem]",
                            "justify-between cursor-pointer rounded-lg gap-2 p-4 border-2 border-transparent my-1 "
                        ),
                        wrapper: "p-0 h-4 overflow-visible",
                        thumb: cn("w-6 h-6 border-2 shadow-lg",
                            "group-data-[hover=true]:border-primary",
                            "group-data-[selected=true]:ml-6",
                            "group-data-[pressed=true]:w-7",
                            "group-data-[selected]:group-data-[pressed]:ml-4"
                        )
                    }}
                >
                    <div className="flex flex-col gap-1">
                        <p className="text-medium">Error</p>
                    </div>
                </Switch>
                <DateRangePicker
                    label={"Time Range"}
                    hideTimeZone
                    visibleMonths={2}
                    variant={"underlined"}
                    classNames={{
                        base: "w-90"
                    }}
                    onChange={value =>
                    {
                        setStartDate(value.start.toDate());
                        setEndDate(value.end.toDate());
                    }}
                    defaultValue={(() =>
                    {
                        let end: Date | string = new Date();
                        let start: Date | string = new Date(end.setDate(end.getDate() - 1));

                        end = end.toISOString();
                        start = start.toISOString();

                        end = `${end.split("T")[0]}T${end.split("T")[1].split(".")[0]}`;
                        start = `${start.split("T")[0]}T${start.split("T")[1].split(".")[0]}`;

                        const currentTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

                        return {
                            start: parseZonedDateTime(`${start}[${currentTimeZone}]`),
                            end: parseZonedDateTime(`${end}[${currentTimeZone}]`)
                        };
                    })()}
                />
                <Button className={"fixed bottom-[1.5rem] left-[1.5rem] min-w-[100px]"} style={{opacity: hasValueChanged ? "1" : "0", pointerEvents: hasValueChanged ? "all" : "none"}} color={"primary"} onClick={applyFilter}>Apply</Button>
            </div>


        </div>
    );
}