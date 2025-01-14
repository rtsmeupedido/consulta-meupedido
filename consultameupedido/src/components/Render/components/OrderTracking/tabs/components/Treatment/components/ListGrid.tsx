import dayjs from "dayjs";
import { Button, Col, Dropdown, Loader, MuiIcon, Row, Tag } from "rtk-ux";
import { options, optionsSAC } from "../util";

type Props = {
  data: any[];
  loading?: boolean;
  permissions?: boolean;
  onDelete: any;
  onEdit: any;
};

export default function ListGrid({
  data,
  loading,
  permissions,
  onDelete,
  onEdit,
}: Props) {
  return (
    <div className="flex flex-col divide-y">
      {loading ? (
        <div className="flex items-center justify-center absolute w-full py-12">
          <Loader />
        </div>
      ) : data?.length > 0 ? (
        data?.map((item) => (
          <ListItem
            key={item._id}
            item={item}
            permissions={permissions}
            onEdit={onEdit}
            onView={onEdit}
            onDelete={onDelete}
          />
        ))
      ) : (
        <div className="text-center p-8">Nenhum incidente encontrado</div>
      )}
    </div>
  );
}

const ListItem = ({ item, permissions, onEdit, onView, onDelete }: any) => {
  const tratativaSAC = optionsSAC?.find((e) => e?.value === item?.sac);
  const inc1 = options?.find((e) => e?.value === item?.incidente?.[0]);
  const inc2 =
    inc1 &&
    item?.incidente?.[1] &&
    inc1?.children?.find((e: any) => e?.value === item?.incidente?.[1]);
  const inc3 =
    inc2 &&
    item?.incidente?.[2] &&
    inc2?.children?.find((e: any) => e?.value === item?.incidente?.[2]);

  async function onAction(type: string) {
    switch (type) {
      case "read":
        await onView(item, true);
        break;
      case "edit":
        await onEdit(item);
        break;
      case "delete":
        await onDelete(item);
        break;
      default:
        break;
    }
  }

  const actions = [
    {
      label: "Visualizar",
      onClick: () => onAction("read"),
      enable: permissions?.read,
      key: "read",
    },
    {
      label: "Editar",
      onClick: () => onAction("edit"),
      enable: permissions?.update,
      key: "edit",
    },
    {
      label: "Excluir",
      onClick: () => onAction("delete"),
      enable: permissions?.delete,
      key: "delete",
    },
  ].filter((e) => e.enable);

  return (
    <div className="py-3 px-2 relative flex items-center group/item">
      <Row gutter={[0, 4]}>
        {/* Incidente */}
        <Col span={4}>
          <div className="text-gray-400">Incidente:</div>
        </Col>
        <Col span={20} className="font-semibold">
          {inc1?.label}
          {inc2 && ` - ${inc2?.label}`}
          {inc3 && ` - ${inc3?.label}`}
        </Col>
        {/* Nome */}
        <Col span={4}>
          <div className="text-gray-400">Nome:</div>
        </Col>
        <Col span={8} className="font-semibold">
          {item?.name}
        </Col>
        {/* Ticket */}
        <Col span={4}>
          <div className="text-gray-400">Ticket:</div>
        </Col>
        <Col span={8} className="font-semibold">
          <Tag>#{item?.numero_ticket}</Tag>
        </Col>
        {/* Tratativa SAC */}
        <Col span={4}>
          <div className="text-gray-400">Tratativa SAC:</div>
        </Col>
        <Col span={20} className="font-semibold">
          {tratativaSAC?.label}
        </Col>
        {/* Criado por */}
        <Col span={4}>
          <div className="text-gray-400">Criado por:</div>
        </Col>
        <Col span={8} className="font-semibold">
          {item?.user_name}
        </Col>
        {/* Data */}
        <Col span={4}>
          <div className="text-gray-400">Criado em:</div>
        </Col>
        <Col span={8} className="font-semibold">
          {dayjs(item?.__created).format("DD/MM/YY HH:mm")}
        </Col>
      </Row>
      <div className="absolute right-4 hidden group-hover/item:block">
        <Dropdown
          trigger={["click"]}
          menu={{
            className: "min-w-32",
            items: actions,
          }}
        >
          <Button
            icon={<MuiIcon icon={["mui", "more_vert"]} color="black" />}
          />
        </Dropdown>
      </div>
    </div>
  );
};
