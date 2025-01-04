import { ReactNode } from "react";
import NavbarAdmin from "@/components/NavbarAdmin";
import "./index.css";

interface LayoutProps {
  children: ReactNode;
}

const AdminLayout = ({ children }: LayoutProps) => {

  return (
    <>
      <header>
        <NavbarAdmin />
      </header>
      <main className="main-container">
        {children}
      </main>
    </>
  );
};

export default AdminLayout;