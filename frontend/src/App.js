import { Routes, Route, BrowserRouter } from "react-router-dom";
import ShowOrganizers from "./components/Admin/ShowOrganizers";
import CrudEvents from "./components/Organizer/CrudEvents";

import LoginAdm from "./components/LoginAdm";
import Dashboard from "./components/DashboardAdm";

import LoginAs from "./components/LoginAs";
import Asistente from "./components/asistente";
import AsistenteRegistro from "./components/registroAsistente";

import LoginOrganizador from "./components/LoginOrganizador";
import Organizador from "./components/organizador";

import Inicio from "./components/inicio";
import NavBar from "./components/navbar";

function App() {
  return (
    <BrowserRouter>
    {/*<NavBar /> */}
      <Routes>
        {/* <Route path="/" element={<CrudEvents></CrudEvents>}></Route>*/}
        <Route path="/" element={<Inicio></Inicio>}></Route>

        <Route
          path="/panelAdmin/"
          element={<ShowOrganizers></ShowOrganizers>}
        ></Route>

        <Route path="/loginadm/" element={<LoginAdm></LoginAdm>}></Route>
        <Route path="/dashboardadm/" element={<Dashboard></Dashboard>}></Route>

        <Route path="/loginas/" element={<LoginAs></LoginAs>}></Route>
        <Route path="/asistente/" element={<Asistente></Asistente>}></Route>
        <Route
          path="/registroAsistente/"
          element={<AsistenteRegistro></AsistenteRegistro>}
        ></Route>

        <Route
          path="/loginorg/"
          element={<LoginOrganizador></LoginOrganizador>}
        ></Route>
        <Route
          path="/organizador/"
          element={<Organizador></Organizador>}
        ></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
