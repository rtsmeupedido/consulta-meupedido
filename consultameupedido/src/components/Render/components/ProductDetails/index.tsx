/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useRef, useState } from "react";
import * as Style from "./styles";
import { Table, Divider, Loader } from "rtk-ux";
import { execFunc } from "../../api";
import HeaderSearch from "../HeaderSearch";
import { saveLog } from "../../utils";
export default function ProductDetails({ userBrands }: any) {
    const div_ref = useRef<any>(null);
    const [loading, setLoading] = useState(false);
    const [errorMsg, seterrorMsg] = useState("Nenhum produto selecionado");
    const [product, setProduct] = useState<any>(null);
    const [productInfo, setProductInfo] = useState<any>({ info: null, price: null, color: null });
    const [stocks, setStocks] = useState<any>([]);
    const [signal, setSignal] = useState<any>(null);

    const handleFilter = async (text: string) => {
        const controller = new AbortController();
        setSignal(controller);
        seterrorMsg("Nenhum produto selecionado.");
        setLoading(true);
        const filter = { text, userBrands };
        await saveLog({ actionCallType: "function", actionCallName: "conexao_sql_bdviews_zd", actionDescription: `Consulta produto pela referência: ${text}`, actionCallDataSent: filter });

        await execFunc("conexao_sql_bdviews_zd", filter, controller.signal)
            .then(({ data }) => {
                if (!data?.info?.package?.[0]) {
                    seterrorMsg("Nenhum produto encontrado.");
                } else {
                    setProductInfo({
                        info: data?.info?.package?.[0],
                        price: data?.info?.price?.[0],
                        color: data?.info?.color?.[0],
                    });
                    setProduct(data?.productsSize[0] || null);
                    setStocks(data?.stock || []);
                }
                setLoading(false);
            })
            .catch(() => {
                setLoading(false);
            });
    };

    const columnsSizes = product
        ? Object.entries(product)
              .filter(([string, value]) => {
                  return string.includes("TAMANHO_") && typeof value === "string" && value?.trim();
              })
              .map(([name, value]) => ({ name, size: value }))
        : [];
    const scrollX = (div_ref?.current?.clientHeight || 600) - 240;
    return (
        <Style.Container>
            <Style.Style className={`w-full h-full overflow-auto`} ref={div_ref}>
                <div className="flex gap-2 flex-col flex-1">
                    <HeaderSearch
                        userBrands={userBrands}
                        placeholder="Referência"
                        onChange={(text) => handleFilter(text)}
                        loading={loading}
                        onCancel={() => {
                            signal.abort();
                            setSignal(null);
                        }}
                    />
                    <div className="flex flex-col border flex-1 h-full overflow-hidden p-3">
                        {loading ? (
                            <div className="flex flex-1 items-center justify-center py-12">
                                <Loader />
                            </div>
                        ) : (
                            <>
                                {productInfo?.info && (
                                    <div className="pl-2 flex flex-col gap-2 mb-2">
                                        <Divider className="my-1" />
                                        <div className="text-lg -mb-2">{productInfo?.info?.DESC_PRODUTO?.trim() || "-"}</div>
                                        <div className="text-sm flex items-center gap-1">
                                            {productInfo?.price?.PRECO_VENDA_ORIGINAL ? (
                                                <div className="text-gray-500 line-through">
                                                    {new Intl.NumberFormat("pt-BR", {
                                                        style: "currency",
                                                        currency: "BRL",
                                                        minimumFractionDigits: 2,
                                                        maximumFractionDigits: 2,
                                                    }).format(productInfo?.price?.PRECO_VENDA_ORIGINAL)}
                                                </div>
                                            ) : (
                                                <></>
                                            )}
                                            <div className="text-orange-600">
                                                {new Intl.NumberFormat("pt-BR", {
                                                    style: "currency",
                                                    currency: "BRL",
                                                    minimumFractionDigits: 2,
                                                    maximumFractionDigits: 2,
                                                }).format(productInfo?.price?.PRECO_VENDA_CORRENTE)}
                                            </div>
                                        </div>
                                        <div className="text-xs flex items-center gap-1">
                                            <div className="text-gray-500">Ref:</div> {productInfo?.info?.PRODUTO?.trim() || "-"}
                                            <div className="ML-4 text-gray-500">Marca:</div> {productInfo?.info?.ANM_MARCA?.trim() || "-"}
                                        </div>

                                        <div className="text-xs flex items-center gap-1">
                                            <div className="text-gray-500">Cor:</div> {(productInfo?.color?.DESC_COR_PRODUTO || "-")?.trim()}
                                        </div>
                                    </div>
                                )}
                                {productInfo?.info && stocks.length > 0 ? (
                                    <Table
                                        loading={loading}
                                        size="small"
                                        dataSource={stocks}
                                        columns={[
                                            { dataIndex: "FILIAL", title: "Local", fixed: "left", width: 400, ellipsis: true },
                                            // @ts-ignore
                                            ...columnsSizes.map((colSize) => ({
                                                dataIndex: colSize?.name,
                                                width: 80,
                                                ellipsis: true,
                                                align: "center",
                                                title: colSize?.size?.toString(),
                                                render: (_vl: any, rowData: any) => <div>{rowData?.[colSize?.name?.replace("TAMANHO_", "ES")] || "-"}</div>,
                                            })),
                                        ]}
                                        scroll={{
                                            x: "max-content",
                                            y: scrollX,
                                        }}
                                        pagination={false}
                                    />
                                ) : (
                                    <div className="flex items-center flex-1 justify-center py-20">{errorMsg}</div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </Style.Style>
        </Style.Container>
    );
}
