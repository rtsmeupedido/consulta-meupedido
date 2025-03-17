import dayjs from "dayjs";
import { useState } from "react";
import { message, MuiIcon, Table, Tag, Tooltip } from "rtk-ux";

type Props = {
    data: any;
    items: any[];
};

export default function Brand({ data, items }: Props) {
    const [showDetail, setShowDetail] = useState(true);
    function onSelect() {
        setShowDetail(!showDetail);
    }

    const formatItems = items?.map((i) => ({
        ...i,
        valor_sobrando: (i?.value || 0) - (i?.value_used || 0),
    }));

    return (
        <div className="flex flex-col px-3 text-sm gap-0.5 relative">
            <div className="flex text-blue-700 items-center justify-between">
                <div className="flex flex-col">
                    <div className="flex gap-1">
                        <div className="font-semibold">{data?.name}</div>
                        {data?.amount && (
                            <div className="flex items-center gap-1">
                                {" - "}
                                Crédito disponível:
                                <strong>
                                    {new Intl.NumberFormat("pt-BR", {
                                        style: "currency",
                                        currency: "BRL",
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                    }).format(data?.amount)}
                                </strong>
                            </div>
                        )}
                    </div>
                </div>
                <MuiIcon icon={["mui", showDetail ? "clear" : "remove_red_eye"]} color="black" className="cursor-pointer hover:text-blue-600" onClick={() => onSelect()} />
            </div>
            {showDetail && (
                <div className="flex mt-2 mb-2 flex-1 border rounded-md h-full overflow-hidden">
                    <Table
                        className="w-full"
                        columns={[
                            { title: "GIFT BOX", dataIndex: "id", render: (_id, row) => row?.gift_card_box?.name, width: 200, ellipsis: true },
                            { title: "E-MAIL", dataIndex: "user_code", width: 200, ellipsis: true },
                            { title: "MARCA", dataIndex: "id", render: (_a, row) => row?.brand_creation?.name, width: 120, ellipsis: true },
                            {
                                title: "CÓDIGO GIFT CARD",
                                dataIndex: "code",
                                width: 250,
                                ellipsis: true,
                                render: (code) => (
                                    <Tooltip title="Copiar">
                                        <div
                                            className="cursor-pointer text-blue-600"
                                            onClick={() => {
                                                navigator.clipboard.writeText(code);
                                                message.success("Código copiado");
                                            }}
                                        >
                                            {code}
                                        </div>
                                    </Tooltip>
                                ),
                            },
                            {
                                title: "VALOR",
                                dataIndex: "value",
                                width: 120,
                                render: (vl) =>
                                    new Intl.NumberFormat("pt-BR", {
                                        style: "currency",
                                        currency: "BRL",
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                    }).format(vl),
                            },
                            {
                                title: "VALOR UTILIZADO",
                                dataIndex: "value_used",
                                width: 150,
                                render: (vl) =>
                                    new Intl.NumberFormat("pt-BR", {
                                        style: "currency",
                                        currency: "BRL",
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                    }).format(vl),
                            },
                            {
                                title: "VALOR RESTANTE",
                                dataIndex: "valor_sobrando",
                                width: 150,
                                render: (vl) =>
                                    new Intl.NumberFormat("pt-BR", {
                                        style: "currency",
                                        currency: "BRL",
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                    }).format(vl),
                            },
                            { title: "DOCUMENTO", dataIndex: "document", width: 150 },
                            { title: "CNPJ", dataIndex: "cnpj", width: 140 },
                            { title: "STATUS", dataIndex: "enabled", width: 100, ellipsis: true, render: (enable) => <Tag color={enable ? "blue" : "red"}>{enable ? "Habilitado" : "Desabilitado"}</Tag> },
                            { title: "DATA DE EXPIRAÇÃO", dataIndex: "expiration_date", render: (date) => (date ? dayjs(date).format("DD/MM/YY HH:mm") : "-"), width: 180, align: "center" },
                            {
                                title: "EXPIRADO",
                                dataIndex: "expiration_date",
                                render: (date) => {
                                    const expired = dayjs(date).isBefore(dayjs()) ? true : false;
                                    return date ? <Tag color={expired ? "red" : "green"}>{expired ? "Sim" : "Não"}</Tag> : "-";
                                },
                                width: 180,
                                align: "center",
                            },
                            // { title: "AÇÕES", width: 130, dataIndex: "id", render: () => <MuiIcon className="mt-2 cursor-pointer" width={10} icon={["muil", "share"]} color="#19add6" /> },
                        ]}
                        scroll={{ x: 100 }}
                        size="small"
                        dataSource={formatItems}
                    />
                </div>
            )}
        </div>
    );
}
