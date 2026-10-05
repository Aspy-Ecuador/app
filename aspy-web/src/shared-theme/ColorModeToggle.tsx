import * as React from 'react';
import DarkModeIcon from '@mui/icons-material/DarkModeRounded';
import LightModeIcon from '@mui/icons-material/LightModeRounded';
import IconButton from '@mui/material/IconButton';
import { useColorScheme } from '@mui/material/styles';

export default function ColorModeToggle(props: React.ComponentProps<typeof IconButton>) {
  const { mode, systemMode, setMode } = useColorScheme();
  // Con modo "system" hay que mirar el modo real del SO; si no, el primer clic no hace nada
  const resolvedMode = (mode === 'system' ? systemMode : mode) ?? 'light';

  const toggleMode = () => {
    setMode(resolvedMode === 'light' ? 'dark' : 'light');
  };

  const icon = resolvedMode === 'light' ? <DarkModeIcon /> : <LightModeIcon />;

  return (
    <IconButton
      sx={{
        width: '2.2rem',
          height: '2.2rem'
        }} 
      onClick={toggleMode}
      aria-label="Toggle light/dark mode"
      {...props}
    >
      {icon}
    </IconButton>
  );
}
