import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, HashRouter } from 'react-router-dom';
import { IS_DEMO } from './api';
import App from './App';
import { LanguageProvider } from './i18n/LanguageContext';
import { CartProvider } from './context/CartContext';
import './styles/main.css';
import './styles/palettes.css';
import { applyPalette, startPalette } from './palettes';

// site colors (change DEFAULT_PALETTE in palettes.js)
applyPalette(startPalette());

// the online preview (GitHub Pages) needs HashRouter: links look like /#/checkout
const Router = IS_DEMO ? HashRouter : BrowserRouter;

ReactDOM.createRoot(document.getElementById('root')).render(
  <Router>
    <LanguageProvider>
      <CartProvider>
        <App />
      </CartProvider>
    </LanguageProvider>
  </Router>
);
