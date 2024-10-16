import { Button, Divider } from "rtk-ux";
import dayjs from "dayjs";

export default function PackageDetail({ orderSelected }: any) {
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
                    <RowItem field="Id:" value={orderSelected?.orderId} />
                    <RowItem field="Status:" value={orderSelected?.statusDescription} />
                </Row>
                <Row>
                    <RowItem field="Seq:" value={orderSelected?.sequence} />
                    <RowItem field="Transp:" value={orderSelected?.shippingData?.logisticsInfo?.[0]?.deliveryCompany} />
                </Row>
                <Row>
                    <RowItem field="Data:" value="08/02/2022 10:35" />
                    <RowItem field="Canal:" value={orderSelected?.shippingData?.logisticsInfo?.[0]?.deliveryChannel} />
                </Row>
            </Info>
            <Divider className="my-6" />
            <Info title="Itens">
                {orderSelected?.items?.map((i: any, idx: number) => (
                    <Item idx={idx} data={i} key={i?.uniqueId} />
                ))}
            </Info>
            <Divider className="my-6" />
            <Info title="Pagamento">
                <Row>
                    <RowItem field="NF:" value={orderSelected?.packageAttachment?.packages?.[0]?.invoiceNumber} />
                    <RowItem field="Data:" value={dayjs(orderSelected?.creationDate).format("DD/MM/YYYY")} />
                </Row>
                <Row>
                    <RowItem field="Chave:" value={orderSelected?.packageAttachment?.packages?.[0]?.invoiceKey} />
                    <RowItem field="Total:" value={currency(orderSelected?.value)} />
                </Row>
                {payments?.length > 0 && (
                    <>
                        <div className="my-1" />
                        <Info title="Métodos de pagamento utilizados">
                            {payments.map((pay: any) => (
                                <div className="border-b py-1 border-b-slate-100">
                                    <Row>
                                        <RowItem field="Método:" value={pay?.paymentSystemName} />
                                        {/* <RowItem field="TID:" value={pay?.connectorResponses?.Tid} /> */}
                                        <RowItem field="Valor:" value={currency(pay?.value)} />
                                    </Row>
                                    {pay?.group === "creditCard" && (
                                        <Row>
                                            <RowItem field="Parcelas:" value={`${pay?.installments || 1}x ${currency(orderSelected?.value / (pay?.installments || 1))}`} />
                                            {/* <RowItem field="NSU:" value={pay?.connectorResponses?.nsu} /> */}
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
                </Row>
                <Row>
                    <RowItem field="Compl:" value={orderSelected?.shippingData?.address?.complement} />
                </Row>
                <Row>
                    <RowItem field="Cidade:" value={orderSelected ? `${orderSelected?.shippingData?.address?.city} - ${orderSelected?.shippingData?.address?.state}` : "-"} />
                </Row>
                <Row>
                    <RowItem field="Transp:" value={orderSelected?.shippingData?.logisticsInfo?.[0]?.deliveryCompany} />
                    <RowItem field="Status transp:" value={orderSelected?.status_keyname} />
                </Row>
            </Info>
        </div>
    );
}

const Info = ({ title = "", children }: any) => {
    return (
        <>
            <div className="font-bold mb-2">{title}</div>
            <div className="flex px-1 flex-col gap-1">{children}</div>
        </>
    );
};
const Row = ({ children }: any) => {
    return <div className="flex items-center mb-1">{children}</div>;
};
const RowItem = ({ field = "", value = "" }) => {
    return (
        <div className="flex items-center w-1/2 gap-1">
            <div className="min-w-14 text-gray-400">{field}</div>
            <div className="font-semibold overflow-hidden overflow-ellipsis">{value || "-"}</div>
        </div>
    );
};
const Item = ({ data, idx }: any) => {
    return (
        <div className="flex item-center group/item relative">
            <img style={{ height: 45, width: 30 }} className="object-contain rounded-sm" src={data?.imageUrl} />
            <div className="flex justify-center flex-col flex-1 px-2">
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
                            {/* <Icon click onClick={() => navigator.clipboard.writeText(data?.refId)} icon={["far", "clipboard"]} className="text-gray-500 hover:text-blue-600" /> */}
                        </div>
                    </div>
                    <div className="flex items-center gap-0.5">
                        <span>Tam:</span>
                        <div className="text-blue-950 font-semibold">-</div>
                    </div>
                    <div className="flex items-center gap-0.5">
                        <span>Qtd:</span>
                        <div className="text-blue-950 font-semibold">{data?.quantity || 0}</div>
                    </div>
                </div>
            </div>
            {idx > 0 && (
                <div className="bg-black/10 hidden items-center gap-3 rounded-lg justify-center absolute w-full h-full group-hover/item:flex">
                    <Button size="small" type="primary">
                        Trocar
                    </Button>
                    <Button size="small" type="primary">
                        Devolver
                    </Button>
                </div>
            )}
        </div>
    );
};
