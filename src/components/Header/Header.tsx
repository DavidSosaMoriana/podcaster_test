import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import LoadingSpinner from '@/components/LoadingSpinner';
import { ThemeToggle } from '@/components/ThemeToggle/ThemeToggle';
import { useAppContext } from '@/context/AppContext';
import './Header.css';

/**
 * Componente Header de la aplicación
 * Incluye el título como enlace a home y indicador de carga
 * Al hacer click en el título limpia el filtro y navega a home
 */
const Header: React.FC = () => {
  const { state, dispatch } = useAppContext();
  const navigate = useNavigate();

  const handleHomeClick = (e: React.MouseEvent) => {
    e.preventDefault();

    // Si hay un filtro activo, limpiarlo
    if (state.filter) {
      dispatch({ type: 'SET_FILTER', payload: '' });
    }
    navigate('/');
  };

  return (
    <header className="header">
      <div className="header__container">
        <a
          href="/"
          className="header__title"
          onClick={handleHomeClick}
          role="button"
          aria-label="Go to home and clear filters"
        >
          Podcaster
        </a>

        <div className="header__actions">
          <ThemeToggle />
          {state.loading && (
            <div className="header__loading">
              <LoadingSpinner size="small" />
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
