import LightImage from "../assets/logo mediano.png";

const ThemedLogo = () => {

  // Selecciona la imagen según el modo actual
  return (
    <img
      src={LightImage}
      alt="Themed"
      /* style={{ width: '100%', height: 'auto' }} */
    />
  );
};

export default ThemedLogo;
