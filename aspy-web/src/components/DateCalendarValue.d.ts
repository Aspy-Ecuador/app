import { AvailableDateTime } from "@/types/AvailableDateTime";
interface DateCalendarValueProps {
    fetchAvailableDates: () => Promise<AvailableDateTime[]>;
    onDateChange: (date: string) => void;
    onHourChange: (hour: string) => void;
}
export default function DateCalendarValue({ fetchAvailableDates, onDateChange, onHourChange, }: DateCalendarValueProps): import("react/jsx-runtime").JSX.Element;
export {};
