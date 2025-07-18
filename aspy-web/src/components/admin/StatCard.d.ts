export type StatCardProps = {
    title: string;
    value: string;
    interval: string;
    trend: "usuarios" | "citas" | "pacientes" | "inactivos";
    data: number[];
};
export default function StatCard({ title, value, interval, trend, data, }: StatCardProps): import("react/jsx-runtime").JSX.Element;
