import { Routes, Route, BrowserRouter } from "react-router-dom";
import ShowOrganizers from "./components/ShowOrganizers";
import LoginAdm from "./components/LoginAdm";
import Dashboard from "./components/DashboardAdm";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ShowOrganizers></ShowOrganizers>}></Route>
        <Route path="/loginadm/" element={<LoginAdm></LoginAdm>}></Route>
        <Route path="/dashboardadm/" element={<Dashboard></Dashboard>}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
