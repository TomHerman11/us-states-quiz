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
      <UsMap quizOrder={quizOrder} />
      <a href="https://github.com/TomHerman11/us-states-quiz" target="_blank">
        https://github.com/TomHerman11/us-states-quiz
      </a>
    </div>
  );
}

export default App;
