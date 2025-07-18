interface UserInputProps {
    label: string;
    type: string;
    id: string;
    validation: object;
    options?: string[];
    role?: string;
}
export default function UserInput({ label, type, id, validation, options, role, }: UserInputProps): import("react/jsx-runtime").JSX.Element;
export {};
