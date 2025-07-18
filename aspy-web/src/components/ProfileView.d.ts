import { User } from "@/types/User";
type ProfileProps = {
    user_info: User;
    onEdit: () => void;
    isRowPosition: boolean;
};
declare function ProfileView({ user_info, onEdit, isRowPosition }: ProfileProps): import("react/jsx-runtime").JSX.Element;
export default ProfileView;
