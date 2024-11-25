import { useState } from "react";
import { Button, Input, MuiIcon } from "rtk-ux";

type Props = {
    onChange: (t: string) => void;
    onCancel?: () => void;
    placeholder: string;
    loading: boolean;
};

export default function HeaderSearch({ onChange, onCancel, loading, placeholder }: Props) {
    const [text, setText] = useState("");
    return (
        <div className="flex items-center gap-1">
            <Input className="w-80 h-8" placeholder={placeholder} value={text} onChange={(e: any) => setText(e.target.value)} />
            <Button onClick={() => onChange(text)} loading={loading} disabled={!text.length}>
                <MuiIcon icon={["mui", "search"]} color="black" />
            </Button>
            {onCancel && loading && <Button onClick={() => onCancel && onCancel()}>cancelar</Button>}
        </div>
    );
}
