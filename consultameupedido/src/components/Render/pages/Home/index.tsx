/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useEffect, useState } from "react";
import OrderTracking from "../../components/OrderTracking";
import ProductDetails from "../../components/ProductDetails";
import { Button, Divider, Modal, MuiIcon } from "rtk-ux";
import { useZaf } from "../../hooks/useZaf";
import { useAuth } from "../../hooks/useAuth";
import { message } from "antd";
import Devolution from "../../components/Devolution";
import { downloadNf, execFunc } from "../../api";

const Home = () => {
    const keyMsg = "msg-order-updatable";
    const [messageApi, contextHolder] = message.useMessage();
    const zafClient = useZaf();
    const { logout } = useAuth();
    const [showLogout, setShowLogout] = useState(false);
    const [active, setActive] = useState("order");

    async function onGetNf(key: string) {
        messageApi.open({
            type: "loading",
            key: keyMsg,
            content: "Buscando nota fiscal...",
            duration: 0,
        });
        const error = () => {
            messageApi.open({
                type: "error",
                key: keyMsg,
                content: "Nota fiscal não encontrada.",
                duration: 2,
            });
        };
        await execFunc("download_nf_zd", { key })
            .then(({ success, data }) => {
                if (success && data.url) {
                    messageApi.open({
                        type: "info",
                        key: keyMsg,
                        content: "Baixando nota fiscal.",
                        duration: 2,
                    });
                    if (data.type === "download") {
                        downloadNf(data, `nf-${key}.pdf`);
                    } else if (data.type === "open") {
                        window.open(data.url, "_blank");
                    }
                } else {
                    error();
                }
            })
            .catch(() => {
                error();
            });
        setTimeout(messageApi.destroy, 2000);
    }

    async function init() {
        //@ts-ignore
        const t: any = await zafClient.zafClient?.get("viewport.size");
        zafClient.zafClient?.invoke("resize", { width: (t?.["viewport.size"].width || 1000) * 0.85, height: (t?.["viewport.size"].height || 600) - 150 });
    }
    useEffect(() => {
        init();
    }, []);

    return (
        <div className="flex flex-col gap-3 p-4">
            {contextHolder}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Button icon={<MuiIcon icon={["muil", "shopping_bag"]} color={active === "order" ? "white" : "black"} />} onClick={() => setActive("order")} type={active === "order" ? "primary" : "default"}>
                        Pacotes
                    </Button>
                    <Button icon={<MuiIcon icon={["muil", "dry_cleaning"]} color={active === "product" ? "white" : "black"} />} onClick={() => setActive("product")} type={active === "product" ? "primary" : "default"}>
                        Produtos
                    </Button>
                    <Button icon={<MuiIcon icon={["muil", "rotate_90_degrees_ccw"]} color={active === "devolution" ? "white" : "black"} />} onClick={() => setActive("devolution")} type={active === "devolution" ? "primary" : "default"}>
                        Devolução
                    </Button>
                </div>
                <Button icon={<MuiIcon icon={["mui", "logout"]} color="white" />} className="bg-gray-400 hover:bg-gray-500 text-white" type="text" onClick={() => setShowLogout(true)}>
                    Fazer logoff
                </Button>
            </div>
            <Divider className="my-1" />
            <div className={active === "order" ? "block" : "hidden"}>
                <OrderTracking onGetNf={onGetNf} />
            </div>
            <div className={active === "product" ? "block" : "hidden"}>
                <ProductDetails />
            </div>
            <div className={active === "devolution" ? "block" : "hidden"}>
                <Devolution onGetNf={onGetNf} />
            </div>
            <Modal
                centered
                open={showLogout}
                closable={false}
                cancelText="Não"
                okText={"Sim"}
                onCancel={() => setShowLogout(false)}
                okButtonProps={{ danger: true }}
                onOk={() => {
                    logout();
                    setShowLogout(false);
                }}
            >
                <div className="flex items-center gap-2">
                    <MuiIcon icon={["mui", "info"]} width={20} color="red" />
                    Tem certeza que deseja realizar logoff?
                </div>
            </Modal>
        </div>
    );
};

export default Home;
