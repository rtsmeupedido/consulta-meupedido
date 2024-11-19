/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useRef, useState } from "react";
import * as Style from "./styles";
import { Button, MuiIcon, Input, Row, Col, Loader } from "rtk-ux";
import { execFunc } from "../../api";
import dayjs from "dayjs";

export default function Devolution({ onGetNf }: { onGetNf: (str: string) => void }) {
    const div_ref = useRef<any>(null);
    const [loading, setLoading] = useState(false);
    const [code, setCode] = useState("");
    const [error, setError] = useState("");
    const [info, setInfo] = useState<any>(null);
    const [packages, setPackages] = useState([]);
    const [text, setText] = useState("");

    const handleFilter = async (text: string) => {
        setLoading(true);
        setCode("");
        setInfo(null);
        setPackages([]);
        setError("");
        await execFunc("consulta_devolucao_wms_zd", { text })
            .then(({ data }) => {
                if (data?.info) {
                    setInfo({ ...data?.info, NF_CHAVE: data?.nfe });
                    setPackages(data?.packages || []);
                    setCode(text);
                } else {
                    setError("Nenhuma devolução foi encontrada para este pedido.");
                    setLoading(false);
                }
            })
            .catch(() => {
                setLoading(false);
            });
        setLoading(false);
    };

    return (
        <Style.Container>
            <Style.Style className={`w-full h-full overflow-auto`} ref={div_ref}>
                <div className="flex gap-2 flex-col flex-1">
                    <div className="flex items-center gap-1">
                        <Input className="w-72 h-8" placeholder="Pacote" value={text} onChange={(e: any) => setText(e.target.value)} />
                        <Button onClick={() => handleFilter(text)} loading={loading} disabled={!text.length}>
                            <MuiIcon icon={["mui", "search"]} color="black" />
                        </Button>
                    </div>
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <Loader />
                        </div>
                    ) : info ? (
                        <div className="flex flex-col gap-3 mt-3">
                            <Row gutter={[0, 8]}>
                                <Col span={24}>
                                    <div className="text-black text-sm font-semibold">Informações do pacote:</div>
                                </Col>
                                <Col span={12}>
                                    <Row gutter={[0, 4]}>
                                        <Col span={4} className="text-gray-400">
                                            Código pacote:
                                        </Col>
                                        <Col span={18} className="text-black font-semibold">
                                            {code}
                                        </Col>
                                        <Col span={4} className="text-gray-400">
                                            Filial:
                                        </Col>
                                        <Col span={18} className="text-black font-semibold">
                                            {info.FILIAL}
                                        </Col>
                                    </Row>
                                </Col>
                                <Col span={12}>
                                    <Row gutter={[0, 4]}>
                                        <Col span={4} className="text-gray-400">
                                            Série NF:
                                        </Col>
                                        <Col span={18} className="text-black font-semibold">
                                            {info?.SERIE_NF || "-"}
                                        </Col>
                                        <Col span={4} className="text-gray-400">
                                            Chave NF:
                                        </Col>
                                        <Col span={18} className="text-black font-semibold flex items-center gap-1">
                                            {info?.NF_CHAVE || "-"} <MuiIcon icon={["mui", "remove_red_eye"]} className="text-gray-500 hover:text-orange-500 cursor-pointer" onClick={() => onGetNf(info?.NF_CHAVE)} />
                                        </Col>
                                        <Col span={4} className="text-gray-400">
                                            NF:
                                        </Col>
                                        <Col span={18} className="text-black font-semibold">
                                            {info?.NF_NUMERO || "-"}
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                            <div>
                                <div className="text-black text-sm font-semibold">Items:</div>
                                <div className="flex flex-col gap-2 mt-2">
                                    {packages?.length > 0 ? (
                                        packages.map((pck: any, i) => (
                                            <div className="border p-3 rounded bg-[#f7f7f7]" key={i}>
                                                <Row gutter={[12, 8]}>
                                                    <Col span={12}>
                                                        <Row gutter={[0, 4]}>
                                                            <Col span={4} className="text-gray-500">
                                                                Código:
                                                            </Col>
                                                            <Col span={18} className="font-semibold">
                                                                {pck?.PRODUTO || "-"}
                                                            </Col>
                                                            <Col span={4} className="text-gray-500">
                                                                Descrição:
                                                            </Col>
                                                            <Col span={18} className="font-semibold">
                                                                {pck?.DESC_PRODUTO || "-"}
                                                            </Col>
                                                            <Col span={4} className="text-gray-500">
                                                                Valor
                                                            </Col>
                                                            <Col span={18} className="font-semibold">
                                                                {pck?.PRECO_LIQUIDO
                                                                    ? new Intl.NumberFormat("pt-BR", {
                                                                          style: "currency",
                                                                          currency: "BRL",
                                                                          minimumFractionDigits: 2,
                                                                          maximumFractionDigits: 2,
                                                                      }).format(pck?.PRECO_LIQUIDO)
                                                                    : "-"}
                                                            </Col>
                                                        </Row>
                                                    </Col>
                                                    <Col span={12}>
                                                        <Row gutter={[0, 4]}>
                                                            <Col span={4} className="text-gray-500">
                                                                Data da bipagem:
                                                            </Col>
                                                            <Col span={18} className="font-semibold">
                                                                {pck?.DATA_HORA_CONFERENCIA ? dayjs(pck?.DATA_HORA_CONFERENCIA).format("DD/MM/YY HH:mm") : "-"}
                                                            </Col>
                                                            <Col span={4} className="text-gray-500">
                                                                Cor/Tamanho:
                                                            </Col>
                                                            <Col span={18} className="font-semibold">
                                                                {pck?.DESC_COR_PRODUTO?.trim() || "-"}
                                                                {" - "}
                                                                {pck?.TAMANHO || "-"}
                                                            </Col>
                                                            <Col span={4} className="text-gray-500">
                                                                Observação:
                                                            </Col>
                                                            <Col span={18} className="font-semibold">
                                                                {pck?.OBS_ITEM || "-"}
                                                            </Col>
                                                        </Row>
                                                    </Col>
                                                </Row>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center bg-slate-50 p-4 rounded">Nenhum item encontrado</div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ) : error ? (
                        <div className="flex items-center justify-center py-20">{error}</div>
                    ) : (
                        <div className="flex items-center justify-center py-20">Nenhum pacote selecionado</div>
                    )}
                </div>
            </Style.Style>
        </Style.Container>
    );
}
