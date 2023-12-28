import { Routes, Route, BrowserRouter } from "react-router-dom";
import ShowOrganizers from "./components/ShowOrganizers";
import LoginAdm from "./components/LoginAdm";
import LoginAs from "./components/LoginAs";
import Asistente from "./components/asistente";
import AsistenteRegistro from "./components/registroAsistente";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ShowOrganizers></ShowOrganizers>}></Route>
        <Route path="/loginadm/" element={<LoginAdm></LoginAdm>}></Route>
        <Route path="/loginas/" element={<LoginAs></LoginAs>}></Route>
        <Route path="/asistente/" element={<Asistente></Asistente>}></Route>
        <Route path="/registroAsistente/" element={<AsistenteRegistro></AsistenteRegistro>}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
