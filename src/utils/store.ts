import { createStore } from "redux";
import { UserAccount } from "@/types/UserAccount";
import { sampleUsers } from "@assets/sampleUsers";

// Definir el estado inicial y el tipo de estado
interface State {
  user: UserAccount | null; // El usuario puede ser null si no hay un usuario autenticado
}

// Cargar el usuario desde localStorage
const loadUserFromLocalStorage = (): UserAccount | null => {
  const user = localStorage.getItem("authenticatedUser");
  return user ? JSON.parse(user) : null;
};

// Guardar el usuario en localStorage
const saveUserToLocalStorage = (user: UserAccount | null): void => {
  if (user) {
    localStorage.setItem("authenticatedUser", JSON.stringify(user));
  } else {
    localStorage.removeItem("authenticatedUser");
  }
};

const initialState: State = {
  user: loadUserFromLocalStorage() || sampleUsers[0], // Carga desde localStorage o usa un usuario de ejemplo
};

// Definir las acciones posibles
interface Action {
  type: string;
  payload: UserAccount;
}

// Acción para establecer el usuario
const setUser = (user: UserAccount): Action => ({
  type: "SET_USER",
  payload: user,
});

// Reducer que maneja las acciones
const rootReducer = (state = initialState, action: Action): State => {
  switch (action.type) {
    case "SET_USER":
      saveUserToLocalStorage(action.payload); // Guarda el usuario en localStorage
      return {
        ...state,
        user: action.payload,
      };
    default:
      return state;
  }
};

// Crear el store de Redux
const store = createStore(rootReducer);

// Función para obtener el usuario autenticado
export const getAuthenticatedUser = (): UserAccount | null => {
  const state = store.getState();
  return state.user; // Devuelve el usuario autenticado
};

// Función para establecer el usuario autenticado
export const setAuthenticatedUser = (user: UserAccount): void => {
  store.dispatch(setUser(user)); // Despacha la acción para actualizar el usuario
};

// Función para obtener el rol del usuario autenticado
export const getAuthenticatedUserRole = (): string => {
  const user = getAuthenticatedUser();
  if (!user) {
    throw new Error("No authenticated user found");
  }
  return user.role; // Devuelve el rol del usuario autenticado
};

// get nombre y email
export const getAuthenticatedUserName = (): string => {
  const user = getAuthenticatedUser();
  if (!user) {
    throw new Error("No authenticated user found");
  }
  return user.name; // Devuelve el nombre del usuario autenticado
};

export const getAuthenticatedUserEmail = (): string => {
  const user = getAuthenticatedUser();
  if (!user) {
    throw new Error("No authenticated user found");
  }
  return user.email; // Devuelve el email del usuario autenticado
};

// Función para establecer un usuario autenticado por rol
export const setAuthenticatedUserByRole = (
  role: "admin" | "staff" | "professional" | "client"
): UserAccount => {
  const user = sampleUsers.find((user) => user.role === role);
  if (!user) {
    throw new Error(`No user found with role: ${role}`);
  }
  setAuthenticatedUser(user); // Establece el usuario autenticado
  return user; // Devuelve el usuario autenticado
};

export default store;
