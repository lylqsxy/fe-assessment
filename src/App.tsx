import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import ContentGallery from './pages/ContentGallery';

function App() {
  return (
    <BrowserRouter>
      <ContentGallery />
    </BrowserRouter>
  );
}

export default App;
