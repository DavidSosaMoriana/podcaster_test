import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AppProvider } from '@/context/AppContext';
import EpisodeDetailView from '../EpisodeDetailView';
import { usePodcastDetail } from '@/hooks';
import { podcastService } from '@/services';

// Mock data
const mockEpisode = {
  id: 'episode-1',
  title: 'Test Episode Title',
  description:
    '<p>This is a test episode description with <strong>HTML</strong>.</p>',
  releaseDate: '2024-01-15T10:00:00Z',
  duration: 1800000, // 30 minutes in milliseconds
  audioUrl: 'https://example.com/audio1.mp3',
  episodeUrl: 'https://example.com/episode1',
};

const mockPodcastDetail = {
  id: '1',
  name: 'Test Podcast',
  artist: 'Test Artist',
  image: 'https://example.com/image.jpg',
  summary: 'Test summary',
  description: 'Full description',
  episodes: [mockEpisode],
};

// Mock de los hooks
jest.mock('@/hooks', () => ({
  usePodcastDetail: jest.fn(),
}));

// Mock de los servicios
jest.mock('@/services', () => ({
  podcastService: {
    findEpisode: jest.fn(),
  },
}));

// Mock de los componentes hijos
jest.mock('@/components/PodcastSidebar', () => {
  return function MockPodcastSidebar({ podcast }: { podcast: any }) {
    return <div data-testid="podcast-sidebar">Sidebar: {podcast.name}</div>;
  };
});

jest.mock('@/components/AudioPlayer', () => {
  return function MockAudioPlayer({ episode }: { episode: any }) {
    return <div data-testid="audio-player">Playing: {episode.title}</div>;
  };
});

jest.mock('@/components/LoadingSpinner', () => {
  return function MockLoadingSpinner({ size }: { size?: string }) {
    return <div data-testid="loading-spinner">Loading... ({size})</div>;
  };
});

// Mock de react-router-dom
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({
    podcastId: 'test-podcast-id',
    episodeId: 'episode-1',
  }),
  useNavigate: () => mockNavigate,
}));

const renderComponent = () => {
  return render(
    <BrowserRouter>
      <AppProvider>
        <EpisodeDetailView />
      </AppProvider>
    </BrowserRouter>
  );
};

