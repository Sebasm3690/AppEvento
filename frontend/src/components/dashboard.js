import React, { useEffect, useState } from "react";
import "./styles/dashboard.css";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Chart as ChartJS } from "chart.js/auto";
import { Bar, Chart, Doughnut, Line, Pie } from "react-chartjs-2";
import Footer from "./footer";
import NavBarOrg from "./Organizer/navbarOrg";

function DashboardGrafico() {
  const { id } = useParams();
  const [ordenesCompra, setOrdenesCompra] = useState([]);
  const [ganancia_total, setGananciaTotal] = useState(0);
  const [ganancia_porcentaje, setGananciaPorcentaje] = useState(0);
  const [boletos_vendidos, setBoletosVendidos] = useState(0);
  const [boletos_porcentaje, setBoletosPorcentaje] = useState(0);
  const [event, setEvent] = useState({});
  const [ganancia_posible, setGananciaPosible] = useState(0);
  const [perdida, setPerdida] = useState(0);
  const [monthNames, setMonthNames] = useState([]);
  const [total_anual, setTotal_anual] = useState(0);

  useEffect(() => {
    getOrdenCompra();
    sendMonths();
  }, [id]);

  useEffect(() => {
    if (ordenesCompra.length > 0) {
      sendMonths();
    }
  }, [ordenesCompra]); //Se ejecuta solo cuando cambie el id

  const getOrdenCompra = async () => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/ordenDashboard/${id}/`
      );
      console.log("La respuesta del servidor es:" + console.log(response.data)); // Verifica la estructura de la respuesta)
      setOrdenesCompra(response.data.ventas_mensuales);
      setTotal_anual(response.data.total_anual);
      setGananciaPorcentaje(response.data.porcentaje_total_anual);
      setBoletosVendidos(response.data.boletos_comprados);
      setBoletosPorcentaje(response.data.boletos_porcentaje);
      setPerdida(response.data.perdida);
    } catch (error) {
      if (!error.response) {
        console.error("Error: Newtork error");
      } else {
        console.error(
          `Error: API error- Status: ${error.response.status} - Message: ${error.response.statusText}`
        );
      }
    }
  };

  const [style, setStyle] = useState(
    "navbar-nav bg-gradient-primary sidebar sidebar-dark accordion"
  );

  // Estilos en línea para el componente Pending Requests Card
  const pendingRequestsCardStyle = {
    marginBottom: "20px", // Ajusta el margen inferior según sea necesario
  };

  const pieData = {
    labels: ["Ganancia", "Pérdida"],
    datasets: [
      {
        data: [total_anual, perdida],
      },
    ],
  };

  // Función para obtener el nombre del mes de una fecha
  function getMonthName(dateString) {
    const monthNames = [
      "Enero",
      "Febrero",
      "Marzo",
      "Abril",
      "Mayo",
      "Junio",
      "Julio",
      "Agosto",
      "Septiembre",
      "Octubre",
      "Noviembre",
      "Diciembre",
    ];
    return monthNames[dateString - 1];
  }

  function sendMonths() {
    const dates =
      ordenesCompra && ordenesCompra.map((ordenCompra) => ordenCompra.mes);
    const months_name = dates.map((date) => getMonthName(date));
    setMonthNames(months_name);
  }

  const line = {
    labels: monthNames,
    datasets: [
      {
        label: "Ganancia",
        data: ordenesCompra.map((ordenCompra) => ordenCompra.total_mes),
        fill: false,
        backgroundColor: "rgb(66, 139, 202)", // Un azul que combina con el encabezado
        borderColor: "rgba(66, 139, 202, 0.6)", // Más claro para la línea
        borderWidth: 3,
      },
    ],
  };

  // Estilos para el ícono de comentarios en Pending Requests Card
  const commentsIconStyle = {
    fontSize: "2rem",
    color: "#868e96", // Cambia el color según sea necesario
  };

  // Estilos para el componente Earnings Overview
  const earningsOverviewStyle = {
    marginBottom: "20px", // Ajusta el margen inferior según sea necesario
  };

  // ... (puedes seguir añadiendo estilos según sea necesario)

  const changeStyle = () => {
    if (
      style === "navbar-nav bg-gradient-primary sidebar sidebar-dark accordion"
    ) {
      setStyle(
        "navbar-nav bg-gradient-primary sidebar sidebar-dark accordion toggled"
      );
    } else {
      setStyle("navbar-nav bg-gradient-primary sidebar sidebar-dark accordion");
    }
  };
  const changeStyle1 = () => {
    if (
      style === "navbar-nav bg-gradient-primary sidebar sidebar-dark accordion"
    ) {
      setStyle(
        "navbar-nav bg-gradient-primary sidebar sidebar-dark accordion toggled1"
      );
    } else {
      setStyle("navbar-nav bg-gradient-primary sidebar sidebar-dark accordion");
    }
  };

  return (
    <div>
      <NavBarOrg />
      <body id="page-top">
        {/*  <!-- Page Wrapper --> */}
        <div id="wrapper">
          {/*  <!-- Sidebar --> */}

          {/*  <!-- Content Wrapper --> */}

          <div id="content-wrapper" className="d-flex flex-column">
            {/*  <!-- Main Content --> */}
            <div id="content">
              {/*  <!-- Topbar --> */}
              <nav className="navbar navbar-expand navbar-light bg-white topbar mb-4 static-top shadow">
                {/*  <!-- Sidebar Toggle (Topbar) --> */}
                <button
                  id="sidebarToggleTop"
                  className="btn btn-link d-md-none rounded-circle mr-3"
                  onClick={changeStyle1}
                >
                  <i className="fa fa-bars"></i>
                </button>

                {/*  <!-- Topbar Search --> */}

                {/*}
                <form className="d-none d-sm-inline-block form-inline mr-auto ml-md-3 my-2 my-md-0 mw-100 navbar-search">
                  <div className="input-group">
                    <input
                      type="text"
                      className="form-control bg-light border-0 small"
                      placeholder="Search for..."
                      aria-label="Search"
                      aria-describedby="basic-addon2"
                    />
                    <div className="input-group-append">
                      <button className="btn btn-primary" type="button">
                        <i className="fas fa-search fa-sm"></i>
                      </button>
                    </div>
                  </div>
                </form> */}

                {/*  <!-- Topbar Navbar --> */}
                <ul className="navbar-nav ml-auto">
                  {/*  <!-- Nav Item - Search Dropdown (Visible Only XS) --> */}
                </ul>
              </nav>
              {/*  <!-- End of Topbar --> */}

              {/* <!-- Begin Page Content --> */}
              <div className="container-fluid">
                {/*  <!-- Page Heading --> */}
                <div className="d-sm-flex align-items-center justify-content-between mb-4">
                  <h1 className="h3 mb-0 text-gray-800">Dashboard</h1>
                  <a
                    href="#"
                    className="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm"
                  >
                    <i className="fas fa-download fa-sm text-white-50"></i>{" "}
                    Generate Report
                  </a>
                </div>

                {/*  <!-- Content Row --> */}
                <div className="row">
                  {/*  <!-- Earnings (Monthly) Card Example --> */}
                  <div className="col-xl-3 col-md-6 mb-4">
                    <div className="card border-left-success shadow h-100 py-2">
                      <div className="card-body">
                        <div className="row no-gutters align-items-center">
                          <div className="col mr-2">
                            <div className="text-xs font-weight-bold text-success text-uppercase mb-1">
                              Ganancia (Evento)
                            </div>
                            <div className="h5 mb-0 font-weight-bold text-gray-800">
                              {total_anual}
                            </div>
                          </div>
                          <div className="col-auto">
                            <i className="fas fa-dollar-sign fa-2x text-gray-300"></i>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* <div
                    className="col-xl-3 col-md-6 mb-4"
                    style={pendingRequestsCardStyle}
                  >
                    <div className="card border-left-primary shadow h-100 py-2">
                      <div className="card-body">
                        <div className="row no-gutters align-items-center">
                          <div className="col mr-2">
                            <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">
                              Ganancia (Evento)
                            </div>
                            <div className="h5 mb-0 font-weight-bold text-gray-800">
                              {ganancia_total}
                            </div>
                          </div>
                          <div className="col-auto">
                            <i className="fas fa-calendar fa-2x text-gray-300"></i>
                          </div>
                        </div>
                      </div>
                    </div>
  </div> */}

                  {/*  <!-- Earnings (Monthly) Card Example --> */}
                  <div className="col-xl-3 col-md-6 mb-4">
                    <div className="card border-left-info shadow h-100 py-2">
                      <div className="card-body">
                        <div className="row no-gutters align-items-center">
                          <div className="col mr-2">
                            <div className="text-xs font-weight-bold text-info text-uppercase mb-1">
                              Ganancia %
                            </div>
                            <div className="row no-gutters align-items-center">
                              <div className="col-auto">
                                <div className="h5 mb-0 mr-3 font-weight-bold text-gray-800">
                                  {ganancia_porcentaje + "%"}
                                </div>
                              </div>
                              <div className="col">
                                <div className="progress progress-sm mr-2">
                                  <div
                                    className="progress-bar bg-info a1"
                                    role="progressbar"
                                    style={{ width: `${ganancia_porcentaje}%` }}
                                  ></div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="col-auto">
                            <i className="fas fa-clipboard-list fa-2x text-gray-300"></i>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/*  <!-- Earnings (Monthly) Card Example --> */}
                  <div className="col-xl-3 col-md-6 mb-4">
                    <div className="card border-left-success shadow h-100 py-2">
                      <div className="card-body">
                        <div className="row no-gutters align-items-center">
                          <div className="col mr-2">
                            <div className="text-xs font-weight-bold text-success text-uppercase mb-1">
                              Boletos Vendidos
                            </div>
                            <div className="h5 mb-0 font-weight-bold text-gray-800">
                              {boletos_vendidos}
                            </div>
                          </div>
                          <div className="col-auto">
                            <i className="fas fa-dollar-sign fa-2x text-gray-300"></i>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/*  <!-- Earnings (Monthly) Card Example --> */}
                  <div className="col-xl-3 col-md-6 mb-4">
                    <div className="card border-left-info shadow h-100 py-2">
                      <div className="card-body">
                        <div className="row no-gutters align-items-center">
                          <div className="col mr-2">
                            <div className="text-xs font-weight-bold text-info text-uppercase mb-1">
                              Boletos Vendidos %
                            </div>
                            <div className="row no-gutters align-items-center">
                              <div className="col-auto">
                                <div className="h5 mb-0 mr-3 font-weight-bold text-gray-800">
                                  {boletos_porcentaje + "%"}
                                </div>
                              </div>
                              <div className="col">
                                <div className="progress progress-sm mr-2">
                                  <div
                                    className="progress-bar bg-info a1"
                                    role="progressbar"
                                    style={{ width: `${boletos_porcentaje}%` }}
                                  ></div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="col-auto">
                            <i className="fas fa-clipboard-list fa-2x text-gray-300"></i>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/*  <!-- Content Row --> */}

                <div className="row">
                  {/*   <!-- Area Chart --> */}
                  <div
                    className="col-xl-8 col-lg-7"
                    style={earningsOverviewStyle}
                  >
                    <div className="card shadow mb-4">
                      {/*  <!-- Card Header - Dropdown --> */}
                      <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                        <h6 className="m-0 font-weight-bold text-primary">
                          Tendencia Ventas Mensuales
                        </h6>
                        <div className="dropdown no-arrow">
                          <a
                            className="dropdown-toggle"
                            href="#"
                            role="button"
                            id="dropdownMenuLink"
                            data-toggle="dropdown"
                            aria-haspopup="true"
                            aria-expanded="false"
                          >
                            <i className="fas fa-ellipsis-v fa-sm fa-fw text-gray-400"></i>
                          </a>

                          <div
                            className="dropdown-menu dropdown-menu-right shadow animated--fade-in"
                            aria-labelledby="dropdownMenuLink"
                          >
                            <div className="dropdown-header">
                              Dropdown Header:
                            </div>
                            <a className="dropdown-item" href="#">
                              Action
                            </a>
                            <a className="dropdown-item" href="#">
                              Another action
                            </a>
                            <div className="dropdown-divider"></div>
                            <a className="dropdown-item" href="#">
                              Something else here
                            </a>
                          </div>
                        </div>
                      </div>
                      {/*  <!-- Card Body --> */}
                      <div className="card-body">
                        <div className="chart-area">
                          {/* <Bar
                            data={{
                              labels: [event.nombre_evento],

                              //labels: ["A", "B", "C"],
                              datasets: [
                                {
                                  label: "Ganancia",
                                  data: [ganancia_total, ganancia_posible],
                                },
                                {
                                  label: "Perdida",
                                  data: [perdida],
                                },
                              ],
                            }}
                          /> */}
                          <Line data={line} />
                          <canvas id="myAreaChart"></canvas>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/*  <!-- Pie Chart --> */}
                  <div className="col-xl-4 col-lg-5">
                    <div className="card shadow mb-4">
                      {/*  <!-- Card Header - Dropdown --> */}
                      <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                        <h6 className="m-0 font-weight-bold text-primary">
                          Distribución de ganancias y perdidas
                        </h6>
                        <div className="dropdown no-arrow">
                          <a
                            className="dropdown-toggle"
                            href="#"
                            role="button"
                            id="dropdownMenuLink"
                            data-toggle="dropdown"
                            aria-haspopup="true"
                            aria-expanded="false"
                          >
                            <i className="fas fa-ellipsis-v fa-sm fa-fw text-gray-400"></i>
                          </a>
                          <div
                            className="dropdown-menu dropdown-menu-right shadow animated--fade-in"
                            aria-labelledby="dropdownMenuLink"
                          >
                            <div className="dropdown-header">
                              Dropdown Header:
                            </div>
                            <a className="dropdown-item" href="#">
                              Action
                            </a>
                            <a className="dropdown-item" href="#">
                              Another action
                            </a>
                            <div className="dropdown-divider"></div>
                            <a className="dropdown-item" href="#">
                              Something else here
                            </a>
                          </div>
                        </div>
                      </div>
                      {/*  <!-- Card Body --> */}
                      <div className="card-body">
                        <div className="chart-pie pt-4 pb-2">
                          <div className="App">
                            <div className="dataCard revenueCard">
                              <div className="dataCard customCard"></div>
                              <div className="dataCard pieCard">
                                <Pie data={pieData} />
                              </div>
                            </div>
                          </div>
                          <canvas id="myPieChart"></canvas>
                        </div>
                        {/*} <div className="mt-4 text-center small">
                          <span className="mr-2">
                            <i className="fas fa-circle text-primary"></i>{" "}
                            Direct
                          </span>
                          <span className="mr-2">
                            <i className="fas fa-circle text-success"></i>{" "}
                            Social
                          </span>
                          <span className="mr-2">
                            <i className="fas fa-circle text-info"></i> Referral
                          </span>
                        </div>*/}
                      </div>
                    </div>
                  </div>
                </div>

                {/*   <!-- Content Row --> */}
              </div>
              {/*   <!-- /.container-fluid --> */}
            </div>
            {/*   <!-- End of Main Content -->

                                        <!-- Footer --> */}
            <Footer />

            {/* <!-- End of Footer --> */}
          </div>
          {/*  <!-- End of Content Wrapper --> */}
        </div>
        {/*  <!-- End of Page Wrapper -->

                                <!-- Scroll to Top Button--> */}
        <a className="scroll-to-top rounded" href="#page-top">
          <i className="fas fa-angle-up"></i>
        </a>

        {/*  <!-- Logout Modal--> */}
        <div
          className="modal fade"
          id="logoutModal"
          tabindex="-1"
          role="dialog"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">
                  Ready to Leave?
                </h5>
                <button
                  className="close"
                  type="button"
                  data-dismiss="modal"
                  aria-label="Close"
                >
                  <span aria-hidden="true">×</span>
                </button>
              </div>
              <div className="modal-body">
                Select "Logout" below if you are ready to end your current
                session.
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  type="button"
                  data-dismiss="modal"
                >
                  Cancel
                </button>
                <a className="btn btn-primary" href="login.html">
                  Logout
                </a>
              </div>
            </div>
          </div>
        </div>
      </body>
    </div>
  );
}

export default DashboardGrafico;
