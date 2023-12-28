import { Routes, Route, BrowserRouter } from "react-router-dom";
import ShowOrganizers from "./components/ShowOrganizers";
import LoginAdm from "./components/LoginAdm";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ShowOrganizers></ShowOrganizers>}></Route>
        <Route path="/loginadm/" element={<LoginAdm></LoginAdm>}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
