import { useState } from "react";
import axios from "axios";
import Brand from "./brand";
import { show } from "../../api";
import { formatCNPJ, saveLog, toCurrency } from "../../utils";
import HeaderSearch from "../HeaderSearch";
import { Loader, Modal, Table } from "rtk-ux";
import dayjs from "dayjs";

export default function GiftCard() {
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [client, setClient] = useState<any>(null);
    const [brands, setBrands] = useState<any>(null);
    const [openAction, setOpenAction] = useState(false);
    const [infoAction, setInfoAction] = useState<any>(null);
    const [itemsGrouped, setItemsGrouped] = useState<any>([]);

    async function handleFilter(text: string) {
        setLoading(true);
        setClient(null);
        setError("");
        saveLog({ actionCallType: "api", actionCallName: "motorpromocaohomolog", actionDescription: `Consultou GiftCard: ${text}` });
        await show("mp_customers", { document: text }).then(({ data }: any) => {
            if (data) {
                setClient(data);
            } else {
                setClient({ firstname: text, lastname: "" });
            }
        });
        const configFoxton = {
            method: "get",
            maxBodyLength: Infinity,
            url: `https://api-motorpromocao.ciahering.com.br/clients/${text}/accounts/`,
            headers: {
                Authorization: `Bearer ${import.meta.env.VITE_MOTOR_API_TOKEN}`,
            },
        };
        await axios
            .request(configFoxton)
            .then((response) => {
                setBrands(response.data);
            })
            .catch((error) => {
                console.log(error);
            });
        await getBrandItems(text);
        setLoading(false);
    }

    async function getBrandItems(document: string) {
        setLoading(true);
        const config = {
            method: "get",
            maxBodyLength: Infinity,
            url: `https://api-motorpromocao.ciahering.com.br/clients/${document}/accounts/giftcards?per_page=100`,
            headers: {
                Authorization: `Bearer ${import.meta.env.VITE_MOTOR_API_TOKEN}`,
            },
        };
        return await axios
            .request(config)
            .then((response) => {
                const groupedByBrand = Object.values(
                    (response.data.data || []).reduce((acc: any, item: any) => {
                        const brandName = item?.brand_creation?.name;
                        if (!acc[brandName]) {
                            acc[brandName] = { brand: brandName, products: [] };
                        }
                        acc[brandName].products.push(item);
                        return acc;
                    }, {})
                );
                setItemsGrouped(groupedByBrand);
            })
            .catch((error) => {
                console.log(error);
            })
            .finally(() => {
                setLoading(false);
            });
    }

    async function onOpenActions(row: any) {
        if (!row?.document) return;
        try {
            const configFoxton = {
                method: "get",
                maxBodyLength: Infinity,
                url: `https://api-motorpromocao.ciahering.com.br/clients/${row.document}/accounts?user_code=${row?.user_code}&page=1&per_page=100&sort=desc&status=creation,expiration,consumption,chargeBack,update`,
                headers: {
                    Authorization: `Bearer ${import.meta.env.VITE_MOTOR_API_TOKEN}`,
                },
            };
            await axios
                .request(configFoxton)
                .then((response) => {
                    const items = (response?.data?.data || [])?.sort((a: any, b: any) => {
                        return new Date(b?.created_at).getTime() - new Date(a?.created_at).getTime();
                    });
                    const gifts = [];
                    for (const item of items) {
                        if (Array.isArray(item?.gift_card)) {
                            const valid = item?.gift_card.find((e: any) => e?.code === row?.code);
                            if (valid) {
                                gifts.push({ ...item, gift_card: valid });
                            }
                        } else if (item?.gift_card?.code) {
                            const valid = item?.gift_card?.code === row?.code;
                            if (valid) {
                                gifts.push(item);
                            }
                        }
                    }
                    setOpenAction(true);
                    setInfoAction({ data: row, gifts });
                })
                .catch((error) => {
                    console.log(error);
                });
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div className="flex flex-col gap-2 flex-1 overflow-auto" style={{ height: "calc(100vh - 100px)" }}>
            <HeaderSearch placeholder="CPF" onChange={(text) => handleFilter(text)} loading={loading} />
            <div className="flex flex-col pt-4 flex-1 h-full">
                {loading ? (
                    <div className="w-full h-full">
                        <Loader center />
                    </div>
                ) : client ? (
                    <>
                        <div className="flex ml-3 flex-col gap-1 text-sm mb-3 pl-0">
                            <div className="text-lg flex gap-2">
                                <div>Cliente:</div>
                                <div className="font-medium">
                                    {client?.firstname} {client?.lastname}
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col gap-3 mt-2">
                            {itemsGrouped
                                ?.map((group: any) => {
                                    const refId = group.products.find((e: any) => e?.gift_card_box?.refid)?.gift_card_box?.refid;
                                    return { ...group, refId };
                                })
                                .sort((a: any, b: any) => b?.refId?.localeCompare(a?.refId))
                                ?.map((group: any) => {
                                    const brand: any = brands?.amount_gift_card_box.find((e: any) => e?.gift_card_box?.refid === group?.refId);
                                    return <Brand data={{ ...brand, name: group?.brand }} key={brand?.gift_card_box?.name} items={group?.products || []} onOpenActions={onOpenActions} />;
                                })}
                        </div>
                    </>
                ) : error ? (
                    <div className="flex items-center flex-1 text-sm justify-center py-20">{error}</div>
                ) : (
                    <div className="flex items-center flex-1 text-sm justify-center py-20">Busque pelo documento</div>
                )}
            </div>
            <Modal okButtonProps={{ hidden: true }} cancelText="Fechar" width={"90%"} title={`Visualizar transações - ${infoAction?.data?.code}`} centered open={openAction} onCancel={() => setOpenAction(false)}>
                <Table
                    className="w-full mt-4"
                    columns={[
                        { title: "DATA", dataIndex: "created_at", render: (d) => dayjs(d).format("DD/MM/YYYY HH:mm:ss"), width: 180, ellipsis: true },
                        { title: "STATUS", dataIndex: "status", render: (s) => formatStatus?.[s] || s, width: 150, ellipsis: true },
                        {
                            title: "VALOR",
                            dataIndex: "status",
                            render: (status, row) => getValue(status, row),
                            width: 130,
                            ellipsis: true,
                        },
                        { title: "REDE UTILIZAÇÃO", dataIndex: "id", render: () => infoAction?.data?.brand_creation?.name || "-", width: 200, ellipsis: true },
                        { title: "CÓDIGO DE REFERÊNCIA", dataIndex: "reference_order_code", width: 200, ellipsis: true },
                        { title: "USUÁRIO", dataIndex: "id", render: () => infoAction?.data?.user_code || "-", width: 250, ellipsis: true },
                        { title: "CNPJ", dataIndex: "id", render: () => formatCNPJ(infoAction?.data?.cnpj || "-"), width: 200, ellipsis: true },
                        { title: "MOTIVO", dataIndex: "reason", width: 200, ellipsis: true },
                    ]}
                    scroll={{ x: 100 }}
                    size="small"
                    dataSource={infoAction?.gifts || []}
                />
            </Modal>
        </div>
    );
}

const getValue = (key: string, data: any) => {
    let value = 0;
    switch (key) {
        case "expiration":
            value = data?.gift_card?.value || 0;
            break;
        case "update":
            value = data?.gift_card?.value || 0;
            break;
        case "consumption":
            value = data?.gift_card?.value_used || 0;
            break;
        case "creation":
            value = data?.gift_card?.value || 0;
            break;
        case "chargeBack":
            value = data?.gift_card?.value_used || 0;
            break;
        default:
            break;
    }
    return toCurrency(value);
};

const formatStatus: any = {
    expiration: "EXPIRADO",
    consumption: "CONSUMO",
    creation: "CRIADO",
    chargeBack: "ESTORNO",
    update: "ATUALIZAÇÃO",
};
