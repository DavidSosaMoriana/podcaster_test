import React from 'react';
import { useParams } from 'react-router-dom';
import { usePodcastDetail } from '@/hooks';
import PodcastSidebar from '@/components/PodcastSidebar';
import AudioPlayer from '@/components/AudioPlayer';
import LoadingSpinner from '@/components/LoadingSpinner';
import { podcastService } from '@/services';
import './EpisodeDetailView.css';

/**
 * Vista de detalle de un episodio
 * Muestra sidebar del podcast, reproductor y descripción del episodio
 */
const EpisodeDetailView: React.FC = () => {
  const { podcastId, episodeId } = useParams<{
    podcastId: string;
    episodeId: string;
  }>();
  const { podcast, loading, error } = usePodcastDetail(podcastId!);

  const episode = podcast
    ? podcastService.findEpisode(podcast, episodeId!)
    : null;

  if (loading) {
    return (
      <div className="episode-detail-view__loading">
        <LoadingSpinner size="large" />
        <p>Loading episode...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="episode-detail-view__error">
        <h2>There was an error loading the episode</h2>
        <p>{error}</p>
      </div>
    );
  }

  if (!podcast || !episode) {
    return (
      <div className="episode-detail-view__not-found">
        <h2>Episode not found</h2>
        <p>
          The episode you are looking for does not exist or could not be loaded.
        </p>
      </div>
    );
  }

  return (
    <div className="episode-detail-view">
      <div className="episode-detail-view__layout">
        <PodcastSidebar podcast={podcast} />

        <main className="episode-detail-view__main">
          <AudioPlayer episode={episode} />

          <div className="episode-detail-view__content">
            <header className="episode-detail-view__header">
              <h1>{episode.title}</h1>
            </header>

            <div className="episode-detail-view__meta">
              <time className="episode-detail-view__date">
                {new Date(episode.releaseDate).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </time>
            </div>

            <div
              className="episode-detail-view__description"
              dangerouslySetInnerHTML={{ __html: episode.description }}
            />
          </div>
        </main>
      </div>
    </div>
  );
};

export default EpisodeDetailView;
