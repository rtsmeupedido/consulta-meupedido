import { Tabs } from "rtk-ux";
import LiveEvents from "./components/LiveEvents";
import PackageDetail from "./components/Detail";

export default function Tab({ order }: any) {
    return (
        <Tabs
            defaultActiveKey="1"
            className="w-full"
            items={[
                {
                    label: <div className="text-xs">Informações do pacote</div>,
                    key: "package-info",
                    children: (
                        <div
                            className="overflow-auto px-2"
                            style={{
                                height: "calc(100vh - 150px)",
                            }}
                        >
                            <PackageDetail orderSelected={order} />
                        </div>
                    ),
                },
                {
                    label: <div className="text-xs">Todos os eventos</div>,
                    key: "package-tracking",
                    children: (
                        <div
                            className="overflow-auto"
                            style={{
                                height: "calc(100vh - 150px)",
                            }}
                        >
                            <LiveEvents order={order} />
                        </div>
                    ),
                },
            ]}
        />
    );
}
