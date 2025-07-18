interface InvoiceViewProps {
    id: number;
    date: string;
    client: string;
    service: string;
    address: string;
    price: number;
    discount: number;
    total: number;
    paymentMethod: string;
    contactEmail: string;
    contactPhone: string;
}
export default function InvoiceView({ id, date, client, service, address, price, discount, total, paymentMethod, contactEmail, contactPhone, }: InvoiceViewProps): import("react/jsx-runtime").JSX.Element;
export {};
