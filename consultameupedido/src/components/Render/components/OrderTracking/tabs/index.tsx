import { Tabs } from "rtk-ux";
import LiveEvents from "./components/LiveEvents";
import PackageDetail from "./components/Detail";
import Treatment from "./components/Treatment";
import TimeLine from "./components/TimeLine";

export default function Tab({ order, onGetNf, permissions }: { order: any; onGetNf: (str: string) => void; permissions: any }) {
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
                                height: "calc(100vh - 200px)",
                            }}
                        >
                            <PackageDetail orderSelected={order} onGetNf={onGetNf} />
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
                                height: "calc(100vh - 200px)",
                            }}
                        >
                            <LiveEvents order={order} />
                        </div>
                    ),
                },
                {
                    label: <div className="text-xs">Tratativa Atendimento</div>,
                    key: "treatment",
                    children: (
                        <div
                            className="overflow-auto"
                            style={{
                                height: "calc(100vh - 200px)",
                            }}
                        >
                            <Treatment order={order} permissions={permissions} />
                        </div>
                    ),
                },
                {
                    label: <div className="text-xs">Timeline</div>,
                    key: "timeline",
                    children: (
                        <div
                            className="overflow-auto"
                            style={{
                                height: "calc(100vh - 200px)",
                            }}
                        >
                            <TimeLine order={order} />
                        </div>
                    ),
                },
            ]}
        />
    );
}
