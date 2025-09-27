import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from '@/context/AppContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { Layout } from '@/components';
import { HomeView, PodcastDetailView, EpisodeDetailView } from '@/views';
import '@/styles/globals.css';

/**
 * Componente principal de la aplicación
 * Configura el routing, contexto global y layout
 */
const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AppProvider>
        <Router>
          <Layout>
            <Routes>
              {/* Vista principal - Lista de podcasts */}
              <Route path="/" element={<HomeView />} />

              {/* Vista detalle de podcast */}
              <Route
                path="/podcast/:podcastId"
                element={<PodcastDetailView />}
              />

              {/* Vista detalle de episodio */}
              <Route
                path="/podcast/:podcastId/episode/:episodeId"
                element={<EpisodeDetailView />}
              />
            </Routes>
          </Layout>
        </Router>
      </AppProvider>
    </ThemeProvider>
  );
};

export default App;
