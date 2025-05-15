import { Button, Divider, MuiIcon, Popover } from "rtk-ux";
import dayjs from "dayjs";
import { parsePackageStatus } from "../../../../../utils";
import Info from "./components/Info";
import Row from "./components/Row";
import RowItem from "./components/RowItem";
import Item from "./components/Item";
import { Image } from "antd";

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
    const nf = orderSelected?.packageAttachment?.packages?.[0]?.invoiceKey;
    console.log("🚀 ~ orderSelected?.isCompleted:", orderSelected?.isCompleted);
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
                    <RowItem field="Situação:" value={orderSelected?.isCompleted} />
                </Row>
                <Row>
                    <RowItem field="Data:" value={orderSelected?.creationDate ? dayjs(orderSelected?.creationDate).format("DD/MM/YYYY HH:mm") : "-"} />
                    <RowItem
                        field="Status:"
                        value={
                            <div className="flex items-center gap-0.5">
                                {parsePackageStatus(orderSelected?._last_status?.name)}{" "}
                                {orderSelected?.__receiver && (
                                    <Popover
                                        placement="left"
                                        content={
                                            <div>
                                                <div>
                                                    Recebido por: <strong>{orderSelected?.__receiver}</strong>
                                                </div>
                                                {orderSelected?.__receiver_name && (
                                                    <div>
                                                        Descrição: <strong>{orderSelected?.__receiver_name || "-"}</strong>
                                                    </div>
                                                )}
                                                <div className="mx-auto mt-3">
                                                    <Image.PreviewGroup>
                                                        {orderSelected?.__receiver_sign_pic && <Image height={100} width={100} className="object-cover" src={orderSelected?.__receiver_sign_pic} />}
                                                        {orderSelected?.__receiver_sign_url && <Image height={100} width={100} className="object-cover" src={orderSelected?.__receiver_sign_url} />}
                                                    </Image.PreviewGroup>
                                                </div>
                                            </div>
                                        }
                                    >
                                        <MuiIcon icon={["muil", "info"]} color="#000000" width={10} />
                                    </Popover>
                                )}
                            </div>
                        }
                    />
                </Row>
                <Row>
                    <RowItem field="Canal:" value={orderSelected?.shippingData?.logisticsInfo?.[0]?.deliveryChannel} />
                    <RowItem field="Transp:" value={orderSelected?.shippingData?.logisticsInfo?.[0]?.deliveryCompany || parsePackageStatus(orderSelected?.transportadora)} url={orderSelected?.tracking_url} />
                </Row>
                <Row>
                    <RowItem field="Valor do frete:" value={currency(orderSelected?.shippingData?.logisticsInfo?.[0]?.sellingPrice || orderSelected?.shippingData?.logisticsInfo?.[0]?.price)} />
                    <RowItem field="Origem:" value={orderSelected?.__source} />
                </Row>
                <Row>
                    <RowItem field="Rastreio:" value={orderSelected?.tracking_code} />
                </Row>
                {orderSelected?.data_entrega_prevista && (
                    <Row>
                        <RowItem field="Previsão de entrega:" value={orderSelected?.data_entrega_prevista ? dayjs(orderSelected?.data_entrega_prevista).format("DD/MM/YYYY HH:mm") : "-"} />
                        <RowItem field="Seller:" value={orderSelected?.sellers?.[0]?.name || orderSelected?.sellers?.[0]?.id} />
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
