import React, { useEffect, useState } from "react";
import usuarioAPI from "@API/usuarioAPI";
import { getAllUsuarios } from "@API/usuarioAPI";

export default function AboutAspy() {
  const [usuarios, setUsuarios] = useState([]);

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const response = await getAllUsuarios();
        console.log(response); // Aquí haces el console.log si lo deseas
        setUsuarios(response.data); // Ajusta según tu API
      } catch (error) {
        console.error("Error al obtener usuarios:", error);
      }
    };

    fetchUsuarios();
  }, []);

  return console.log(usuarios);
}
