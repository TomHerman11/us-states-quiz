import React, { useState } from 'react';
import UsMap from './UsMap';
import './App.css';

function App() {
  return (
    <div className="App">
      <UsMap />

      <a
        href="https://github.com/TomHerman11/us-states-quiz"
        rel="noreferrer"
        target="_blank"
        className="Unselectable"
      >
        https://github.com/TomHerman11/us-states-quiz
      </a>
    </div>
  );
}

export default App;
