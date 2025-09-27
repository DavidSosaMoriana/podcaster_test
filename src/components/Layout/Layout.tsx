import React, { ReactNode } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import './Layout.css';

interface LayoutProps {
  children: ReactNode;
}

/**
 * Componente Layout principal de la aplicación
 * Proporciona la estructura básica con header y contenido
 */
const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="layout">
      <Header />
      <main className="layout__main">
        <div className="layout__container">{children}</div>
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
