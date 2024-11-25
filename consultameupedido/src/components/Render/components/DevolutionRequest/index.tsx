/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useRef, useState } from "react";
import * as Style from "./styles";
import { Col, Image, Loader, Row } from "rtk-ux";
import { execFunc } from "../../api";
import HeaderSearch from "../HeaderSearch";
import dayjs from "dayjs";
import { parseFilter } from "../../utils";
import DevolutionTable from "../DevolutionTable";

export default function DevolutionRequest({ brands }: { brands: any }) {
    const div_ref = useRef<any>(null);
    const [loading, setLoading] = useState(false);
    const [loadingPck, setLoadingPck] = useState(false);
    const [code, setCode] = useState("");
    const [error, setError] = useState("");
    const [info, setInfo] = useState<any>(null);
    const [orderSelected, setOrderSelected] = useState<any>(null);
    const [list, setList] = useState<any>([]);
    const [signal, setSignal] = useState<any>(null);
    const handleFilter = async (text: string, loadPackage: boolean = false) => {
        const controller = new AbortController();
        setSignal(controller);
        if (loadPackage) {
            setLoadingPck(true);
        } else {
            setOrderSelected(null);
            setLoading(true);
            setList([]);
        }
        setCode("");
        setInfo(null);
        setError("");
        const filter = parseFilter(text, true);
        await execFunc("zd_consulta_troquecommerce", { filter: filter?.filter, type: filter?.type }, controller.signal)
            .then(({ data }) => {
                setCode(text);
                if (data.returnValues) {
                    switch (data?.returnValues?.type) {
                        case "document":
                            setList(data.returnValues.data);
                            break;
                        default:
                            setInfo(data.returnValues.data);
                            break;
                    }
                }
            })
            .catch(() => {
                setError("Nenhuma devolução foi encontrada para este pedido.");
            })
            .finally(() => {
                setLoadingPck(false);
                setLoading(false);
            });
    };

    return (
        <Style.Container>
            <Style.Style className={`w-full h-full`} ref={div_ref}>
                <div className="flex gap-2 flex-col flex-1 overflow-hidden">
                    <HeaderSearch
                        placeholder="Pacote ou CPF"
                        onChange={(text) => handleFilter(text)}
                        loading={loading}
                        onCancel={() => {
                            signal.abort();
                            setSignal(null);
                        }}
                    />
                    <div className="flex border flex-1 h-full overflow-hidden">
                        {loading ? (
                            <div className="flex flex-1 items-center justify-center py-12">
                                <Loader />
                            </div>
                        ) : (
                            <>
                                {list?.length > 0 && (
                                    <DevolutionTable
                                        brands={brands}
                                        data={list}
                                        selectedRow={orderSelected}
                                        onRowClick={(rowData, text) => {
                                            setOrderSelected(rowData);
                                            handleFilter(text, true);
                                        }}
                                    />
                                )}
                                {loadingPck ? (
                                    <div className="flex items-center flex-1 justify-center py-12">
                                        <Loader />
                                    </div>
                                ) : info ? (
                                    <div className={`flex flex-col gap-4 p-4 overflow-auto ${list.length > 0 ? "w-2/3" : ""}`}>
                                        <Row gutter={[0, 8]}>
                                            <Col span={24}>
                                                <div className="text-black text-sm font-semibold">Informações do pacote:</div>
                                            </Col>
                                            <Col span={24}>
                                                <Row gutter={[0, 4]}>
                                                    <Col span={4} className="text-gray-400">
                                                        Pedido:
                                                    </Col>
                                                    <Col span={8} className="text-black font-semibold">
                                                        {code}
                                                    </Col>
                                                    <Col span={5} className="text-gray-400">
                                                        Status:
                                                    </Col>
                                                    <Col span={7} className="text-black font-semibold">
                                                        {info?.status || "-"}
                                                    </Col>
                                                    <Col span={4} className="text-gray-400">
                                                        Valor:
                                                    </Col>
                                                    <Col span={8} className="text-black font-semibold">
                                                        {info?.price
                                                            ? new Intl.NumberFormat("pt-BR", {
                                                                  style: "currency",
                                                                  currency: "BRL",
                                                                  minimumFractionDigits: 2,
                                                                  maximumFractionDigits: 2,
                                                              }).format(info?.price)
                                                            : "-"}
                                                    </Col>
                                                    <Col span={5} className="text-gray-400">
                                                        Data da solicitação:
                                                    </Col>
                                                    <Col span={7} className="text-black font-semibold">
                                                        {info?.created_at ? dayjs(info?.created_at).format("DD/MM/YYYY") : "-"}
                                                    </Col>
                                                    <Col span={4} className="text-gray-400">
                                                        Autorização de postagem:
                                                    </Col>
                                                    <Col span={8} className="text-black font-semibold">
                                                        {info?.tracking?.courier_collect_number}
                                                    </Col>
                                                    {/* <Col span={5} className="text-gray-400">
                                                        Prazo para postagem:
                                                    </Col>
                                                    <Col span={7} className="text-black font-semibold">
                                                        {"-"}
                                                    </Col> */}
                                                    <Col span={12} />
                                                    <Col span={4} className="text-gray-400">
                                                        Rastreio:
                                                    </Col>
                                                    <Col span={8} className="text-black font-semibold flex items-center gap-1">
                                                        {info?.tracking?.status}
                                                    </Col>
                                                    <Col span={5} className="text-gray-400">
                                                        Código de rastreio:
                                                    </Col>
                                                    <Col span={7} className="text-black font-semibold flex items-center gap-1">
                                                        {info?.tracking?.courier_tracking_code}
                                                    </Col>
                                                    <Col span={4} className="text-gray-400">
                                                        Postagem:
                                                    </Col>
                                                    <Col span={8} className="text-black font-semibold flex items-center gap-1">
                                                        {info?.tracking?.posted_date ? dayjs(info?.tracking?.posted_date).format("DD/MM/YYYY") : "-"}
                                                    </Col>
                                                    <Col span={5} className="text-gray-400">
                                                        Recebimento:
                                                    </Col>
                                                    <Col span={7} className="text-black font-semibold flex items-center gap-1">
                                                        {info?.tracking?.delivery_date ? dayjs(info?.tracking?.delivery_date).format("DD/MM/YYYY") : "-"}
                                                    </Col>
                                                </Row>
                                            </Col>
                                        </Row>
                                        <div>
                                            <div className="text-black text-sm font-semibold">Items:</div>
                                            <div className="flex flex-col gap-2 mt-2">
                                                {info?.items?.length > 0 ? (
                                                    info?.items?.map((pck: any, i: number) => (
                                                        <div className="border p-3 rounded bg-[#f7f7f7]" key={i}>
                                                            <Row>
                                                                <Col span={24}>
                                                                    <div className="flex gap-2 items-center">
                                                                        <Image src={pck?.image_url} className="h-16 rounded" />
                                                                        <div className="flex flex-col gap-1">
                                                                            <div className="font-semibold">{pck?.description || "-"}</div>
                                                                            <div className="flex gap-1">
                                                                                Quantidade: <div className="font-semibold">{pck?.quantity || "-"}</div>
                                                                            </div>
                                                                            <div className="flex gap-1">
                                                                                Motivo:
                                                                                <div className="font-semibold">{pck?.reason?.description || "-"}</div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </Col>
                                                            </Row>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <div className="text-center bg-slate-50 p-4 rounded">Nenhum item encontrado</div>
                                                )}
                                            </div>
                                        </div>
                                        <Row gutter={[0, 8]}>
                                            <Col span={24}>
                                                <div className="text-black text-sm font-semibold">Tipo: {info?.reverse_type || "-"}</div>
                                            </Col>
                                            <Col span={24}>
                                                <Row gutter={[0, 4]}>
                                                    <Col span={4} className="text-gray-400">
                                                        Adquirente:
                                                    </Col>
                                                    <Col span={8} className="text-black font-semibold">
                                                        {info?.gateway_name || "-"}
                                                    </Col>
                                                    <Col span={2} className="text-gray-400">
                                                        NSU:
                                                    </Col>
                                                    <Col span={10} className="text-black font-semibold">
                                                        {info?.gateway_transaction_id || "-"}
                                                    </Col>
                                                </Row>
                                            </Col>
                                        </Row>
                                        {(info?.reverse_type === "Troca" || info?.reverse_type === "Troca e devolução") && (
                                            <Row gutter={[0, 8]}>
                                                <Col span={24}>
                                                    <div className="text-black text-sm font-semibold">Vale:</div>
                                                </Col>
                                                <Col span={24}>
                                                    <Row gutter={[0, 4]}>
                                                        <Col span={4} className="text-gray-400">
                                                            Código:
                                                        </Col>
                                                        <Col span={8} className="text-black font-semibold">
                                                            {info?.reverse_coupon?.code || "-"}
                                                        </Col>
                                                        <Col span={2} className="text-gray-400">
                                                            Validade:
                                                        </Col>
                                                        <Col span={10} className="text-black font-semibold">
                                                            {info?.reverse_coupon.validity ? dayjs(info?.reverse_coupon.validity).format("DD/MM/YYYY") : "-"}
                                                        </Col>
                                                        <Col span={4} className="text-gray-400">
                                                            Valor:
                                                        </Col>
                                                        <Col span={8} className="text-black font-semibold">
                                                            {info?.reverse_coupon?.value
                                                                ? new Intl.NumberFormat("pt-BR", {
                                                                      style: "currency",
                                                                      currency: "BRL",
                                                                      minimumFractionDigits: 2,
                                                                      maximumFractionDigits: 2,
                                                                  }).format(info?.reverse_coupon?.value)
                                                                : "-"}
                                                        </Col>
                                                    </Row>
                                                </Col>
                                            </Row>
                                        )}
                                        {(info?.reverse_type === "Devolução" || info?.reverse_type === "Troca e devolução") && (
                                            <Row gutter={[0, 8]}>
                                                <Col span={24}>
                                                    <div className="text-black text-sm font-semibold">Reembolso:</div>
                                                </Col>
                                                <Col span={24}>
                                                    <Row gutter={[0, 4]}>
                                                        <Col span={4} className="text-gray-400">
                                                            Valor:
                                                        </Col>
                                                        <Col span={8} className="text-black font-semibold">
                                                            {info?.reverse_payment?.value
                                                                ? new Intl.NumberFormat("pt-BR", {
                                                                      style: "currency",
                                                                      currency: "BRL",
                                                                      minimumFractionDigits: 2,
                                                                      maximumFractionDigits: 2,
                                                                  }).format(info?.reverse_payment?.value)
                                                                : "-"}
                                                        </Col>
                                                        <Col span={2} className="text-gray-400">
                                                            Tipo:
                                                        </Col>
                                                        <Col span={10} className="text-black font-semibold">
                                                            {info?.reverse_payment?.action}
                                                        </Col>
                                                        <Col span={4} className="text-gray-400">
                                                            Data:
                                                        </Col>
                                                        <Col span={8} className="text-black font-semibold">
                                                            {info?.reverse_payment?.created_at ? dayjs(info.reverse_payment.created_at).format("DD/MM/YYYY") : "-"}
                                                        </Col>
                                                    </Row>
                                                </Col>
                                            </Row>
                                        )}
                                    </div>
                                ) : error ? (
                                    <div className="flex items-center flex-1 justify-center py-20">{error}</div>
                                ) : (
                                    <div className="flex items-center flex-1 justify-center py-20">Nenhum pacote selecionado</div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </Style.Style>
        </Style.Container>
    );
}
