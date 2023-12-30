import { Routes, Route, BrowserRouter } from "react-router-dom";
import ShowOrganizers from "./components/ShowOrganizers";
import LoginAdm from "./components/LoginAdm";

import Dashboard from "./components/DashboardAdm";
import LoginAs from "./components/LoginAs";
import Asistente from "./components/asistente";
import AsistenteRegistro from "./components/registroAsistente";

import LoginOrganizador from "./components/LoginOrganizador";
import Organizador from "./components/organizador";
import DLocalComponent from "./components/pagoprueba";
import Paypal from "./components/pagoprueba";

function App() {

  const [checkout, setCheckOut] = useState(false);

  return (
    <BrowserRouter>
        <div className="App">
      {checkout ? (
        <Paypal />
      ) : (
        <button
          onClick={() => {
            setCheckOut(true);
          }}
        >
          Checkout
        </button>
      )}
    </div>

      <Routes>
        <Route path="/" element={<ShowOrganizers></ShowOrganizers>}></Route>
        <Route path="/loginadm/" element={<LoginAdm></LoginAdm>}></Route>
        <Route path="/dashboardadm/" element={<Dashboard></Dashboard>}></Route>

        <Route path="/loginas/" element={<LoginAs></LoginAs>}></Route>
        <Route path="/asistente/" element={<Asistente></Asistente>}></Route>
        <Route path="/registroAsistente/" element={<AsistenteRegistro></AsistenteRegistro>}></Route>

        <Route path="/loginorg/" element={<LoginOrganizador></LoginOrganizador>}></Route>
        <Route path="/organizador/" element={<Organizador></Organizador>}></Route>
        <Route path="/pagopru/" element={<DLocalComponent></DLocalComponent>}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;