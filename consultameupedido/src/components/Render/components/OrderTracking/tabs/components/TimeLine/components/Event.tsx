import dayjs from "dayjs";

export default function Event({ event }: any) {
    const isEventLow = event?.__type === "event" && !event?.name && event?.description;
    return (
        <div className="flex flex-col px-2">
            <div className={`${isEventLow ? "font-light" : "font-bold"}`}>{event?.name || event?.description}</div>
            {event?.__type !== "event" && <span className="text-sm">{event?.description}</span>}
            <span className="text-xs text-slate-600">{dayjs(event?.date).format("DD/MM/YY HH:mm")}</span>
        </div>
    );
}
