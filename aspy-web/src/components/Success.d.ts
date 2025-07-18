interface SuccessDialogProps {
    open: boolean;
    handleClose: () => void;
    isRegister: boolean;
    message: string;
}
export default function Success({ open, handleClose, isRegister, message, }: SuccessDialogProps): import("react/jsx-runtime").JSX.Element;
export {};
