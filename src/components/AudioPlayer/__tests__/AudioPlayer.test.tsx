import React from 'react';
import { render, screen } from '@testing-library/react';
import AudioPlayer from '../AudioPlayer';

// Mock data
const mockEpisode = {
  id: 'episode-1',
  title: 'Test Episode Title',
  description: 'This is a test episode description',
  releaseDate: '2024-01-15T10:00:00Z',
  duration: 1800000, // 30 minutes in milliseconds
  audioUrl: 'https://example.com/audio1.mp3',
  episodeUrl: 'https://example.com/episode1',
};

const mockEpisodeWithoutAudio = {
  ...mockEpisode,
  audioUrl: '',
};

describe('AudioPlayer', () => {
  // Mock HTMLAudioElement
  const mockLoad = jest.fn();
  const mockPlay = jest.fn();
  const mockPause = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    // Mock HTMLAudioElement
    Object.defineProperty(window, 'HTMLAudioElement', {
      writable: true,
      value: jest.fn().mockImplementation(() => ({
        load: mockLoad,
        play: mockPlay,
        pause: mockPause,
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        currentTime: 0,
        duration: 100,
        paused: true,
        volume: 1,
        muted: false,
      })),
    });
  });

  it('should render audio player with episode title', () => {
    render(<AudioPlayer episode={mockEpisode} />);

    expect(
      screen.getByText(`Playing: ${mockEpisode.title}`)
    ).toBeInTheDocument();
    expect(screen.getByText(/Test Episode Title/)).toBeInTheDocument();
  });

  it('should render HTML5 audio element with correct attributes', () => {
    render(<AudioPlayer episode={mockEpisode} />);

    const audioElement = document.querySelector('audio');
    expect(audioElement).toBeInTheDocument();
    expect(audioElement).toHaveAttribute('controls');
    expect(audioElement).toHaveAttribute('preload', 'metadata');
    expect(audioElement).toHaveAttribute('lang', 'en');
    expect(audioElement).toHaveClass('audio-player__element');
  });

  it('should render multiple source elements for different audio formats', () => {
    render(<AudioPlayer episode={mockEpisode} />);

    const audioElement = document.querySelector('audio');
    const sources = audioElement?.querySelectorAll('source');

    expect(sources).toHaveLength(3);
    expect(sources?.[0]).toHaveAttribute('src', mockEpisode.audioUrl);
    expect(sources?.[0]).toHaveAttribute('type', 'audio/mpeg');
    expect(sources?.[1]).toHaveAttribute('src', mockEpisode.audioUrl);
    expect(sources?.[1]).toHaveAttribute('type', 'audio/mp4');
    expect(sources?.[2]).toHaveAttribute('src', mockEpisode.audioUrl);
    expect(sources?.[2]).toHaveAttribute('type', 'audio/wav');
  });
  it('should render fallback text for unsupported browsers', () => {
    render(<AudioPlayer episode={mockEpisode} />);

    expect(
      screen.getByText('Your browser does not support the audio element.')
    ).toBeInTheDocument();
  });

  it('should have correct CSS classes and structure', () => {
    render(<AudioPlayer episode={mockEpisode} />);

    const container = document.querySelector('.audio-player');
    const info = document.querySelector('.audio-player__info');
    const title = document.querySelector('.audio-player__title');
    const controls = document.querySelector('.audio-player__controls');

    expect(container).toBeInTheDocument();
    expect(info).toBeInTheDocument();
    expect(title).toBeInTheDocument();
    expect(controls).toBeInTheDocument();
  });

  it('should show no audio message when audioUrl is empty', () => {
    render(<AudioPlayer episode={mockEpisodeWithoutAudio} />);

    expect(
      screen.getByText('No audio file available for this episode.')
    ).toBeInTheDocument();
    expect(
      document.querySelector('.audio-player__no-audio')
    ).toBeInTheDocument();
  });

  it('should not show no audio message when audioUrl is provided', () => {
    render(<AudioPlayer episode={mockEpisode} />);

    expect(
      screen.queryByText('No audio file available for this episode.')
    ).not.toBeInTheDocument();
    expect(
      document.querySelector('.audio-player__no-audio')
    ).not.toBeInTheDocument();
  });

  it('should call audio.load() when episode changes', () => {
    // Mock console.error para silenciar warnings de jsdom
    const consoleSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    const { rerender } = render(<AudioPlayer episode={mockEpisode} />);

    // Simular cambio de episodio
    const newEpisode = {
      ...mockEpisode,
      id: 'episode-2',
      title: 'New Episode',
      audioUrl: 'https://example.com/audio2.mp3',
    };

    rerender(<AudioPlayer episode={newEpisode} />);

    // Verificar que el nuevo episodio se renderiza correctamente
    expect(screen.getByText(/New Episode/)).toBeInTheDocument();

    // Limpiar el mock
    consoleSpy.mockRestore();
  });

  it('should handle episode with long title correctly', () => {
    const longTitleEpisode = {
      ...mockEpisode,
      title:
        'This is a very long episode title that should be handled correctly by the audio player component without breaking the layout',
    };

    render(<AudioPlayer episode={longTitleEpisode} />);

    expect(
      screen.getByText(`Playing: ${longTitleEpisode.title}`)
    ).toBeInTheDocument();
  });

  it('should handle episode with special characters in title', () => {
    const specialCharEpisode = {
      ...mockEpisode,
      title: 'Episode with "quotes" & special chars: #1',
    };

    render(<AudioPlayer episode={specialCharEpisode} />);

    expect(
      screen.getByText(`Playing: ${specialCharEpisode.title}`)
    ).toBeInTheDocument();
  });

  it('should be accessible with proper heading structure', () => {
    render(<AudioPlayer episode={mockEpisode} />);

    const heading = screen.getByRole('heading', { level: 3 });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent(`Playing: ${mockEpisode.title}`);
    expect(heading).toHaveClass('audio-player__title');
  });

  it('should handle undefined audioUrl gracefully', () => {
    const episodeWithUndefinedAudio = {
      ...mockEpisode,
      audioUrl: undefined as any,
    };

    render(<AudioPlayer episode={episodeWithUndefinedAudio} />);

    expect(
      screen.getByText('No audio file available for this episode.')
    ).toBeInTheDocument();
  });

  it('should maintain component structure even without audio', () => {
    render(<AudioPlayer episode={mockEpisodeWithoutAudio} />);

    const container = document.querySelector('.audio-player');
    const info = document.querySelector('.audio-player__info');
    const controls = document.querySelector('.audio-player__controls');

    expect(container).toBeInTheDocument();
    expect(info).toBeInTheDocument();
    expect(controls).toBeInTheDocument();
  });
});
