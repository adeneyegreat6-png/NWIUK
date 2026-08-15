import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import { CommunityProvider } from './context/CommunityContext';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <CommunityProvider>
      <App />
    </CommunityProvider>
  </StrictMode>
);
