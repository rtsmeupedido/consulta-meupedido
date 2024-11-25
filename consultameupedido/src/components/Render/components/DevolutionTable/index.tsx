import dayjs from "dayjs";
import { Table } from "rtk-ux";

type Props = {
    data: any[];
    onRowClick: (data: any, text: string) => void;
    selectedRow: any;
    brands: any[];
};

export default function DevolutionTable({ data, selectedRow, onRowClick, brands }: Props) {
    return (
        <div className="w-1/3 border-r overflow-auto">
            <Table
                pagination={false}
                size="small"
                components={{
                    header: {
                        cell: (props: any) => <th {...props}>{props.children}</th>,
                    },
                    body: {
                        row: (props: any) => (
                            <tr {...props} className={`${props.className} ${selectedRow?._id && props?.["data-row-key"] === selectedRow?._id ? "custom bg-blue-500 text-white" : ""}`}>
                                {props?.children}
                            </tr>
                        ),
                    },
                }}
                rowKey={"_id"}
                columns={[
                    {
                        title: "Pacote",
                        dataIndex: "_id",
                        render: (text, rowData) => (
                            <div
                                className="hover:brightness-90 cursor-pointer"
                                onClick={() => {
                                    onRowClick(rowData, text);
                                }}
                            >
                                {text || "-"}
                            </div>
                        ),
                    },
                    {
                        dataIndex: "hostname",
                        title: "Marca",
                        align: "center",
                        width: 100,
                        render: (brand: string | null) => <div>{brands?.find((b: any) => b?.nome_vtex === brand)?.name || "-"}</div>,
                    },
                    {
                        title: "Data da compra",
                        width: 140,
                        align: "center",
                        dataIndex: "authorizedDate",
                        render: (date) => <div>{date ? dayjs(date).format("DD/MM/YYYY") : "-"}</div>,
                    },
                ]}
                dataSource={data}
            />
        </div>
    );
}
