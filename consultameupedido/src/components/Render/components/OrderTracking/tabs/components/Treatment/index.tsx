import NewItem from "./components/NewItem";
import { Button } from "rtk-ux";
import { useEffect, useState } from "react";
import { create, execFunc, list } from "../../../../../api";
import ListGrid from "./components/ListGrid";

type Props = {
    order: any;
};

export default function Treatment({ order }: Props) {
    const [isOpenNew, setIsOpenNew] = useState(false);
    const [loading, setLoading] = useState(true);
    const [permissions, setPermissions] = useState<any>(null);
    const isManager = permissions?.check_user_permissions_zd;
    const [data, setData] = useState([]);
    const [selected, setSelected] = useState<any>(null);

    async function init() {
        setLoading(true);
        await execFunc("check_user_permissions_zd").then(({ data }) => setPermissions(data));
        await list("tratativas_atendimento", { filter: { orderId: order?.orderId } }, undefined, undefined, { __created: 1 }).then(({ data }) => {
            setData(data);
            setLoading(false);
        });
    }

    async function onCreateTask(data: any) {
        await create("tratativas_atendimento", { ...data, orderId: order?.orderId, name: `${order.orderId} - ${data?.numero_ticket}` })
            .then(({ success }) => {
                if (!success) return;
                init();
                setIsOpenNew(false);
                setSelected(null);
            })
            .catch(() => {});
    }

    useEffect(() => {
        init();
        return () => {};
    }, []);

    return (
        <div className="flex flex-col gap-2">
            {isOpenNew ? (
                <NewItem
                    values={selected}
                    readOnly={!isManager}
                    onSave={async (data: any) => {
                        await onCreateTask(data);
                    }}
                    onCancel={() => {
                        setIsOpenNew(false);
                        setSelected(null);
                    }}
                />
            ) : (
                <>
                    <div className="flex items-center justify-between">
                        <strong className="text-base font-semibold">Incidentes</strong>
                        {isManager && (
                            <Button onClick={() => setIsOpenNew(true)} type="primary" className="w-min">
                                Criar novo
                            </Button>
                        )}
                    </div>
                    <ListGrid data={data} loading={loading} />
                </>
            )}
        </div>
    );
}
