import React from 'react'
import { SearchBar } from "./components/SearchBar";
import "./App.css";




function App() {
  return (
	<div>
		<div className="header">
			<img className="logo" src="../cow-builder-logo.png" alt="cow builder logo"></img>
			<h1 className="title">Welcome to ScheduleBuilder4.0</h1>
			<p className="summary">Enter the course code of a UC Davis course you wish to auto add to your Google Calendar below!! (please allow up to 1 min for the results to load :) )</p>
		</div>
		<div className="searchBarContainer">
			<SearchBar />
		</div>
		<div id='resultsTable' className="resultsTable"></div>
	</div>
  );
}

export default App;
