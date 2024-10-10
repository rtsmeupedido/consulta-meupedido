import { useEffect, useState } from "react";
import Render from "./components/Render";
import { ZafProvider } from "./components/Render/hooks/useZaf";
type ZafWindowClient = typeof window.ZAFClient;
type ZafClient = ReturnType<ZafWindowClient["init"]>;

function App() {
    const [zafClient, setZafClient] = useState<ZafClient | null>(null);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const zaf = window.ZAFClient.init();
            setZafClient(zaf);
        }
        return () => {};
    }, []);

    return (
        <ZafProvider zafClient={zafClient}>
            <Render />
        </ZafProvider>
    );
}

export default App;
