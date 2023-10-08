import React from 'react'
import { SearchBar } from "./components/SearchBar";
import "./App.css";




function App() {
  return (
	<div>
		<div className="searchBarContainer">
			<SearchBar />
		</div>
		<div id='resultsTable'></div>
	</div>
  );
}

export default App;