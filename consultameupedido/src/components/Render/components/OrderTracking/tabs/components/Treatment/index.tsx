import NewItem from "./components/NewItem";
import { Button, Modal } from "rtk-ux";
import { useEffect, useState } from "react";
import { create, execFunc, list, remove, update } from "../../../../../api";
import ListGrid from "./components/ListGrid";

type Props = {
  order: any;
};

export default function Treatment({ order }: Props) {
  const [isOpenNew, setIsOpenNew] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isReadOnly, setIsReadOnly] = useState(false);
  const [permissions, setPermissions] = useState<any>(null);
  const [data, setData] = useState([]);
  const [selected, setSelected] = useState<any>(null);

  async function init() {
    setLoading(true);
    await execFunc("check_user_permissions_zd").then(({ data }) =>
      setPermissions(data)
    );
    await list(
      "tratativas_atendimento",
      { filter: { orderId: order?.orderId } },
      undefined,
      "query",
      { __created: 1 }
    ).then(({ data }) => {
      setData(data);
      setLoading(false);
    });
  }
  async function onCreate(data: any) {
    setLoading(true);
    if (data._id) {
      await update("tratativas_atendimento", data);
    } else {
      await create("tratativas_atendimento", {
        ...data,
        orderId: order?.orderId,
        name: `${order?.orderId} - ${data?.numero_ticket}`,
      });
    }
    init();
    setIsOpenNew(false);
    setSelected(null);
    setLoading(false);
  }
  async function onDelete(data: any) {
    if (!data?._id) return;
    setLoading(true);
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
    init();
    return () => {};
  }, []);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <strong className="text-base font-semibold">Incidentes</strong>
        {permissions?.tratativas?.create && (
          <Button
            onClick={() => {
              setSelected(null);
              setIsOpenNew(true);
            }}
            type="primary"
            className="w-min"
          >
            Criar novo
          </Button>
        )}
      </div>
      <ListGrid
        data={data}
        loading={loading}
        permissions={permissions?.tratativas}
        onDelete={onDelete}
        onEdit={onEdit}
      />
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
      >
        <NewItem
          values={selected}
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
