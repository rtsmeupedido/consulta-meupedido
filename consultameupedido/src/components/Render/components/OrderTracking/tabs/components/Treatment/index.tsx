import NewItem from "./components/NewItem";
import { Button, Modal } from "rtk-ux";
import { useEffect, useState } from "react";
import { create, execFunc, list, remove, update } from "../../../../../api";
import ListGrid from "./components/ListGrid";
import arrayToTree from "array-to-tree";
import { options as defOptions } from "./util";
import { saveLog } from "../../../../../utils";

type Props = {
    order: any;
};

export default function Treatment({ order }: Props) {
    const [options, setOptions] = useState<any>([]);
    const [optionsFlat, setOptionsFlat] = useState<any>([]);
    const [isOpenNew, setIsOpenNew] = useState(false);
    const [loading, setLoading] = useState(true);
    const [isReadOnly, setIsReadOnly] = useState(false);
    const [permissions, setPermissions] = useState<any>(null);
    const [data, setData] = useState([]);
    const [selected, setSelected] = useState<any>(null);

    async function getPermissionsAndItems() {
        try {
            await execFunc("check_user_permissions_zd").then(({ data }) => {
                setPermissions(data);
            });
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
            await create("tratativas_atendimento", {
                ...data,
                orderId: order?.orderId,
                name: `${order?.orderId} - ${data?.numero_ticket}`,
            });
        }
        setIsOpenNew(false);
        setSelected(null);
        await init();
    }
    async function onDelete(data: any) {
        if (!data?._id) return;
        setLoading(true);
        saveLog({ actionCallType: "delete", actionCallName: "tratativas_atendimento", actionDescription: `Apagou uma incidência: ${data?._id}`, actionCallDataSent: data });
        await remove("tratativas_atendimento", data?._id)
            .then(({ success }) => {
                if (!success) return;
                init();
            })
            .catch(() => {});
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
