import React from 'react';
import { useNavigate } from 'react-router-dom';
import { usePodcasts, useLoadPodcasts, usePagination } from '@/hooks';
import PodcastCard from '@/components/PodcastCard';
import SearchFilter from '@/components/SearchFilter';
import LoadingSpinner from '@/components/LoadingSpinner';
import PaginationControls from '@/components/PaginationControls';
import './HomeView.css';

/**
 * Vista principal de la aplicación
 * Muestra la lista de podcasts con filtrado
 */
const HomeView: React.FC = () => {
  const navigate = useNavigate();
  const { filteredPodcasts, loading, error, filter, setFilter } = usePodcasts();

  // Configurar paginación con 30 elementos por página
  const pagination = usePagination(filteredPodcasts.length, 30);

  // Obtener podcasts para la página actual
  const paginatedPodcasts = pagination.getItemsForCurrentPage(filteredPodcasts);

  // Cargar podcasts al montar el componente
  useLoadPodcasts();

  const handlePodcastClick = (podcastId: string): void => {
    navigate(`/podcast/${podcastId}`);
  };

  if (loading && filteredPodcasts.length === 0) {
    return (
      <div className="home-view__loading">
        <LoadingSpinner size="large" />
        <p>Loading podcasts...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="home-view__error">
        <h2>Error al cargar podcasts</h2>
        <p>{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="home-view__retry-button"
        >
          Reintentar
        </button>
        <details className="home-view__error-details">
          <summary>Información técnica</summary>
          <p>Si el problema persiste, verifica:</p>
          <ul>
            <li>Tu conexión a internet</li>
            <li>Que no hay bloqueadores de contenido activos</li>
            <li>Revisa la consola del navegador para más detalles</li>
          </ul>
        </details>
      </div>
    );
  }

  return (
    <div className="home-view">
      <SearchFilter
        value={filter}
        onChange={setFilter}
        totalCount={filteredPodcasts.length}
      />

      {filteredPodcasts.length === 0 && filter ? (
        <div className="home-view__no-results">
          <h2>No podcasts were found</h2>
          <p>
            No podcasts matching your search "{filter}" were found. Try
            different terms.
          </p>
        </div>
      ) : (
        <>
          <div className="home-view__grid">
            {paginatedPodcasts.map(podcast => (
              <PodcastCard
                key={podcast.id}
                podcast={podcast}
                onClick={() => handlePodcastClick(podcast.id)}
              />
            ))}
          </div>

          {filteredPodcasts.length > 0 && (
            <PaginationControls
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              hasNextPage={pagination.hasNextPage}
              hasPreviousPage={pagination.hasPreviousPage}
              onNextPage={pagination.goToNextPage}
              onPreviousPage={pagination.goToPreviousPage}
              onGoToPage={pagination.goToPage}
              totalItems={filteredPodcasts.length}
              itemsPerPage={pagination.itemsPerPage}
            />
          )}
        </>
      )}
    </div>
  );
};

export default HomeView;
