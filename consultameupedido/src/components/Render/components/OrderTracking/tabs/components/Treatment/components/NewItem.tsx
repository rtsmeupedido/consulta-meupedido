import { Input, InputNumber, Cascader, Select, Row, Col, Button } from "antd";
import { optionsSAC } from "../util";
import { Controller, useForm } from "react-hook-form";
import { useState } from "react";
import { formatJsonField } from "../../../../../../utils";

type Props = {
    onSave: (data: any) => void;
    onCancel: () => void;
    values: any;
    readOnly?: boolean;
    options?: any[];
    optionsFlat?: any[];
};

export default function NewItem({ onSave, onCancel, values, readOnly, options, optionsFlat }: Props) {
    const [loadingSend, setLoadingSend] = useState(false);
    const {
        control,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm<any>({
        defaultValues: values,
    });
    const incidente = watch("incidente");
    const incidenteId = watch("incidente_id");

    const incidenteModel = optionsFlat?.find((e) => e._id === incidenteId);

    const tratativa = watch("sac");

    const onSubmit = async (data: any) => {
        try {
            setLoadingSend(true);
            await onSave(data);
            setLoadingSend(false);
        } catch (error) {
            setLoadingSend(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="h-[70vh]">
            <div className="w-full h-full flex flex-col justify-between flex-1">
                <div className="flex flex-col gap-3 overflow-auto px-6">
                    <div className="flex flex-col flex-1 gap-1">
                        <span className="text-xs">Incidente</span>
                        <Controller
                            name="incidente"
                            control={control}
                            render={({ field }) => (
                                <Cascader
                                    disabled={readOnly}
                                    showSearch
                                    displayRender={(e) => <div className="text-xs">{e.join(" - ")}</div>}
                                    className="w-full"
                                    value={field?.value}
                                    onChange={(vl) => {
                                        setValue(field.name, vl);
                                        setValue(`${field.name}_id`, vl.at(-1));
                                    }}
                                    placement="bottomLeft"
                                    options={options}
                                    placeholder="Incidente"
                                    dropdownStyle={{ fontSize: 12 }}
                                />
                            )}
                        />
                    </div>
                    {incidente && (
                        <>
                            <div className="flex flex-col flex-1 gap-1">
                                <span className="text-xs">Número do ticket</span>
                                <Controller
                                    rules={{ required: true }}
                                    name="numero_ticket"
                                    control={control}
                                    render={({ field }) => (
                                        <Input
                                            status={errors?.numero_ticket ? "error" : undefined}
                                            readOnly={readOnly}
                                            type="number"
                                            addonBefore="#"
                                            className="text-xs h-8"
                                            value={field.value}
                                            onChange={(e) => setValue(field.name, e.target.value)}
                                        />
                                    )}
                                />
                                {errors?.numero_ticket && <span className="text-red-500 text-xs">Campo obrigatório</span>}
                            </div>
                            {incidenteModel?.extra_fields
                                ?.filter((e: any) => e?.title)
                                .map((ex: any) => (
                                    <div key={ex?._id} className="flex flex-col flex-1 gap-1">
                                        <span className="text-xs">{ex?.title}</span>
                                        <Controller
                                            name={formatJsonField(ex?.title)}
                                            control={control}
                                            render={({ field }) => <Input readOnly={readOnly} className="text-xs h-8" value={field.value} onChange={(e) => setValue(field.name, e.target.value)} />}
                                        />
                                    </div>
                                ))}
                            <div className="flex flex-col flex-1 gap-1">
                                <span className="text-xs">Tratativa SAC</span>
                                <Controller
                                    name="sac"
                                    control={control}
                                    render={({ field }) => (
                                        <Select
                                            labelRender={(e) => <div className="text-xs">{e?.label}</div>}
                                            options={optionsSAC}
                                            disabled={readOnly}
                                            value={field.value}
                                            onChange={(vl) => setValue(field.name, vl)}
                                            className="w-full"
                                            optionRender={(op) => <div className="text-xs mt-0.5">{op?.label}</div>}
                                        />
                                    )}
                                />
                            </div>
                            {tratativa && (
                                <Row gutter={[8, 8]}>
                                    {optionsSAC
                                        ?.find((e) => e.value === tratativa)
                                        ?.fields?.map((item) => {
                                            const isError = errors?.[item.value];
                                            return (
                                                <Col key={item?.value} span={item?.type === "textarea" ? 24 : 12}>
                                                    <div className="flex flex-col flex-1 gap-1">
                                                        <span className="text-xs">{item?.label}</span>
                                                        <Controller
                                                            rules={{ required: item?.required }}
                                                            name={item.value}
                                                            control={control}
                                                            render={({ field }) =>
                                                                item?.type === "textarea" ? (
                                                                    <Input.TextArea
                                                                        status={isError ? "error" : undefined}
                                                                        className="text-xs"
                                                                        readOnly={readOnly}
                                                                        value={field.value}
                                                                        rows={5}
                                                                        onChange={(e) => setValue(field.name, e.target.value)}
                                                                    />
                                                                ) : item?.type === "number" ? (
                                                                    <InputNumber
                                                                        status={isError ? "error" : undefined}
                                                                        readOnly={readOnly}
                                                                        className="w-full text-xs h-8 flex items-center"
                                                                        value={field.value}
                                                                        onChange={(num) => setValue(field.name, num)}
                                                                    />
                                                                ) : (
                                                                    <Input status={isError ? "error" : undefined} readOnly={readOnly} className="text-xs h-8" value={field.value} onChange={(e) => setValue(field.name, e.target.value)} />
                                                                )
                                                            }
                                                        />
                                                        {isError && <span className="text-red-500 text-xs">Campo obrigatório</span>}
                                                    </div>
                                                </Col>
                                            );
                                        })}
                                </Row>
                            )}
                        </>
                    )}
                </div>
                <div className="flex items-center justify-end gap-2 px-4 py-4">
                    <Button onClick={() => onCancel()}>cancelar</Button>
                    {!readOnly && (
                        <Button disabled={!incidente} loading={loadingSend} type="primary" htmlType="submit">
                            Salvar
                        </Button>
                    )}
                </div>
            </div>
        </form>
    );
}

// ) : item?.type === "date" ? (
//     <DatePicker
//         readOnly={readOnly}
//         placeholder="Selecione a data"
//         format={"DD/MM/YYYY"}
//         className="w-full text-xs h-8 flex items-center"
//         value={field.value ? dayjs(field.value) : undefined}
//         onChange={(d) => setValue(field.name, d.format())}
//     />
