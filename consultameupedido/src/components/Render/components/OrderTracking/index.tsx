/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useEffect, useState } from "react";
import * as Style from "./styles";
import { list } from "../../api";
import { Button, MuiIcon, Input, Loader, Table } from "rtk-ux";
import dayjs from "dayjs";
import Tab from "./tabs";
import { parseFilter, parsePackageStatus } from "../../utils";

export default function OrderTracking({ onGetNf }: { onGetNf: (str: string) => void }) {
    const [text, setText] = useState("");
    const [orders, setOrders] = useState([]);
    const [brands, setBrands] = useState<any>([]);
    const [loading, setLoading] = useState(false);
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
            return await list(
                "mp_packages_last_status",
                {
                    before_filter: parseFilter(textFilter),
                },
                {},
                "query"
            )
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

    const getBrands = async () => {
        return await list("mp_brands")
            .then(({ data, success }: { data: any; success: boolean }) => {
                if (!success) return;
                setBrands(data);
            })
            .catch(function (error: any) {
                console.log(error);
            });
    };

    useEffect(() => {
        getBrands();
    }, []);

    return (
        <Style.Container>
            <Style.Style className={`w-full h-full`}>
                <div className="flex gap-2 flex-col flex-1 overflow-hidden">
                    <div className="flex items-center gap-1">
                        <Input className="w-72 h-8" placeholder="Ex: email, CPF, pacote, pedido, telefone" value={text} onChange={(e: any) => setText(e.target.value)} />
                        <Button onClick={() => handleFilter(text)} disabled={!text?.length}>
                            <MuiIcon icon={["mui", "search"]} color="black" />
                        </Button>
                    </div>
                    <div className="flex border flex-1 h-full overflow-hidden">
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
                                            render: (info, rowData) => (
                                                <div onClick={() => console.log(info)} className="capitalize">
                                                    {parsePackageStatus(rowData?._last_status?.name || "-")}
                                                </div>
                                            ),
                                        },
                                    ]}
                                />
                            )}
                        </div>
                        <div className="flex w-1/2 h-full px-3 overflow-hidden">
                            {orderSelected?.orderId ? <Tab order={orderSelected} onGetNf={onGetNf} /> : <div className="flex items-center justify-center flex-1">Nenhum pacote selecionado</div>}
                        </div>
                    </div>
                </div>
            </Style.Style>
        </Style.Container>
    );
}
