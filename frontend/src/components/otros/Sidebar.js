import React from 'react';

const Sidebar = ({ setShowModalInsert, setShowModalImpuestosIngresar, setShowModalRecuperar, navigate, handleOpen }) => {
  return (
    <div style={styles.sidebar}>
      <button style={styles.button} onClick={() => setShowModalInsert(true)}>NUEVO EVENTO</button>
      <button style={styles.button} onClick={() => setShowModalImpuestosIngresar(true)}>AGREGAR IMPUESTOS</button>
      <button style={styles.button} onClick={() => setShowModalRecuperar(true)}>HISTÓRICO</button>
      <button style={styles.button} onClick={() => navigate("/dashboardGeneral/")}>DASHBOARD GENERAL</button>
      <button style={styles.button} onClick={handleOpen}>ESCÁNER QR</button>
    </div>
  );
};

const styles = {
  sidebar: {
    backgroundColor: "#2980b9",
    width: "250px",
    height: "100vh",
    position: "fixed",
    zIndex: "1000",
    overflowX: "hidden",
    paddingTop: "20px",
    left: "0",
    top: "0"
  },
  button: {
    color: "#fff",
    padding: "10px 20px",
    textAlign: "left",
    textDecoration: "none",
    fontSize: "18px",
    display: "block",
    border: "none",
    backgroundColor: "transparent",
    width: "100%",
    textAlign: "center",
    marginBottom: "10px",
    cursor: "pointer"
  }
};

export default Sidebar;
