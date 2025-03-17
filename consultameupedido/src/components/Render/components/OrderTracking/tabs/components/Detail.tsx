<<<<<<< HEAD
import { Button, Divider, MuiIcon, Tag, Tooltip } from "rtk-ux";
=======
import { Divider, MuiIcon, Tag, Tooltip } from "rtk-ux";
>>>>>>> 3e1534e557dac41e38eda1e46a9e6361e9728ef1
import dayjs from "dayjs";
import { parsePackageStatus } from "../../../../utils";

export default function PackageDetail({ orderSelected, onGetNf }: { orderSelected: any; onGetNf: (str: string) => void }) {
    const currency = (value: number) => {
        try {
            return new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            }).format((value || 0) / 100);
        } catch (error) {
            return new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            }).format(0);
        }
    };
    const payments = orderSelected?.paymentData?.transactions?.[0]?.payments || [];
    const giftCards = (orderSelected?.paymentData?.giftCards || [])?.filter((g: any) => g?.inUse);
<<<<<<< HEAD
    const nf = orderSelected?.packageAttachment?.packages?.[0]?.invoiceKey;
=======
>>>>>>> 3e1534e557dac41e38eda1e46a9e6361e9728ef1
    return (
        <div className="flex flex-col pb-3 text-xs">
            <Info title="Cliente">
                <Row>
                    <RowItem field="Nome:" value={orderSelected?.clientProfileData?.firstName} />
                    <RowItem field="Email:" value={orderSelected?.clientProfileData?.email} />
                </Row>
                <Row>
                    <RowItem field="CPF:" value={orderSelected?.clientProfileData?.document} />
                    <RowItem field="Tel:" value={orderSelected?.clientProfileData?.phone} />
                </Row>
            </Info>
            <Divider className="my-6" />
            <Info title="Pedido">
                <Row>
                    <RowItem field="Id:" value={orderSelected?.orderId} copy />
                    <RowItem field="Status:" value={parsePackageStatus(orderSelected?._last_status?.name)} />
                </Row>
                <Row>
                    <RowItem field="Data:" value={orderSelected?.creationDate ? dayjs(orderSelected?.creationDate).format("DD/MM/YYYY HH:mm") : "-"} />
                    <RowItem field="Seller:" value={orderSelected?.sellers?.[0]?.name || orderSelected?.sellers?.[0]?.id} />
                </Row>
                <Row>
                    <RowItem field="Canal:" value={orderSelected?.shippingData?.logisticsInfo?.[0]?.deliveryChannel} />
                    <RowItem field="Transp:" value={orderSelected?.shippingData?.logisticsInfo?.[0]?.deliveryCompany || parsePackageStatus(orderSelected?.transportadora)} url={orderSelected?.tracking_url} />
                </Row>
                <Row>
                    <RowItem field="Origem:" value={orderSelected?.__source} />
                    <RowItem field="Rastreio:" value={orderSelected?.tracking_code} />
                </Row>
                {orderSelected?.data_entrega_prevista && (
                    <Row>
                        <RowItem field="Previsão de entrega:" value={orderSelected?.data_entrega_prevista ? dayjs(orderSelected?.data_entrega_prevista).format("DD/MM/YYYY HH:mm") : "-"} />
                    </Row>
                )}
            </Info>
            <Divider className="my-6" />
            <Info title="Itens">
                {orderSelected?.items?.map((i: any, idx: number) => {
                    const listChangedItems = orderSelected?.changesAttachment?.changesData?.[0]?.itemsRemoved;
                    const isRemoved = listChangedItems?.find((p: any) => p?.id === i?.id) || false;
                    return <Item idx={idx} data={i} key={i?.uniqueId} isRemoved={isRemoved} />;
                })}
            </Info>
            <Divider className="my-6" />
            <Info title="Pagamento" actions={nf ? <Button onClick={() => onGetNf(nf)}>Download NF</Button> : null}>
                <Row>
                    <RowItem field="NF:" value={orderSelected?.packageAttachment?.packages?.[0]?.invoiceNumber} copy />
                    <RowItem field="Data:" value={dayjs(orderSelected?.creationDate).format("DD/MM/YYYY")} />
                </Row>
                <Row>
                    <RowItem field="Chave:" value={nf} copy nf onNf={() => onGetNf(nf)} />
                    <RowItem field="Total:" value={currency(orderSelected?.value)} />
                </Row>
                {payments?.length > 0 && (
                    <>
                        <div className="my-1" />
                        <Info title="Métodos de pagamento utilizados">
                            {payments.map((pay: any) => (
                                <div className="flex flex-col gap-1 border-b py-1 border-b-slate-100">
                                    <Row>
                                        <RowItem field="Método:" value={pay?.paymentSystemName} />
                                        {/* <RowItem field="TID:" value={pay?.connectorResponses?.Tid} /> */}
                                        <RowItem field="Valor:" value={currency(pay?.value)} />
                                    </Row>
                                    {pay?.connectorResponses?.acquirer && (
                                        <>
                                            <Row>
                                                <RowItem field="Adquirente:" value={pay?.connectorResponses?.acquirer} />
                                                {/* <RowItem field="TID:" value={pay?.connectorResponses?.Tid} /> */}
                                                <RowItem field="NSU:" value={pay?.connectorResponses?.nsu} copy />
                                            </Row>
                                        </>
                                    )}
                                    {pay?.group === "creditCard" && (
                                        <Row>
                                            <RowItem field="Parcelas:" value={`${pay?.installments || 1}x ${currency(orderSelected?.value / (pay?.installments || 1))}`} />
                                        </Row>
                                    )}
                                </div>
                            ))}
                        </Info>
                    </>
                )}
                <div className="my-1" />
                {giftCards?.length > 0 && (
                    <Info title="Gift cards">
                        {giftCards?.map((gift: any) => (
                            <Row key={gift?.id}>
                                <RowItem field="Descrição:" value={gift?.caption} />
                                <RowItem field="Valor:" value={currency(gift?.value)} />
                            </Row>
                        ))}
                    </Info>
                )}
            </Info>
            <Divider className="my-6" />
            <Info title="Entrega">
                <Row>
                    <RowItem field="Dest:" value={orderSelected?.shippingData?.address?.receiverName} />
                </Row>
                <Row>
                    <RowItem field="End:" value={orderSelected ? `${orderSelected?.shippingData?.address?.street}, ${orderSelected?.shippingData?.address?.number}` : "-"} />
                    <RowItem field="CEP:" value={orderSelected?.shippingData?.address?.postalCode} />
                </Row>
                <Row>
                    <RowItem field="Compl:" value={orderSelected?.shippingData?.address?.complement} />
                    <RowItem field="Cidade:" value={orderSelected ? `${orderSelected?.shippingData?.address?.city} - ${orderSelected?.shippingData?.address?.state}` : "-"} />
                </Row>
            </Info>
        </div>
    );
}

