import React from 'react';
import AppHeader from './components/AppHeader.jsx';
import { BrowserRouter } from 'react-router-dom';

export function App() {
  return <BrowserRouter>
    <AppHeader />
  </BrowserRouter>
}