/* eslint-disable @typescript-eslint/ban-ts-comment */
import Tab from "./tabs";
import dayjs from "dayjs";
import { useState } from "react";
import { list } from "../../api";
import * as Style from "./styles";
import HeaderSearch from "../HeaderSearch";
import { Button, Loader, Table } from "rtk-ux";
import SyncPackage from "./components/SyncPackage";
import { parseFilter, parsePackageStatus, saveLog } from "../../utils";
import { message } from "antd";

export default function OrderTracking({ onGetNf, brands, permissions }: { onGetNf: (str: string) => void; brands: any; permissions: any }) {
    const [messageApi, contextHolder] = message.useMessage();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showSync, setShowSync] = useState(false);
    const [orderSelected, setOrderSelected] = useState<any>(null);

    const handleFilter = (text: string) => {
        if (text.length < 2) return;
        setOrders([]);
        setOrderSelected(null);
        getData(text);
    };

    const getData = async (text: string) => {
        setLoading(true);
        const getItems = async (doc: string) => {
            const textFilter: string = doc ? doc : text;
            const filter = {
                before_filter: {
                    ...parseFilter(textFilter),
                },
            };
            saveLog({ actionCallType: "query", actionCallName: "mp_packages_last_status", actionDescription: `Consulta pacote: ${textFilter}`, actionCallDataSent: filter });

            return await list("mp_packages_last_status", filter, {}, "query")
                .then(({ data }: any) => {
                    if (!data || data?.length === 0) {
                        alert("Error");
                    }
                    setOrders(data);
                    setLoading(false);
                })
                .catch(function (error: any) {
                    console.log("Error get order...", error);
                    setLoading(false);
                });
        };
        await getItems("");
    };

    return (
        <Style.Container>
            {contextHolder}
            <Style.Style className={`w-full h-full`}>
                <div className="flex gap-2 flex-col flex-1 overflow-hidden">
                    {!showSync && (
                        <HeaderSearch placeholder="Ex: email, CPF, pacote, pedido, telefone " onChange={(text) => handleFilter(text)} loading={loading}>
                            {permissions?.integratePackage && (
                                <Button type="primary" onClick={() => setShowSync(true)}>
                                    Integrar pacotes
                                </Button>
                            )}
                        </HeaderSearch>
                    )}
                    <div className="flex border flex-1 h-full overflow-hidden">
                        {showSync ? (
                            <SyncPackage
                                onClose={(text) => {
                                    setShowSync(false);
                                    if (text) {
                                        handleFilter(text);
                                    }
                                }}
                                messageApi={messageApi}
                            />
                        ) : (
                            <>
                                <div className="border-r w-1/2 overflow-auto">
                                    {loading ? (
                                        <div className="h-full w-full flex items-center justify-center">
                                            <Loader />
                                        </div>
                                    ) : (
                                        <Table
                                            pagination={false}
                                            dataSource={orders}
                                            size="small"
                                            components={{
                                                header: {
                                                    cell: (props: any) => <th {...props}>{props.children}</th>,
                                                },
                                                body: {
                                                    row: (props: any) => (
                                                        <tr {...props} className={`${props.className} ${orderSelected?._id && props?.["data-row-key"] === orderSelected?._id ? "custom bg-blue-500 text-white" : ""}`}>
                                                            {props?.children}
                                                        </tr>
                                                    ),
                                                },
                                            }}
                                            rowKey={"_id"}
                                            columns={[
                                                {
                                                    dataIndex: "orderId",
                                                    title: "Pacote",
                                                    key: "1111",
                                                    width: 130,
                                                    render: (text, rowData) => (
                                                        <div className="hover:brightness-90 cursor-pointer" onClick={() => setOrderSelected(rowData)}>
                                                            {text}
                                                        </div>
                                                    ),
                                                },
                                                {
                                                    dataIndex: "hostname",
                                                    title: "Marca",
                                                    width: 70,
                                                    render: (brand: string | null) => <div>{brands?.find((b: any) => b?.nome_vtex === brand)?.name}</div>,
                                                },
                                                {
                                                    dataIndex: "creationDate",
                                                    title: "Data",
                                                    width: 100,
                                                    render: (date) => <div>{date ? dayjs(date).format("DD/MM/YYYY") : "-"}</div>,
                                                },
                                                {
                                                    dataIndex: "orderId",
                                                    title: "Status",
                                                    align: "center",
                                                    width: 190,
                                                    render: (__info, rowData) => <div className="capitalize">{parsePackageStatus(rowData?._last_status?.name || "-")}</div>,
                                                },
                                            ]}
                                        />
                                    )}
                                </div>
                                <div className="flex w-1/2 h-full px-3 overflow-hidden">
                                    {orderSelected?.orderId ? <Tab order={orderSelected} onGetNf={onGetNf} permissions={permissions} /> : <div className="flex items-center justify-center flex-1">Nenhum pacote selecionado</div>}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </Style.Style>
        </Style.Container>
    );
}
