import { ReactNode } from 'react';
import './index.css';

interface ContainerProps {
  children: ReactNode;
}

const Container = ({ children }: ContainerProps) => {
  return <section className="main-container--admin">{children}</section>;
}

export default Container;
