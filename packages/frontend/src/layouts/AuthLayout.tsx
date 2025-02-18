import { ReactNode } from "react";
import "./index.css";

interface LayoutProps {
  children: ReactNode;
}

const AuthLayout = ({ children }: LayoutProps) => {

  return (
    <>
      <main className="main-container--auth">
        {children}
      </main>
    </>
  );
};

export default AuthLayout;