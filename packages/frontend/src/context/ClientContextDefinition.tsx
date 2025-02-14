import { createContext } from 'react';
import { ClientContextType } from '@/interfaces/clientrol.interface';;

export const ClientContext = createContext<ClientContextType>({} as ClientContextType);