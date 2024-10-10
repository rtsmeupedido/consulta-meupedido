import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { Collapse, Divider, Timeline, Tooltip } from "antd";

export default function LiveEvents({ order }: any) {
    const [data, setData] = useState<any>([]);
    const init = async () => {
        const pck = order?.package_events?.sort((a: any, b: any) => {
            return new Date(a?.event_date).getTime() - new Date(b?.event_date).getTime();
        });
        function agruparPorStatus(data: any) {
            let lastStatus: string | null = null;
            return data.map((item: any) => {
                if (item?.fase) {
                    lastStatus = item?.fase;
                } else if (lastStatus) {
                    item.fase = lastStatus;
                }
                return item;
            });
        }
        let group = agruparPorStatus(pck).reduce((r: any, a: any) => {
            r[a?.fase] = [...(r[a?.fase] || []), a];
            return r;
        }, {});

        setData(
            Object.keys(group).map((e) => {
                return {
                    name: e,
                    events: group[e],
                };
            })
        );
    };
    useEffect(() => {
        init();
    }, [order?.package_events]);

    return data?.length === 0 || !data ? (
        <></>
    ) : (
        <div className="flex flex-col gap-2 overflow-auto h-full p-1">
            <Timeline
                mode="left"
                items={[
                    ...data.map((rowData: any, id: number) => ({
                        key: id,
                        color: "green",
                        dot: <div className={"bg-green-600 w-3 h-3 rounded-full"} />,
                        children: (
                            <Collapse
                                ghost
                                defaultActiveKey={["1"]}
                                size="small"
                                items={[
                                    {
                                        key: "1",
                                        showArrow: false,
                                        classNames: {
                                            header: "px-0 pb-2 pt-1",
                                            body: "p-0",
                                        },
                                        label: <span className="capitalize mt-1 mb-1 text-xs text-gray-600 font-normal">{rowData?.name || ""}</span>,
                                        children: (
                                            <div className="flex flex-col gap-1">
                                                {(rowData?.events || [])?.map((event: any) => {
                                                    const rowValid = event?.system_event_name;
                                                    return (
                                                        <div key={event._id} className={`text-xs flex items-center ${rowValid ? "text-black" : "text-gray-400"}`}>
                                                            <div className="flex items-center w-1/2">
                                                                <div className="text-nowrap">{dayjs(event?.event_date).format("D [de] MMM., HH:mm")}</div>
                                                                <Divider type="vertical" className="h-4" />
                                                                <div className="line-clamp-1">{event?.system_event_name?.replace(/{{(\w+)}}/g, (_: any, key: any) => event[key])}</div>
                                                            </div>
                                                            <div className="flex items-center gap-3 w-1/2">
                                                                <Tooltip title={event?.api_event_name}>
                                                                    <div className={"w-56 line-clamp-1 lowercase"}>{event?.api_event_name}</div>
                                                                </Tooltip>
                                                                <div className={"w-24"}>{event?.api_table?.replace("mp_", "")?.replace("_eventos", "")}</div>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        ),
                                    },
                                ]}
                            ></Collapse>
                        ),
                    })),
                ]}
            />
        </div>
    );
}
