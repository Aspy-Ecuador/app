// Versión optimizada (WebP, ~110 KB) del logo oficial assets/logoReal.png (~1 MB)
import LightImage from "../assets/landing/logo-aspy.webp";

const ThemedLogo = () => {
  // Selecciona la imagen según el modo actual
  return (
    <img
      src={LightImage}
      alt="Fundación Aspy Ecuador"
      /* style={{ width: '100%', height: 'auto' }} */
    />
  );
};

export default ThemedLogo;
