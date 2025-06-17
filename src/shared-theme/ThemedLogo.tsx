// Define las imágenes para los modos light y dark
import LightImage from "../assets/logo mediano.png";

const ThemedLogo = () => {

  // Selecciona la imagen según el modo actual
  const imageSrc = LightImage;

  return (
    <img
      src={imageSrc}
      alt="Themed"
      /* style={{ width: '100%', height: 'auto' }} */
    />
  );
};

export default ThemedLogo;
