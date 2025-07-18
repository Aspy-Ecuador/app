interface PaymentFormProps {
    paymentType: string;
    setPaymentType: (value: string) => void;
    setIsValid: (valid: boolean) => void;
}
export default function PaymentForm({ paymentType, setPaymentType, setIsValid, }: PaymentFormProps): import("react/jsx-runtime").JSX.Element;
export {};
