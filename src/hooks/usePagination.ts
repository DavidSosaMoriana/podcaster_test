import { useState, useMemo, useCallback } from 'react';
import { UsePaginationReturn } from '@/types';

/**
 * Hook personalizado para manejar paginación
 * @param totalItems Número total de elementos
 * @param itemsPerPage Elementos por página (default: 30)
 * @param initialPage Página inicial (default: 1)
 */
export const usePagination = (
  totalItems: number,
  itemsPerPage: number = 30,
  initialPage: number = 1
): UsePaginationReturn => {
  const [currentPage, setCurrentPage] = useState(initialPage);

  // Calcular el número total de páginas
  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(totalItems / itemsPerPage));
  }, [totalItems, itemsPerPage]);

  // Asegurar que la página actual sea válida
  const validCurrentPage = useMemo(() => {
    if (currentPage < 1) return 1;
    if (currentPage > totalPages) return totalPages;
    return currentPage;
  }, [currentPage, totalPages]);

  // Calcular si hay página siguiente/anterior
  const hasNextPage = validCurrentPage < totalPages;
  const hasPreviousPage = validCurrentPage > 1;

  // Funciones de navegación
  const goToPage = useCallback(
    (page: number) => {
      const newPage = Math.max(1, Math.min(page, totalPages));
      setCurrentPage(newPage);
    },
    [totalPages]
  );

  const goToNextPage = useCallback(() => {
    if (hasNextPage) {
      setCurrentPage(prev => prev + 1);
    }
  }, [hasNextPage]);

  const goToPreviousPage = useCallback(() => {
    if (hasPreviousPage) {
      setCurrentPage(prev => prev - 1);
    }
  }, [hasPreviousPage]);

  // Obtener elementos para la página actual
  const getItemsForCurrentPage = useCallback(
    <T>(items: T[]): T[] => {
      const startIndex = (validCurrentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      return items.slice(startIndex, endIndex);
    },
    [validCurrentPage, itemsPerPage]
  );

  // Reiniciar a la primera página cuando cambia el total de elementos
  useMemo(() => {
    if (totalItems === 0) {
      setCurrentPage(1);
    } else if (validCurrentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [totalItems, totalPages, validCurrentPage]);

  return {
    currentPage: validCurrentPage,
    totalPages,
    itemsPerPage,
    goToPage,
    goToNextPage,
    goToPreviousPage,
    hasNextPage,
    hasPreviousPage,
    getItemsForCurrentPage,
  };
};
