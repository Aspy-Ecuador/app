import LightImage from "../assets/logoReal.png";

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
