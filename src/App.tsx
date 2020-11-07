import React from 'react';
import _ from 'lodash';
import UsMap from './UsMap';
import './App.css';
import allStatesJson from "./data/allStates.json";

function App() {
  const quizOrder: ({ stateName: string, showName: boolean, hintUsed: boolean })[] = [];

  // start with states' names hidden:
  _.forEach(_.shuffle(Object.keys(allStatesJson)), stateName => {
    quizOrder.push({
      stateName,
      showName: false,
      hintUsed: false
    });
  });

  return (
    <div className="App">
      <header>
        <h1>US States Quiz</h1>
        <h2>How quickly can you identify the US states on the map?</h2>
      </header>
      <UsMap quizOrder={quizOrder} />
    </div>
  );
}

export default App;
