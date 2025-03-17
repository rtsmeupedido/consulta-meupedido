import { useState } from "react";
import { Button, Input, MuiIcon } from "rtk-ux";

type Props = {
    onChange: (t: string) => void;
    onCancel?: () => void;
    placeholder: string;
    loading: boolean;
    userBrands?: any;
};

export default function HeaderSearch({ onChange, onCancel, loading, placeholder, userBrands }: Props) {
    const [text, setText] = useState("");
    return (
        <div className="flex items-center gap-1">
            <Input className="w-80 h-8" placeholder={placeholder} onPressEnter={() => onChange(text.trim())} value={text} onChange={(e: any) => setText(e.target.value)} />
            <Button
                onClick={() => {
                    onChange(text.trim());
                }}
                loading={loading}
                disabled={!text.length}
            >
                <MuiIcon icon={["mui", "search"]} color="black" />
            </Button>
            {onCancel && loading && <Button onClick={() => onCancel && onCancel()}>cancelar</Button>}
            <div className="flex items-center gap-2 ml-auto">
                Buscando resultado para: <strong>{userBrands?.length > 0 ? userBrands?.map((b: any, i: number) => `${i > 0 ? ", " : ""}${b?.name}`) : "Todas as marcas"}.</strong>
            </div>
        </div>
    );
}
