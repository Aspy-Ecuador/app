import { IconButtonProps } from "@mui/material/IconButton";
export interface MenuButtonProps extends IconButtonProps {
    showBadge?: boolean;
}
export default function MenuButton({ showBadge, ...props }: MenuButtonProps): import("react/jsx-runtime").JSX.Element;
