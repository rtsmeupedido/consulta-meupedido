/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useEffect, useState } from "react";
import OrderTracking from "../../components/OrderTracking";
import ProductDetails from "../../components/ProductDetails";
import { Button, Divider, Modal, MuiIcon } from "rtk-ux";
import { useZaf } from "../../hooks/useZaf";
import { useAuth } from "../../hooks/useAuth";

const Home = () => {
    const zafClient = useZaf();
    const { logout } = useAuth();
    const [showLogout, setShowLogout] = useState(false);
    const [active, setActive] = useState("order");

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
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Button icon={<MuiIcon icon={["muil", "shopping_bag"]} color={active === "order" ? "white" : "black"} />} onClick={() => setActive("order")} type={active === "order" ? "primary" : "default"}>
                        Pacotes
                    </Button>
                    <Button icon={<MuiIcon icon={["muil", "dry_cleaning"]} color={active === "product" ? "white" : "black"} />} onClick={() => setActive("product")} type={active === "product" ? "primary" : "default"}>
                        Produtos
                    </Button>
                </div>
                <Button icon={<MuiIcon icon={["mui", "logout"]} color="white" />} className="bg-gray-400 hover:bg-gray-500 text-white" type="text" onClick={() => setShowLogout(true)}>
                    Fazer logoff
                </Button>
            </div>
            <Divider className="my-1" />
            {active === "order" && <OrderTracking />}
            {active === "product" && <ProductDetails />}
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
