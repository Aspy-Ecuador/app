import * as React from 'react';
import type { ThemeOptions } from '@mui/material/styles';
interface AppThemeProps {
    children: React.ReactNode;
    /**
     * This is for the docs site. You can ignore it or remove it.
     */
    disableCustomTheme?: boolean;
    themeComponents?: ThemeOptions['components'];
}
export default function AppTheme(props: AppThemeProps): import("react/jsx-runtime").JSX.Element;
export {};
