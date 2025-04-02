import { Route, Routes, BrowserRouter } from "react-router-dom";
import Notes from "./Pages/Notes";
import LoginRegister from "./Pages/LoginRegister";
import "./App.css";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Notes />} />
          <Route path="/login" element={<LoginRegister />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
