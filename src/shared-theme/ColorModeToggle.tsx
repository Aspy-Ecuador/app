import * as React from 'react';
import DarkModeIcon from '@mui/icons-material/DarkModeRounded';
import LightModeIcon from '@mui/icons-material/LightModeRounded';
import IconButton from '@mui/material/IconButton';
import { useColorScheme } from '@mui/material/styles';

export default function ColorModeToggle(props: React.ComponentProps<typeof IconButton>) {
  const { mode, setMode } = useColorScheme();

  const toggleMode = () => {
    setMode(mode === 'light' ? 'dark' : 'light');
  };

  const icon = mode === 'light' ? <DarkModeIcon /> : <LightModeIcon />;

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