const Info = ({ title = "", children, actions }: any) => {
    return (
        <>
            <div className="flex items-center justify-between font-bold mb-2">
                {title}
                {actions}
            </div>
            <div className="flex px-1 flex-col gap-1">{children}</div>
        </>
    );
};
const Row = ({ children }: any) => {
    return <div className="flex items-center mb-1">{children}</div>;
};
const RowItem = ({ field = "", value = "", copy = false, url = null, nf = false, onNf = () => {} }) => {
    return (
        <div className="flex items-center w-1/2">
            <div className="min-w-14 text-gray-400">{field}</div>
            <div className="font-semibold overflow-hidden overflow-ellipsis ml-1">{value || "-"}</div>
            {value && url && (
                <MuiIcon
                    icon={["mui", "link"]}
                    className="cursor-pointer mr-1 text-blue-600"
                    onClick={() => {
                        window.open(value, "__blank");
                    }}
                />
            )}
            {value && copy && (
                <Tooltip title="Copiar">
                    <MuiIcon
                        icon={["mui", "copy_all"]}
                        width={10}
                        className="text-gray-500 hover:text-orange-500 cursor-pointer mr-1"
                        onClick={() => {
                            navigator.clipboard.writeText(value);
                        }}
                    />
                </Tooltip>
            )}
            {value && nf && (
                <Tooltip title="Baixar nota fiscal">
                    <MuiIcon
                        icon={["mui", "remove_red_eye"]}
                        width={10}
                        className="text-gray-500 hover:text-orange-500 cursor-pointer mr-1"
                        onClick={() => {
                            onNf();
                        }}
                    />
                </Tooltip>
            )}
        </div>
    );
};
const Item = ({ data, isRemoved }: any) => {
    return (
        <div className={"flex item-center group/item relative"}>
            <img style={{ height: 45, width: 30 }} className="object-contain rounded-sm" src={data?.imageUrl} />
            <div className={`flex justify-center flex-col flex-1 px-2 relative ${isRemoved ? "opacity-40" : ""}`}>
                <span className="text-black font-semibold line-clamp-1">{data?.name}</span>
                <div className="flex items-center justify-between mt-1">
                    <div className="flex items-center gap-0.5">
                        <span>SKU:</span>
                        <div className="text-blue-950 font-semibold">{data?.sellerSku}</div>
                    </div>
                    <div className="flex items-center gap-0.5">
                        <span>Ref:</span>
                        <div className="text-blue-950 font-semibold flex items-center gap-1">
                            {data?.refId}
                            <Tooltip title="Copiar">
                                <MuiIcon fontSize="small" click onClick={() => navigator.clipboard.writeText(data?.refId)} icon={["mui", "copy_all"]} className="text-gray-500 hover:text-blue-600" />
                            </Tooltip>
                        </div>
                    </div>
                    <div className={`flex items-center gap-0.5 ${isRemoved ? "opacity-0" : ""}`}>
                        <span>Tam:</span>
                        <div className="text-blue-950 font-semibold">-</div>
                    </div>
                    <div className={`flex items-center gap-0.5 ${isRemoved ? "opacity-0" : ""}`}>
                        <span>Qtd:</span>
                        <div className="text-blue-950 font-semibold">{data?.quantity || 0}</div>
                    </div>
                </div>
            </div>
            {isRemoved && (
                <div className="absolute right-0 top-2">
                    <Tag color="red">Removido</Tag>
                </div>
            )}
        </div>
    );
};
