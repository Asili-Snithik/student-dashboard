import React, { useState } from "react";
import Login from "./Login";
import Dashboard from "./Dashboard";
import "./App.css";

function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  return (
    <div className="App">
      {!loggedIn ? <Login onLogin={() => setLoggedIn(true)} /> : <Dashboard />}
    </div>
  );
}

export default App;