describe('EpisodeDetailView', () => {
  const mockUsePodcastDetail = usePodcastDetail as jest.MockedFunction<
    typeof usePodcastDetail
  >;
  const mockFindEpisode = podcastService.findEpisode as jest.MockedFunction<
    typeof podcastService.findEpisode
  >;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render loading state correctly', () => {
    mockUsePodcastDetail.mockReturnValue({
      podcast: null,
      loading: true,
      error: null,
    });

    renderComponent();

    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
    expect(screen.getByText('Loading episode...')).toBeInTheDocument();
    expect(screen.getByText('Loading... (large)')).toBeInTheDocument();
  });

  it('should render error state correctly', () => {
    const errorMessage = 'Failed to load episode';
    mockUsePodcastDetail.mockReturnValue({
      podcast: null,
      loading: false,
      error: errorMessage,
    });

    renderComponent();

    expect(
      screen.getByText('There was an error loading the episode')
    ).toBeInTheDocument();
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
    expect(screen.queryByTestId('podcast-sidebar')).not.toBeInTheDocument();
    expect(screen.queryByTestId('audio-player')).not.toBeInTheDocument();
  });

  it('should render not found state when podcast is null', () => {
    mockUsePodcastDetail.mockReturnValue({
      podcast: null,
      loading: false,
      error: null,
    });

    renderComponent();

    expect(screen.getByText('Episode not found')).toBeInTheDocument();
    expect(
      screen.getByText(
        'The episode you are looking for does not exist or could not be loaded.'
      )
    ).toBeInTheDocument();
  });

  it('should render not found state when episode is not found', () => {
    mockUsePodcastDetail.mockReturnValue({
      podcast: mockPodcastDetail,
      loading: false,
      error: null,
    });

    mockFindEpisode.mockReturnValue(null);

    renderComponent();

    expect(screen.getByText('Episode not found')).toBeInTheDocument();
    expect(
      screen.getByText(
        'The episode you are looking for does not exist or could not be loaded.'
      )
    ).toBeInTheDocument();
  });

  it('should render episode detail successfully with all components', () => {
    mockUsePodcastDetail.mockReturnValue({
      podcast: mockPodcastDetail,
      loading: false,
      error: null,
    });

    mockFindEpisode.mockReturnValue(mockEpisode);

    renderComponent();

    expect(screen.getByTestId('podcast-sidebar')).toBeInTheDocument();
    expect(screen.getByTestId('audio-player')).toBeInTheDocument();
    expect(
      screen.getByText(`Sidebar: ${mockPodcastDetail.name}`)
    ).toBeInTheDocument();
    expect(
      screen.getByText(`Playing: ${mockEpisode.title}`)
    ).toBeInTheDocument();
  });

  it('should render episode title and metadata correctly', () => {
    mockUsePodcastDetail.mockReturnValue({
      podcast: mockPodcastDetail,
      loading: false,
      error: null,
    });

    mockFindEpisode.mockReturnValue(mockEpisode);

    renderComponent();

    expect(screen.getByText(mockEpisode.title)).toBeInTheDocument();
    expect(screen.getByText('January 15, 2024')).toBeInTheDocument();
  });

  it('should render episode description with HTML content', () => {
    mockUsePodcastDetail.mockReturnValue({
      podcast: mockPodcastDetail,
      loading: false,
      error: null,
    });

    mockFindEpisode.mockReturnValue(mockEpisode);

    renderComponent();

    // El contenido HTML se renderiza usando dangerouslySetInnerHTML
    expect(
      screen.getByText(/This is a test episode description with/)
    ).toBeInTheDocument();
    expect(screen.getByText('HTML')).toBeInTheDocument();

    // Verificar que el container de descripción existe
    const descriptionContainer = document.querySelector(
      '.episode-detail-view__description'
    );
    expect(descriptionContainer).toBeInTheDocument();
  });

  it('should have correct CSS classes and structure', () => {
    mockUsePodcastDetail.mockReturnValue({
      podcast: mockPodcastDetail,
      loading: false,
      error: null,
    });

    mockFindEpisode.mockReturnValue(mockEpisode);

    renderComponent();

    const container = document.querySelector('.episode-detail-view');
    const layout = document.querySelector('.episode-detail-view__layout');
    const main = document.querySelector('.episode-detail-view__main');
    const content = document.querySelector('.episode-detail-view__content');
    const header = document.querySelector('.episode-detail-view__header');
    const meta = document.querySelector('.episode-detail-view__meta');
    const description = document.querySelector(
      '.episode-detail-view__description'
    );

    expect(container).toBeInTheDocument();
    expect(layout).toBeInTheDocument();
    expect(main).toBeInTheDocument();
    expect(content).toBeInTheDocument();
    expect(header).toBeInTheDocument();
    expect(meta).toBeInTheDocument();
    expect(description).toBeInTheDocument();
  });

  it('should call findEpisode with correct parameters', () => {
    mockUsePodcastDetail.mockReturnValue({
      podcast: mockPodcastDetail,
      loading: false,
      error: null,
    });

    mockFindEpisode.mockReturnValue(mockEpisode);

    renderComponent();

    expect(mockFindEpisode).toHaveBeenCalledWith(
      mockPodcastDetail,
      'episode-1'
    );
  });

  it('should use correct podcast and episode IDs from URL params', () => {
    mockUsePodcastDetail.mockReturnValue({
      podcast: mockPodcastDetail,
      loading: false,
      error: null,
    });

    mockFindEpisode.mockReturnValue(mockEpisode);

    renderComponent();

    expect(mockUsePodcastDetail).toHaveBeenCalledWith('test-podcast-id');
    expect(mockFindEpisode).toHaveBeenCalledWith(
      mockPodcastDetail,
      'episode-1'
    );
  });

  it('should render time element with correct datetime attribute', () => {
    mockUsePodcastDetail.mockReturnValue({
      podcast: mockPodcastDetail,
      loading: false,
      error: null,
    });

    mockFindEpisode.mockReturnValue(mockEpisode);

    renderComponent();

    const timeElement = screen.getByText('January 15, 2024');
    expect(timeElement.tagName).toBe('TIME');
    expect(timeElement).toHaveClass('episode-detail-view__date');
  });
});
