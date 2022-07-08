import { useCallback, useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import axios from "axios";

const instance = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

function App() {
  const [response, setResponse] = useState("");

  const doRequest = useCallback(async () => {
    const r = await instance.get("/");
    setResponse(r.data);
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <p>Hot reload!</p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <button onClick={() => doRequest()}>Request backend</button>
        <p>{response}</p>
      </header>
    </div>
  );
}

export default App;
