import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

//Podemos exportar todas estas funciones a los distintos componentes de acuerdo a la necesidad

//Esta función nos servirá para mostrar alertas de sweetalert
export function show_alerta(mensaje, icono, foco) {
  onfocus(foco);
  const MySwal = withReactContent(Swal);
  MySwal.fire({
    title: mensaje,
    icon: icono,
  });
}

//Esta función enciende el foco del input HTML, no es exportable

function onfocus(foco) {
  if (foco !== "") {
    document.getElementById(foco).focus();
  }
}
