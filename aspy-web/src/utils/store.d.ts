import { UserAccount } from "@/types/UserAccount";
interface State {
    user: UserAccount | null;
}
interface Action {
    type: string;
    payload: UserAccount;
}
declare const store: import("redux").Store<State, Action, unknown>;
export declare const getAuthenticatedUser: () => UserAccount | null;
export declare const setAuthenticatedUser: (user: UserAccount) => void;
export declare const getAuthenticatedUserRole: () => string;
export declare const getAuthenticatedUserName: () => string;
export declare const getAuthenticatedUserEmail: () => string;
export declare const getAuthenticatedUserIdentity: () => number;
export declare const setAuthenticatedUserByRole: (role: "admin" | "staff" | "professional" | "client") => UserAccount;
export default store;
