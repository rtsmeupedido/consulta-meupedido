import { useState } from "react";
import axios from "axios";
import Brand from "./brand";
import { show } from "../../api";
import { saveLog } from "../../utils";
import HeaderSearch from "../HeaderSearch";
import { Loader } from "rtk-ux";

export default function GiftCard({ userBrands }: { userBrands: any }) {
    const [loading, setLoading] = useState(false);
    const [client, setClient] = useState<any>(null);
    const [brands, setBrands] = useState<any>(null);
    const [itemsGrouped, setItemsGrouped] = useState<any>([]);
    const [error, setError] = useState("");
    const handleFilter = async (text: string) => {
        setLoading(true);
        setClient(null);
        setError("");
        saveLog({ actionCallType: "api", actionCallName: "motorpromocaohomolog", actionDescription: `Consultou GiftCard: ${text}` });
        await show("mp_customers", { document: text }).then(({ data }: any) => {
            if (data) {
                setClient(data);
            } else {
                setError("Nenhum cliente encontrado");
                return;
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
    };
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

    return (
        <div className="flex flex-col gap-2 flex-1 overflow-auto" style={{ height: "calc(100vh - 100px)" }}>
            <HeaderSearch placeholder="CPF" onChange={(text) => handleFilter(text)} loading={loading} userBrands={userBrands} />
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
                                    return <Brand data={{ ...brand, name: group?.brand }} key={brand?.gift_card_box?.name} items={group?.products || []} />;
                                })}
                        </div>
                    </>
                ) : error ? (
                    <div className="flex items-center flex-1 text-sm justify-center py-20">{error}</div>
                ) : (
                    <div className="flex items-center flex-1 text-sm justify-center py-20">Busque pelo documento</div>
                )}
            </div>
        </div>
    );
}
