import dayjs from "dayjs";
import { Button, Col, Dropdown, Loader, MuiIcon, Row } from "rtk-ux";
import { optionsSAC } from "../util";
import { formatJsonField } from "../../../../../../utils";

type Props = {
    data: any[];
    loading?: boolean;
    permissions?: boolean;
    onDelete: any;
    onEdit: any;
    options: any[];
    optionsFlat: any[];
};

export default function ListGrid({ data, loading, permissions, onDelete, onEdit, options, optionsFlat }: Props) {
    return (
        <div className="flex flex-col divide-y">
            {loading ? (
                <div className="flex items-center justify-center absolute w-full py-12">
                    <Loader />
                </div>
            ) : data?.length > 0 ? (
                data?.map((item, i) => <ListItem options={options} optionsFlat={optionsFlat} index={i} key={item._id} item={item} permissions={permissions} onEdit={onEdit} onView={onEdit} onDelete={onDelete} />)
            ) : (
                <div className="text-center p-8">Nenhuma incidência encontrada</div>
            )}
        </div>
    );
}

const ListItem = ({ item, index, permissions, onEdit, onView, onDelete, options, optionsFlat }: any) => {
    const tratativaSAC = optionsSAC?.find((e) => e?.value === item?.sac);
    const inc1 = options?.find((e: any) => e?.value === item?.incidente?.[0]);
    const inc2 = inc1 && item?.incidente?.[1] && inc1?.children?.find((e: any) => e?.value === item?.incidente?.[1]);
    const inc3 = inc2 && item?.incidente?.[2] && inc2?.children?.find((e: any) => e?.value === item?.incidente?.[2]);

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

    const incidenteModel = optionsFlat?.find((e: any) => e?._id === item?.incidente_id);

    return (
        <div className="py-6 px-0 relative flex flex-col group/item first:pt-1">
            <Row gutter={[0, 8]}>
                {/* Incidente */}
                {/* <Col span={4}></Col> */}
                <Col span={24} className="flex text-sm gap-3">
                    <span className="text-gray-400">Incidência #0{index + 1}:</span>
                    <span className="font-semibold">
                        {inc1?.label}
                        {inc2 && ` - ${inc2?.label}`}
                        {inc3 && ` - ${inc3?.label}`}
                    </span>
                </Col>
                {/* Criado por */}
                <Col span={12} className="flex gap-3">
                    <div className="text-gray-400">Criado por:</div>
                    <div className="font-semibold">
                        {item?.user_name} - {dayjs(item?.__created).format("DD/MM/YY HH:mm")}
                    </div>
                </Col>
                {/* Ticket */}
                <Col span={12} className="flex gap-3">
                    <div className="text-gray-400">Ticket:</div>
                    <div className="font-semibold">
                        {item?.numero_ticket?.startsWith("#") ? "" : "#"}
                        {item?.numero_ticket}
                    </div>
                </Col>
                {/* Tratativa SAC */}
                <Col span={12}>
                    <div className="flex items-center gap-3">
                        <div className="text-gray-400">Tratativa SAC:</div>
                        <div className="font-semibold">{tratativaSAC?.label}</div>
                    </div>
                </Col>
                {tratativaSAC?.fields?.map((field, i) => (
                    <Col span={12} key={`t-${i}`} className="flex gap-3">
                        <div className="text-gray-400">{field.label}:</div>
                        <div className="font-semibold">{formatValue(item?.[field?.value])}</div>
                    </Col>
                ))}
                {incidenteModel?.extra_fields
                    ?.filter((e: any) => e?.title)
                    ?.map((field: any, i: number) => (
                        <Col span={12} key={`t-${i}`} className="flex gap-3">
                            <div className="text-gray-400">{field?.title}:</div>
                            <div className="font-semibold">{item?.[formatJsonField(field?.title)] || "-"}</div>
                        </Col>
                    ))}
            </Row>
            <div className="absolute right-0 hidden group-hover/item:block">
                <Dropdown
                    trigger={["click"]}
                    menu={{
                        className: "min-w-32",
                        items: actions,
                    }}
                >
                    <Button icon={<MuiIcon icon={["mui", "more_vert"]} color="black" />} />
                </Dropdown>
            </div>
        </div>
    );
};

function formatValue(value: string | number) {
    return value || "-";
}
