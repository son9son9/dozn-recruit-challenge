import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./components/login/Login";
import Home from "./components/home/Home";
import List from "./components/list/list";
import Popup from "./components/popup/Popup";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/list" element={<List />} />
        <Route path="/popup" element={<Popup />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
