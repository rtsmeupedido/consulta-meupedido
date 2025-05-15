import { MuiIcon, Tag, Tooltip } from "rtk-ux";
import { toCurrency } from "../../../../../../utils";

export default function Item({ data, isRemoved }: any) {
    return (
        <div className={"flex item-center group/item relative"}>
            <img style={{ height: 45, width: 30 }} className="object-contain rounded-sm" src={data?.imageUrl} />
            <div className={`flex justify-center flex-col flex-1 px-2 relative ${isRemoved ? "opacity-40" : ""}`}>
                <span className="text-black font-semibold line-clamp-1">{data?.name}</span>
                <div className="flex items-center justify-between mt-1">
                    <div className="flex items-center gap-0.5">
                        <span>Valor:</span>
                        <div className="text-blue-950 font-semibold">{toCurrency((data?.sellingPrice || data?.price) / 100)}</div>
                    </div>
                    <div className="flex items-center gap-0.5">
                        <span>SKU:</span>
                        <div className="text-blue-950 font-semibold">{data?.sellerSku}</div>
                    </div>
                    <div className="flex items-center gap-0.5">
                        <span>Ref:</span>
                        <div className="text-blue-950 font-semibold flex items-center gap-1">
                            {data?.refId}
                            <Tooltip title="Copiar">
                                <MuiIcon fontSize="small" click onClick={() => navigator.clipboard.writeText(data?.refId)} icon={["mui", "copy_all"]} className="text-gray-500 hover:text-blue-600" />
                            </Tooltip>
                        </div>
                    </div>
                    <div className={`flex items-center gap-0.5 ${isRemoved ? "opacity-0" : ""}`}>
                        <span>Tam:</span>
                        <div className="text-blue-950 font-semibold">-</div>
                    </div>
                    <div className={`flex items-center gap-0.5 ${isRemoved ? "opacity-0" : ""}`}>
                        <span>Qtd:</span>
                        <div className="text-blue-950 font-semibold">{data?.quantity || 0}</div>
                    </div>
                </div>
            </div>
            {isRemoved && (
                <div className="absolute right-0 top-2">
                    <Tag color="red">Removido</Tag>
                </div>
            )}
        </div>
    );
}
