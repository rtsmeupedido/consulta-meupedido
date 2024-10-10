import { useEffect, useState } from "react";
import { Table } from "rtk-ux";
import { list } from "../../../api";
import * as dayjs from "dayjs";

export default function AllEvents({ id, isModal }: any) {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const init = async () => {
        setLoading(true);
        return await list(
            "mp_eventos_tracking_page",
            {
                filter: { pacote: id },
            },
            {},
            "query"
        ).then(({ data }: any) => {
            setData(data);
            setLoading(false);
        });
    };

    useEffect(() => {
        if (!id) return;
        init();
    }, [id]);

    return (
        <div>
            {loading ? (
                <div className="m-4 text-center">Carregando eventos... Aguarde</div>
            ) : (
                <div
                    style={{
                        overflow: "auto",
                        height: isModal ? 330 : "calc(100vh - 250px)",
                    }}
                >
                    <Table
                        dataSource={data}
                        components={{
                            body: {
                                cell: (props: any) => (
                                    <td {...props} className={`${props.className} h-10 p-2`}>
                                        {props.children}
                                    </td>
                                ),
                            },
                        }}
                        pagination={false}
                        locale={{
                            emptyText: <div className="p-4 text-center">Nenhum pacote selecionado.</div>,
                        }}
                        columns={[
                            {
                                dataIndex: "api_event_name",
                                title: "Evento",
                                width: 300,
                            },
                            {
                                dataIndex: "carrier_node",
                                title: "Filial",
                                width: 200,
                            },
                            {
                                dataIndex: "event_date",
                                title: "Data",
                                width: 160,
                                render: (date) => date && dayjs(date).format("DD/MM/YYYY HH:mm"),
                            },
                            {
                                dataIndex: "source",
                                title: "Origem",
                                width: 160,
                            },
                        ]}
                    />
                </div>
            )}
        </div>
    );
}
