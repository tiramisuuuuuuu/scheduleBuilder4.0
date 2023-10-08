import React, {useState, useEffect} from 'react';
import ReactDOM from 'react-dom';
import "./SearchBar.css";
import { FaSearch } from "react-icons/fa";



export const Button = ({label, value}) => {

  const [text, setText] = useState("+")

  const onClickHandler = e => {
    console.log("begin");
    console.log(e.currentTarget.getAttribute('data-bttnid'));
    let id = e.currentTarget.getAttribute('data-bttnid')
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
    
    setText('Added');
  }

  return (
    <button className="result-bttn" data-bttnlabel={label} data-bttnval={value} onClick={onClickHandler}>{text}</button>
  );
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
    <li key={item.id} className="search-items">
      <div className="result-label">{item.label}</div>
      <div className="result-value">{item.value}</div>
      <Button label={item.label} value={item.value}/>
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


export const SearchBar = () => {
    const [input, setInput] = useState("")
  return (
    <div className="input-wrapper">
        <FaSearch id="search-icon" />
        <input placeholder="Type course code..." value={input} onChange={(e)=>setInput(e.target.value)} onKeyPress={onKeyPressHandler}/>
    </div>
  );
}
