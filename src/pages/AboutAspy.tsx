import { useEffect, useState } from "react";

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
  console.log(usuarios);

  return <h1>Hola soy sobre</h1>;
}
