import dayjs from "dayjs";
import { Col, Loader, Row, Tag } from "rtk-ux";
import { options, optionsSAC } from "../util";

type Props = {
    data: any[];
    loading?: boolean;
};

export default function ListGrid({ data, loading }: Props) {
    return (
        <div className="flex flex-col divide-y">
            {loading ? (
                <div className="flex items-center justify-center absolute w-full py-12">
                    <Loader />
                </div>
            ) : data?.length > 0 ? (
                data?.map((item) => <ListItem key={item._id} item={item} />)
            ) : (
                <div className="text-center p-8">Nenhum incidente encontrado</div>
            )}
        </div>
    );
}

const ListItem = ({ item }: any) => {
    const tratativaSAC = optionsSAC?.find((e) => e?.value === item?.sac);
    const inc1 = options?.find((e) => e?.value === item?.incidente?.[0]);
    const inc2 = inc1 && item?.incidente?.[1] && inc1?.children?.find((e: any) => e?.value === item?.incidente?.[1]);
    const inc3 = inc2 && item?.incidente?.[2] && inc2?.children?.find((e: any) => e?.value === item?.incidente?.[2]);

    return (
        <div className="py-3 px-2">
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
                {/* Tratativa SAC */}
                <Col span={4}>
                    <div className="text-gray-400">Tratativa SAC:</div>
                </Col>
                <Col span={8} className="font-semibold">
                    {tratativaSAC?.label}
                </Col>
                {/* Data */}
                <Col span={4}>
                    <div className="text-gray-400">Criado em:</div>
                </Col>
                <Col span={8} className="font-semibold">
                    {dayjs(item?.__created).format("DD/MM/YY HH:mm")}
                </Col>
                {/* Ticket */}
                <Col span={4}>
                    <div className="text-gray-400">Ticket:</div>
                </Col>
                <Col span={8} className="font-semibold">
                    <Tag>#{item?.numero_ticket}</Tag>
                </Col>
            </Row>
        </div>
    );
};
