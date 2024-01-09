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
import Mapa from "./components/Organizer/Ubicación";
import Inicio from "./components/inicio";
import NavBar from "./components/navbar";
import EditarPerfil from "./components/Asistente/editarPerfil"

import Payjs from "./paypalf";
import React from "react";
import EventosList from "./components/EventoList";
import EventoDetail from "./components/DetallesEven";
import CompraR from "./components/CompraP";
import BoletosList from "./components/pedido";

import TuComponente from "./components/pruebafetchstock";
import ComprasAsistente from "./components/historialAs";
import VerQR from "./components/MostrarQR";

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
        <Route path="/editarPerfil" element={<EditarPerfil />} />

        <Route
          path="/loginorg/"
          element={<LoginOrganizador></LoginOrganizador>}
        ></Route>

        <Route
          path="/organizador/"
          element={<Organizador></Organizador>}
        ></Route>

        <Route
          path="/mapa/"
          element={<Mapa></Mapa>}
        ></Route>

        <Route path="/payfinal/" element={<Payjs></Payjs>}></Route>
        <Route path="/meventos/" element={<EventosList></EventosList>}></Route>
        <Route path="/meventos/eventonum/:id" element={<EventoDetail></EventoDetail>}></Route>
        <Route path="/comprarEv/" element={<CompraR></CompraR>}></Route>
        <Route path="/verboletos/" element={<BoletosList></BoletosList>}></Route>

        <Route path="/stockboletos/" element={<TuComponente></TuComponente>}></Route>
        <Route path="/historialas/" element={<ComprasAsistente></ComprasAsistente>}></Route>
        <Route path="/observarqr/" element={<VerQR></VerQR>}></Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;
