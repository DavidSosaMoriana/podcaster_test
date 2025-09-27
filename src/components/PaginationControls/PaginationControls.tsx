import React from 'react';
import { PaginationControlsProps } from '@/types';
import './PaginationControls.css';

/**
 * Componente de controles de paginación
 * Muestra botones para navegar entre páginas e información del estado actual
 */
const PaginationControls: React.FC<PaginationControlsProps> = ({
  currentPage,
  totalPages,
  hasNextPage,
  hasPreviousPage,
  onNextPage,
  onPreviousPage,
  onGoToPage,
  totalItems,
  itemsPerPage,
}) => {
  // Calcular el rango de elementos mostrados
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  if (totalPages <= 1) {
    return null;
  }

  // Generar números de página para mostrar (máximo 5 páginas visibles)
  const getPageNumbers = (): number[] => {
    const delta = 2;
    const pages: number[] = [];

    const startPage = Math.max(1, currentPage - delta);
    const endPage = Math.min(totalPages, currentPage + delta);

    if (startPage > 1) {
      pages.push(1);
      if (startPage > 2) {
        pages.push(-1);
      }
    }

    // Agregar páginas del rango
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    // Agregar última página si no está en el rango
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push(-1);
      }
      pages.push(totalPages);
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="pagination-controls">
      <div className="pagination-controls__info">
        <span className="pagination-controls__info-text">
          Showing {startItem}-{endItem} of {totalItems} podcasts
        </span>
      </div>

      <div className="pagination-controls__navigation">
        <button
          className="pagination-controls__button pagination-controls__button--prev"
          onClick={onPreviousPage}
          disabled={!hasPreviousPage}
          aria-label="Página anterior"
        >
          <span className="pagination-controls__button-icon">←</span>
          Previous
        </button>

        <div className="pagination-controls__pages">
          {pageNumbers.map((pageNum, index) => {
            if (pageNum === -1) {
              return (
                <span
                  key={`ellipsis-${index}`}
                  className="pagination-controls__ellipsis"
                >
                  ...
                </span>
              );
            }

            return (
              <button
                key={pageNum}
                className={`pagination-controls__page ${
                  pageNum === currentPage
                    ? 'pagination-controls__page--active'
                    : ''
                }`}
                onClick={() => onGoToPage(pageNum)}
                aria-label={`Ir a la página ${pageNum}`}
                aria-current={pageNum === currentPage ? 'page' : undefined}
              >
                {pageNum}
              </button>
            );
          })}
        </div>

        <button
          className="pagination-controls__button pagination-controls__button--next"
          onClick={onNextPage}
          disabled={!hasNextPage}
          aria-label="Página siguiente"
        >
          Next
          <span className="pagination-controls__button-icon">→</span>
        </button>
      </div>

      <div className="pagination-controls__summary">
        <span className="pagination-controls__summary-text">
          Page {currentPage} of {totalPages}
        </span>
      </div>
    </div>
  );
};

export default PaginationControls;
