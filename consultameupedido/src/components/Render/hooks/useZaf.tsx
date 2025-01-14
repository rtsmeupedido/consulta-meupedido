import { createContext, useContext } from "react";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
type ZafWindowClient = typeof window.ZAFClient;
type ZafClient = ReturnType<ZafWindowClient["init"]>;

// Create React context for ZafClient
export const ZafContext = createContext<ZafClient | null>(null);

export const ZafProvider = ({
  children,
  zafClient,
}: {
  children: React.ReactNode;
  zafClient: ZafClient | null;
}) => {
  return (
    <ZafContext.Provider value={zafClient}>{children}</ZafContext.Provider>
  );
};

export const useZaf = () => {
  const zafClient = useContext(ZafContext);
  return {
    zafClient,
  };
};
