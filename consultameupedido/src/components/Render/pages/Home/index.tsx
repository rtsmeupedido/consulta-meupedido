/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useEffect, useState } from "react";
import OrderTracking from "../../components/OrderTracking";
import ProductDetails from "../../components/ProductDetails";
import { Button, Divider, Modal, MuiIcon } from "rtk-ux";
import { useZaf } from "../../hooks/useZaf";
import { useAuth } from "../../hooks/useAuth";
import { message } from "antd";
import Devolution from "../../components/Devolution";
import { downloadNf, execFunc, list, show } from "../../api";
import DevolutionRequest from "../../components/DevolutionRequest";

const Home = () => {
    const keyMsg = "msg-order-updatable";
    const [messageApi, contextHolder] = message.useMessage();
    const zafClient = useZaf();
    const { logout } = useAuth();
    const [showLogout, setShowLogout] = useState(false);
    const [versionApp, setVersionApp] = useState(null);
    const [brands, setBrands] = useState<any>([]);
    const [userBrands, setUserBrands] = useState<any>(null);
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
        zafClient.zafClient?.metadata().then(function (metadata) {
            //@ts-ignore
            if (metadata?.version) {
                //@ts-ignore
                setVersionApp(metadata?.version);
            }
        });
    }
    const getBrands = async () => {
        const _id = localStorage.getItem("@id-tck-meupedido-zendesk");
        if (_id) {
            await show("local_users", { _id: _id }).then(({ data }: any) => {
                setUserBrands(data?.mp_brands);
            });
        }
        return await list("mp_brands")
            .then(({ data, success }: { data: any; success: boolean }) => {
                if (!success) return;
                setBrands(data);
            })
            .catch(function (error: any) {
                console.log(error);
            });
    };

    const filterBrands = brands
        .filter((e: any) => userBrands?.includes(e.nome_vtex))
        .map((e: any) => ({
            name: e?.name,
            nome_vtex: e?.nome_vtex,
            keywords: e?.keywords,
        }));
    useEffect(() => {
        init();
        getBrands();
    }, []);

    return (
        <div className="flex flex-col gap-3 p-4">
            {contextHolder}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    {tabs.map((tab) => (
                        // @ts-ignore
                        <Button icon={<MuiIcon icon={tab.icon} color={active === tab.keyname ? "white" : "black"} />} onClick={() => setActive(tab.keyname)} type={active === tab.keyname ? "primary" : "default"}>
                            {tab.name}
                        </Button>
                    ))}
                </div>
                <Button icon={<MuiIcon icon={["mui", "logout"]} color="white" />} className="bg-gray-400 hover:bg-gray-500 text-white" type="text" onClick={() => setShowLogout(true)}>
                    Fazer logoff
                </Button>
            </div>
            <Divider className="my-1" />
            <div className={active === "order" ? "block" : "hidden"}>
                <OrderTracking onGetNf={onGetNf} userBrands={filterBrands} brands={brands} />
            </div>
            <div className={active === "product" ? "block" : "hidden"}>
                <ProductDetails userBrands={filterBrands} />
            </div>
            <div className={active === "devolution" ? "block" : "hidden"}>
                <Devolution onGetNf={onGetNf} brands={brands} userBrands={filterBrands} />
            </div>
            <div className={active === "request_devolution" ? "block" : "hidden"}>
                <DevolutionRequest brands={brands} userBrands={filterBrands} />
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
            {versionApp ? <div className="fixed bottom-0.5 text-gray-300 left-1 text-[10px]">{`${versionApp}`}</div> : ""}
        </div>
    );
};

export default Home;

const tabs = [
    { name: "Pacotes", keyname: "order", icon: ["muil", "shopping_bag"] },
    { name: "Produtos", keyname: "product", icon: ["muil", "dry_cleaning"] },
    { name: "Troquecommerce", keyname: "request_devolution", icon: ["muil", "youtube_searched_for"] },
    { name: "Devolução bipada", keyname: "devolution", icon: ["muil", "rotate_90_degrees_ccw"] },
];
