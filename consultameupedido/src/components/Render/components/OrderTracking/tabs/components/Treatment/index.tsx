import NewItem from "./components/NewItem";
import { Button, Modal } from "rtk-ux";
import { useEffect, useState } from "react";
import { create, list, pushItem, remove, removeItem, update } from "../../../../../api";
import ListGrid from "./components/ListGrid";
import arrayToTree from "array-to-tree";
import { options as defOptions } from "./util";
import { saveLog } from "../../../../../utils";

type Props = {
    order: any;
    permissions: any;
};

export default function Treatment({ order, permissions }: Props) {
    const [options, setOptions] = useState<any>([]);
    const [optionsFlat, setOptionsFlat] = useState<any>([]);
    const [isOpenNew, setIsOpenNew] = useState(false);
    const [loading, setLoading] = useState(true);
    const [isReadOnly, setIsReadOnly] = useState(false);
    const [data, setData] = useState([]);
    const [selected, setSelected] = useState<any>(null);

    async function getPermissionsAndItems() {
        try {
            await list("classificacoes_tratativas", {}, undefined, "query", { __created: 1 }).then(({ data }) => {
                setOptionsFlat(data);
                const formatData = (data || [])?.map((e: any) => ({ ...e, label: e?.name, value: e?._id }));
                const _res = arrayToTree(formatData, {
                    parentProperty: "parent",
                    customID: "_id",
                    rootID: "_id",
                });
                if (_res) {
                    setOptions(_res);
                } else {
                    setOptions(defOptions);
                }
            });
        } catch (err) {
            return err;
        }
    }
    async function init() {
        if (!order?.orderId) return;
        setLoading(true);
        await list("tratativas_atendimento", { filter: { orderId: order?.orderId } }, undefined, "query", { __created: 1 }).then(({ data }) => {
            setData(data);
        });
        setLoading(false);
    }

    async function onCreate(data: any) {
        setLoading(true);
        if (data._id) {
            saveLog({ actionCallType: "update", actionCallName: "tratativas_atendimento", actionDescription: `Atualizou uma incidência: ${data?._id}`, actionCallDataSent: data });
            await update("tratativas_atendimento", data);
        } else {
            saveLog({ actionCallType: "create", actionCallName: "tratativas_atendimento", actionDescription: `Criou uma nova incidência: ${order?.orderId}`, actionCallDataSent: data });
            const trat = await create("tratativas_atendimento", {
                ...data,
                orderId: order?.orderId,
                name: `${order?.orderId} - ${data?.numero_ticket}`,
            });
            try {
                const tratLog = {
                    _id: trat?.data?._id,
                    name: `${order?.orderId} - ${data?.numero_ticket}`,
                    __encerra_ciclo_cliente: data?.encerra_ciclo_pedido_cliente,
                };
                await pushItem({ datasource: "mp_packages", idDocument: order._id, fieldItem: "__tratativas_zendesk", data: tratLog });
                await pushItem({ datasource: "mp_opened_packages", idDocument: order._id, fieldItem: "__tratativas_zendesk", data: tratLog });
                const incidenteModel = optionsFlat?.find((e: any) => e._id === data?.incidente_id);
                if (incidenteModel?.encerra_ciclo_pedido_cliente) {
                    update("mp_packages", { _id: order?.orderId, __encerra_ciclo_cliente: true });
                    update("mp_opened_packages", { _id: order?.orderId, __encerra_ciclo_cliente: true });
                }
            } catch (error) {
                console.error(error);
            }
        }
        setIsOpenNew(false);
        setSelected(null);
        await init();
    }
    async function onDelete(data: any) {
        if (!data?._id) return;
        const incidenteModel = optionsFlat?.find((e: any) => e._id === data?.incidente_id);

        setLoading(true);
        saveLog({ actionCallType: "delete", actionCallName: "tratativas_atendimento", actionDescription: `Apagou uma incidência: ${data?._id}`, actionCallDataSent: data });
        await remove("tratativas_atendimento", data?._id)
            .then(({ success }) => {
                if (!success) return;
                init();
            })
            .catch(() => {});
        try {
            await removeItem({ datasource: "mp_packages", idDocument: order._id, fieldItem: "__tratativas_zendesk", idItem: data._id });
            await removeItem({ datasource: "mp_opened_packages", idDocument: order._id, fieldItem: "__tratativas_zendesk", idItem: data._id });
            if (incidenteModel?.encerra_ciclo_pedido_cliente) {
                update("mp_packages", { _id: order?.orderId, __encerra_ciclo_cliente: false });
                update("mp_opened_packages", { _id: order?.orderId, __encerra_ciclo_cliente: false });
            }
        } catch (error) {
            console.error(error);
        }
        setLoading(false);
    }
    async function onEdit(data: any, readOnly?: boolean) {
        if (readOnly) {
            setIsReadOnly(readOnly);
        }
        setSelected(data);
        setTimeout(() => {
            setIsOpenNew(true);
        }, 100);
    }

    useEffect(() => {
        const initPage = async () => {
            await getPermissionsAndItems();
            await init();
        };
        initPage();
        return () => {};
    }, [order?.orderId]);

    return (
        <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
                <strong className="text-base font-semibold">Incidências ({data?.length})</strong>
                {permissions?.tratativas?.create && (
                    <Button
                        onClick={() => {
                            setSelected(null);
                            setIsOpenNew(true);
                        }}
                        type="primary"
                        className="w-min"
                    >
                        Criar nova
                    </Button>
                )}
            </div>
            <ListGrid options={options} optionsFlat={optionsFlat} data={data} loading={loading} permissions={permissions?.tratativas} onDelete={onDelete} onEdit={onEdit} />
            <Modal
                destroyOnClose
                title={"Incidente"}
                centered
                open={isOpenNew}
                footer={null}
                cancelText={isReadOnly ? "fechar" : "cancelar"}
                onCancel={() => {
                    setIsOpenNew(false);
                    setSelected(null);
                    setIsReadOnly(false);
                }}
                classNames={{
                    content: "p-0",
                    header: "px-6 pt-4 pb-2",
                }}
            >
                <NewItem
                    values={selected}
                    options={options}
                    optionsFlat={optionsFlat}
                    readOnly={isReadOnly}
                    onSave={async (data: any) => {
                        await onCreate(data);
                    }}
                    onCancel={() => {
                        setIsOpenNew(false);
                        setSelected(null);
                        setIsReadOnly(false);
                    }}
                />
            </Modal>
        </div>
    );
}
