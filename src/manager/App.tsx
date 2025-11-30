import { createRoot } from 'react-dom/client';
import { HashRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import SessionsList from './views/SessionsList';
import SessionDetail from './views/SessionDetail';
import Settings from './views/Settings';
import '../index.css';
import './manager.css';

function Navigation() {
  const navigate = useNavigate();
  const location = useLocation();

  const showBackButton = location.pathname !== '/';
  const showSettingsButton = location.pathname !== '/settings';

  return (
    <nav className="manager-nav">
      <div className="nav-left">
        {showBackButton && (
          <button className="nav-button" onClick={() => navigate(-1)}>
            ← Back
          </button>
        )}
        <h1 className="nav-title">SessionVault</h1>
      </div>
      {showSettingsButton && (
        <button
          className="nav-button"
          onClick={() => navigate('/settings')}
          aria-label="Settings"
        >
          ⚙️ Settings
        </button>
      )}
    </nav>
  );
}

function App() {
  return (
    <HashRouter>
      <div className="manager-app">
        <Navigation />
        <main className="manager-main">
          <Routes>
            <Route path="/" element={<SessionsList />} />
            <Route path="/session/:id" element={<SessionDetail />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </main>
      </div>
    </HashRouter>
  );
}

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}

