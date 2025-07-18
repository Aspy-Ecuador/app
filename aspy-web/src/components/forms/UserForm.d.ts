import { User } from "@/types/User";
interface UserFormProps {
    isEditMode?: boolean;
    userId?: number;
    role?: string;
    start: number;
    end: number;
    onNext: (data: Partial<User>) => void;
    onBack: () => void;
    onFinish: (data: Partial<User>) => void;
    isLast?: boolean;
}
export default function UserForm({ isEditMode, userId, role, start, end, onNext, onBack, onFinish, isLast, }: UserFormProps): import("react/jsx-runtime").JSX.Element;
export {};
