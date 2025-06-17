import { useColorScheme } from "@mui/material/styles";
// Define las imágenes para los modos light y dark
import LightImage from "../assets/logo mediano.png";
import DarkImage from "../assets/logo aspy negativo mediano.png";

const ThemedLogo = () => {
  const { mode } = useColorScheme();

  // Selecciona la imagen según el modo actual
  const imageSrc = mode === "light" ? LightImage : DarkImage;

  return (
    <img
      src={imageSrc}
      alt="Themed"
      /* style={{ width: '100%', height: 'auto' }} */
    />
  );
};

export default ThemedLogo;
