interface ConfirmDialogProps {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    value: string;
}
export default function ConfirmDialog({ open, onClose, onConfirm, value, }: ConfirmDialogProps): import("react/jsx-runtime").JSX.Element;
export {};
