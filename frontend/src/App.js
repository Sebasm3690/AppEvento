import { Routes, Route, BrowserRouter } from "react-router-dom";
import ShowOrganizers from "./components/ShowOrganizers";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ShowOrganizers></ShowOrganizers>}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
