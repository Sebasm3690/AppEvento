import CrudOrganizers from "./Admin/ShowOrganizers";

// Dashboard.js
import React, { useEffect, useState } from "react";
import ShowOrganizers from "./Admin/ShowOrganizers";
import NavBarAdmin from "./Admin/navbarAdmin";
import { Link } from "react-router-dom";
import Footer from "./footer";

const Dashboard = () => {
  const [adminData, setAdminData] = useState(null);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/userv/", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (response.status === 200) {
        const data = await response.json();
        setAdminData(data);
      } else {
        throw new Error("Error al obtener datos del administrador");
      }
    } catch (error) {
      console.error("Error:", error);
      window.location.href = "/loginadm/";
    }
  };

  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/logout/", {
        method: "POST",
        credentials: "include",
      });

      if (response.status === 200) {
        localStorage.removeItem("jwt");
        window.location.href = "/loginadm/";
      } else {
        throw new Error("Error al cerrar sesión");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div>
      <NavBarAdmin />  

      <div className="container mt-5">
        {adminData ? (
          <ShowOrganizers adminObj={adminData}> </ShowOrganizers>
        ) : (
          <p>Cargando datos del administrador...</p>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Dashboard;
