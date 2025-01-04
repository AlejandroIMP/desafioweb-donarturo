import { ReactNode } from "react";
import NavbarHome from "../NavbarHome";
import "./index.css";

interface LayoutProps {
  children: ReactNode;
}

const ClientLayout = ({ children }: LayoutProps) => {

  return (
    <>
      <header>
        <NavbarHome />
      </header>
      <main className="main-container">
        {children}
      </main>
    </>
  );
};

export default ClientLayout;