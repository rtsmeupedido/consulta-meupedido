import { Timeline } from "antd";
import Event from "./Event";
import Message from "./Message";
import Ticket from "./Ticket";
import Tratativa from "./Tratativa";
import Icon from "../../../../../../styles/Icon";

export default function TimeLine({ data = [] }: any) {
    return (
        <div className="flex flex-col gap-5 -mt-8">
            <Timeline
                mode="alternate"
                items={data?.map((event: any) => {
                    const isEventLow = event?.__type === "event" && !event?.name && event?.description;
                    return {
                        position: event?.side === "right" ? "left" : "right",
                        children:
                            event?.__type === "event" ? (
                                <Event event={event} />
                            ) : event?.__type === "message" ? (
                                <Message event={event} />
                            ) : event?.__type === "ticket" ? (
                                <Ticket event={event} />
                            ) : event?.__type === "tratativa" ? (
                                <Tratativa event={event} />
                            ) : (
                                <>Not Implemented</>
                            ),
                        dot: (
                            <div
                                className="w-5 h-5 max-h-5 rounded-full flex items-center justify-center"
                                style={{
                                    background: isEventLow ? "#cbd5e1" : event?.color || "#1e293b",
                                }}
                            >
                                <Icon width={10} icon={(event?.icon || "mui info").split(" ")} />
                            </div>
                        ),
                    };
                })}
            />
        </div>
    );
}
