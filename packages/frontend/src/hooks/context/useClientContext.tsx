import { useContext } from "react";
import { ClientContextType } from "@/interfaces/clientrol.interface";
import { ClientContext } from "@/context/ClientContextDefinition";

export const useClientContext = (): ClientContextType => {
  const context = useContext(ClientContext);
  if (!context) {
    throw new Error("useProductContext must be used within a ProductProvider");
  }
  return context;
};