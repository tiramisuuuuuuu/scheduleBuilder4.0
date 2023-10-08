import React, {useState, useEffect} from 'react';
import ReactDOM from 'react-dom';
import "./SearchBar.css";
import { FaSearch } from "react-icons/fa";
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';



const onClickHandler = e => {
  console.log(e.currentTarget.getAttribute('data-bttnid'));
  console.log(e.currentTarget.getAttribute('data-bttnlabel'));
  console.log(e.currentTarget.getAttribute('data-bttnval'));
  (async () => {
    console.log("begin");
    
    const response = await fetch("http://localhost:3001/add-to-calendar", {
      method: "POST",
      headers: {
        'Content-type': "application/json"
      },
      body: JSON.stringify({ label: e.currentTarget.getAttribute('data-bttnlabel'), value: e.currentTarget.getAttribute('data-bttnval') })
      });
    })();
  
}


function makeResultsTable(data) {

  console.log("making results table")

  let results = JSON.parse(data); //array of objects
  console.log(results);
  let list = []
  for (var i = 0; i < results.length; i++){
    list.push({id: i, label: results[i].label, value: results[i].value});
    console.log(results[i].value);
  }
  const root = ReactDOM.createRoot(
    document.getElementById('resultsTable')
    );
  const element = <ul>
  {list.map(item => (
    <li key={item.id} class="search-items">
      <div className="result-label">{item.label}</div>
      <div className="result-value">{item.value}</div>
      <div>
        <Popup trigger= {<button className="result-bttn" data-bttnid={item.id} data-bttnlabel={item.label} data-bttnval={item.value} onClick={onClickHandler}>+</button>}>
          <div>Added to google calendar!!</div>
        </Popup>
      </div>
      
    </li>
    ))}
  </ul>;
  root.render(element);
}




const onKeyPressHandler = e => {
  if (e.key === 'Enter') {
    console.log(JSON.stringify(e.target.value));
    (async () => {
      console.log("begin");
      const response = await fetch("http://localhost:3001/search", {
        method: "POST",
        headers: {
          'Content-type': "application/json"
        },
        body: JSON.stringify({ searchTerm: e.target.value })
        })
      .then((response) => response.json())
      .then((json) => makeResultsTable(json));
    })();
  }
}


export const SearchBar = ({setResults}) => {
    const [input, setInput] = useState("")
  return (
    <div className="input-wrapper">
        <FaSearch id="search-icon" />
        <input placeholder="Type course code..." value={input} onChange={(e)=>setInput(e.target.value)} onKeyPress={onKeyPressHandler}/>
    </div>
  );
}
