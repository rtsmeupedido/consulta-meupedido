import dayjs from "dayjs";
import { Button } from "antd";

export default function Ticket({ event }: any) {
    return (
        <div className="flex flex-col px-2">
            <div className={`${"font-bold"}`}>{event?.name}</div>
            <span className="text-sm">{event?.description}</span>
            <span className="text-xs text-slate-600">{dayjs(event?.date).format("DD/MM/YY HH:mm")}</span>
            <Button color="primary" variant="outlined" size="small" className="text-xs mt-2 w-fit" onClick={() => window.open(event?.ticket_url, "__blank")}>
                Visualizar ticket
            </Button>
        </div>
    );
}
