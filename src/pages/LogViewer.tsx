import Log from "../components/LogView/Log.tsx";
import {useState} from "react";
import LogFilterPanel from "../components/LogView/LogFilterPanel.tsx";

export default function LogViewer({isFiltersPanelOpen}: { isFiltersPanelOpen: boolean })
{
    const [showDebug, setShowDebug] = useState<boolean>(true);
    const [showInfo, setShowInfo] = useState<boolean>(true);
    const [showWarn, setShowWarn] = useState<boolean>(true);
    const [showError, setShowError] = useState<boolean>(true);
    const [limit, setLimit] = useState<number>(100);
    const [search, setSearch] = useState<string | undefined>(undefined);
    const [endDate, setEndDate] = useState<Date>(new Date());
    const [startDate, setStartDate] = useState<Date>(new Date(endDate.setDate(endDate.getDate() - 1)));


    return (
        <>
            <LogFilterPanel
                isOpen={isFiltersPanelOpen}
                onFilterChange={
                    filter =>
                    {
                        setShowDebug(filter.showDebug);
                        setShowInfo(filter.showInfo);
                        setShowWarn(filter.showWarn);
                        setShowError(filter.showError);
                        setLimit(filter.limit);
                        setSearch(filter.search);
                        setStartDate(filter.startDate);
                        setEndDate(filter.endDate);
                    }
                }/>
            <div className={"m-8"}>
                <Log showDebug={showDebug} showInfo={showInfo} showWarn={showWarn} showError={showError} limit={limit} search={search} startDate={startDate} endDate={endDate}/>
            </div>
        </>
    );
}
