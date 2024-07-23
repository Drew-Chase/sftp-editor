import {useState} from "react";
import {Autocomplete, AutocompleteItem, Button, cn, DateRangePicker, Input, Switch} from "@nextui-org/react";
import {DateDuration, getLocalTimeZone, parseZonedDateTime, today} from "@internationalized/date";
import $ from "jquery";

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
    const [hasValueChanged, setHasValueChanged] = useState<boolean>(false);

    const applyFilter = () =>
    {
        if (onFilterChange && hasValueChanged)
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
            setHasValueChanged(false);
        }
        $("#log-panel-toggle").trigger("click");
    };

    $("#log-filter-panel-wrapper").on("click", e =>
    {
        const target = e.target as HTMLElement;
        if (target.id === "log-filter-panel-wrapper")
        {
            applyFilter();
        }
    });

    return (
        <div id={"log-filter-panel-wrapper"} className={`fixed top-0 left-0 w-full h-full backdrop-blur-sm z-[11] cursor-pointer ${isOpen ? "open" : "closed"}`}>

            <div id={"log-filter-panel"} className={"dark:bg-[hsla(0,5%,5%,100%)] bg-[hsla(0,5%,90%,100%)] cursor-default w-[50%] min-w-[400px] max-w-[600px] h-[calc(100vh_-_4rem)] flex flex-col mt-[3rem] ml-[1rem] pl-4 pr-2 pb-[5rem] gap-3 overflow-y-scroll overflow-x-hidden relative rounded-lg"}>
                <Input label={"Search"} variant={"underlined"} value={search} onValueChange={value =>
                {
                    setSearch(value);
                    setHasValueChanged(true);
                }}/>

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
                            setHasValueChanged(true);
                        }

                    }}
                    onSelectionChange={value =>
                    {
                        if (value === null) return;
                        const limit = parseInt(value.toString());
                        if (limit && !isNaN(limit))
                            setLimit(limit);
                        setHasValueChanged(true);
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
                    onValueChange={value =>
                    {
                        setShowDebug(value);
                        setHasValueChanged(true);
                    }}
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
                    onValueChange={value =>
                    {
                        setShowInfo(value);
                        setHasValueChanged(true);
                    }}
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
                    onValueChange={value =>
                    {
                        setShowWarn(value);
                        setHasValueChanged(true);
                    }}
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
                    onValueChange={value =>
                    {
                        setShowError(value);
                        setHasValueChanged(true);
                    }}
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
                    maxValue={today(getLocalTimeZone()).add({days: 1} as DateDuration)}
                    onChange={value =>
                    {
                        setStartDate(value.start.toDate());
                        setEndDate(value.end.toDate());
                        setHasValueChanged(true);
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
                <Button className={"fixed bottom-[1.5rem] left-[1.5rem] min-w-[100px] transition-opacity duration-200"} style={{opacity: hasValueChanged ? "1" : "0", pointerEvents: hasValueChanged ? "all" : "none"}} color={"primary"} onClick={applyFilter}>Apply</Button>
            </div>


        </div>
    );
}