import { MuiIcon, Tag, Tooltip } from "rtk-ux";

interface RowItemInterface {
    field?: any;
    value?: any;
    copy?: boolean;
    col?: boolean;
    url?: any;
    nf?: any;
    onNf?: any;
}

const RowItem = ({ field = "", value = "", copy = false, col = false, url = null, nf = false, onNf = () => {} }: RowItemInterface) => {
    return (
        <div className={`flex ${col ? "w-full flex-col" : "w-1/2 items-center"}`}>
            <div className="min-w-14 text-gray-400">{field}</div>
            <div className={`font-semibold overflow-hidden overflow-ellipsis ${col ? "mt-0.5" : "ml-1"}`}>{typeof value === "boolean" ? <Tag color={value ? "green" : "red"}>{value ? "Completo" : "Incompleto"}</Tag> : value || "-"}</div>
            {value && url && (
                <MuiIcon
                    icon={["mui", "link"]}
                    className="cursor-pointer mr-1 text-blue-600"
                    onClick={() => {
                        window.open(value, "__blank");
                    }}
                />
            )}
            {value && copy && (
                <Tooltip title="Copiar">
                    <MuiIcon
                        icon={["mui", "copy_all"]}
                        width={10}
                        className="text-gray-500 hover:text-orange-500 cursor-pointer mr-1"
                        onClick={() => {
                            navigator.clipboard.writeText(value);
                        }}
                    />
                </Tooltip>
            )}
            {value && nf && (
                <Tooltip title="Baixar nota fiscal">
                    <MuiIcon
                        icon={["mui", "remove_red_eye"]}
                        width={10}
                        className="text-gray-500 hover:text-orange-500 cursor-pointer mr-1"
                        onClick={() => {
                            onNf();
                        }}
                    />
                </Tooltip>
            )}
        </div>
    );
};
export default RowItem;
