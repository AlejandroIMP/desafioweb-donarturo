import { createContext, useContext, useState, ReactNode } from 'react';

interface AuthContextType {
  email: string | null;
  setEmail: (email: string) => void;
  clearEmail: () => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [email, setEmail] = useState<string | null>(null);

  const clearEmail = () => setEmail(null);

  return (
    <AuthContext.Provider value={{ email, setEmail, clearEmail }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);