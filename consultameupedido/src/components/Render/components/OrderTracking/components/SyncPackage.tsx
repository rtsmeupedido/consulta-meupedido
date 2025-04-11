import { useState } from "react";
import { Button, Input, MuiIcon } from "rtk-ux";
import { execFunc, show } from "../../../api";
import { Empty } from "antd";
import { MessageInstance } from "antd/es/message/interface";

type Props = {
    onClose: (t?: string) => void;
    messageApi: MessageInstance;
};

export default function SyncPackage({ onClose, messageApi }: Props) {
    const [text, setText] = useState("");
    const [loading, setLoading] = useState(false);
    const [loadingSync, setLoadingSync] = useState(false);
    const [submited, setSubmited] = useState(false);
    const [packageInfo, setPackage] = useState<any>(null);

    async function onSearch() {
        setSubmited(false);
        setLoading(true);
        await show("mp_packages", { _id: text }).then(({ data }: any) => {
            setSubmited(true);
            setPackage(data);
            setLoading(false);
        });
    }

    async function onSync() {
        setLoadingSync(true);
        await execFunc("create_packages_zendesk", { OrderId: text, orderId: text, order_id: text })
            .then(({ data }) => {
                setLoadingSync(false);
                if (data?.status_criacao_pacote === "success") {
                    messageApi.open({
                        type: "success",
                        content: "Pacote integrado com sucesso...",
                        duration: 2,
                    });
                    onClose(text);
                } else {
                    messageApi.open({
                        type: "error",
                        content: "Não foi possível integrar este pacote.",
                        duration: 4,
                    });
                }
            })
            .catch(() => setLoadingSync(false));
    }

    return (
        <div className="p-4 flex flex-col w-full">
            <div className="flex flex-col w-full gap-1">
                <div className="text-base font-semibold">Integrar pacotes</div>
                <div>Busque pelo pacote</div>
                <div className="flex items-center gap-1">
                    <Input className="w-72 h-8" placeholder="Pacote" onChange={({ target }) => setText(target.value)} value={text} />
                    <Button onClick={() => onSearch()} disabled={text?.length < 4} loading={loading}>
                        <MuiIcon icon={["mui", "search"]} color="black" />
                    </Button>
                    <Button onClick={() => onClose()}>cancelar</Button>
                </div>
            </div>
            {submited && (
                <>
                    {packageInfo ? (
                        <div className="mt-4 bg-emerald-50 w-full rounded-md">
                            <div className="font-medium text-emerald-600 p-4 text-center">
                                O pacote <strong>{packageInfo?._id}</strong> já foi integrado.
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col py-12 gap-4 items-center">
                            <Empty description="O pacote não foi encontrado." image={Empty.PRESENTED_IMAGE_SIMPLE} />
                            <Button type="primary" className="w-fit" onClick={() => onSync()} loading={loadingSync}>
                                <div className="flex items-center gap-2">
                                    <MuiIcon icon={["mui", "sync"]} width={10} />
                                    Integrar agora
                                </div>
                            </Button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
