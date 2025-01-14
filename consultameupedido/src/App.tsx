import { useEffect, useState } from "react";
import Render from "./components/Render";
import { ZafProvider } from "./components/Render/hooks/useZaf";
import { createGlobalStyle } from "styled-components";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
type ZafWindowClient = typeof window.ZAFClient;
type ZafClient = ReturnType<ZafWindowClient["init"]>;

function App() {
  const [zafClient, setZafClient] = useState<ZafClient | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      const zaf = window.ZAFClient.init();
      setZafClient(zaf);
    }
    return () => {};
  }, []);

  return (
    <ZafProvider zafClient={zafClient}>
      <Render />
      <GlobalStyles />
    </ZafProvider>
  );
}

export default App;

const GlobalStyles = createGlobalStyle`
  .ant-select.ant-select-disabled .ant-select-selector {
    background: white !important;
    color: black !important;
  }
`;
