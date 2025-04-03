import dayjs from "dayjs";

export default function Tratativa({ event }: any) {
    return (
        <div className="flex flex-col px-2">
            <div className={`${"font-bold"}`}>{event?.name}</div>
            <span className="text-sm">{event?.description}</span>
            <span className="text-xs text-slate-600">{dayjs(event?.date).format("DD/MM/YY HH:mm")}</span>
        </div>
    );
}
