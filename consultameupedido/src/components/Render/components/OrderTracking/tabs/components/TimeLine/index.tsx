import { useEffect, useState } from "react";
import { Loader } from "rtk-ux";
import { list } from "../../../../../api";
import TimeLine from "./components/TimeLine";

const MpTimeLine = ({ order }: { order: any }) => {
    const [data, setData] = useState<any>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        try {
            setLoading(true);
            list("mp_package_timeline", { filter: { _id: order?._id } }, null, "query").then(({ data }) => {
                setLoading(false);
                if (data && data[0]) {
                    const _data = data[0];
                    const items = [
                        ...(_data?.eventos || []).map((e: any) => ({
                            ...e,
                            __type: "event",
                        })),
                        ...(_data?.mensagens || []).map((e: any) => ({
                            ...e,
                            __type: "message",
                        })),
                        ...(_data?.tickets || []).map((e: any) => ({
                            ...e,
                            __type: "ticket",
                        })),
                        ...(_data?.tratativas || []).map((e: any) => ({
                            ...e,
                            __type: "tratativa",
                        })),
                    ].sort((a, b) => {
                        return new Date(a?.date).getTime() - new Date(b?.date).getTime();
                    });
                    setData(items);
                }
            });
        } catch (error) {
            setLoading(false);
        }
        return () => {};
    }, [order?._id]);

    return (
        <div className="py-12 px-4 overflow-auto">
            {loading ? (
                <div className="py-16 flex items-center justify-center">
                    <Loader />
                </div>
            ) : (
                <TimeLine data={data} id={order?._id} />
            )}
        </div>
    );
};
export default MpTimeLine;
