import { ReactNode } from "react";
import NavbarLanding from "@/components/NavbarLanding";
import "./index.css";

interface LayoutProps {
  children: ReactNode;
}

const LandingLayout = ({ children }: LayoutProps) => {

  return (
    <>
      <header>
        <NavbarLanding />
      </header>
      <main className="main-container">
        {children}
      </main>
    </>
  );
};

export default LandingLayout;