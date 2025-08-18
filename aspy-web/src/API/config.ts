export const getConfig = () => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error(
      "Token no encontrado. Debes iniciar sesión antes de hacer esta petición."
    );
  }
  return {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };
};
