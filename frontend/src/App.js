import { Routes, Route, BrowserRouter } from "react-router-dom";
import ShowOrganizers from "./components/Admin/ShowOrganizers";
import CrudEvents from "./components/Organizer/CrudEvents";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CrudEvents></CrudEvents>}></Route>
        {/*<Route path="/" element={<ShowOrganizers></ShowOrganizers>}></Route>*/}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
