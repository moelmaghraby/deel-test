import React from "react";
import "./App.css";
import { AutoComplete } from "./components/AutoComplete";
import { searchMovies } from "./services/Search.service";

function App() {
  return (
    <div className="App">
      <AutoComplete
        placeholder="Search Movies"
        getOptions={(term) => {
          return searchMovies(term);
        }}
      ></AutoComplete>
    </div>
  );
}

export default App;
