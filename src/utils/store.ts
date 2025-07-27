import { createStore } from "redux";
import { UserLogin } from "@/types/UserLogin";

// Definir el estado inicial y el tipo de estado
interface State {
  user: UserLogin | null; // El usuario puede ser null si no hay un usuario autenticado
  theme: string; // Tema del UI (light/dark)
}

// Cargar el usuario desde localStorage
const loadUserFromLocalStorage = (): UserLogin | null => {
  const user = localStorage.getItem("authenticatedUser");
  return user ? JSON.parse(user) : null;
};

// Cargar el tema desde localStorage o usar "light" como valor predeterminado
const loadThemeFromLocalStorage = (): string => {
  const theme = localStorage.getItem("mui-mode");
  return theme ? theme : "light"; // Si no hay valor en localStorage, se usa "light" por defecto
};

// Guardar el usuario en localStorage
const saveUserToLocalStorage = (user: UserLogin | null): void => {
  if (user) {
    localStorage.setItem("authenticatedUser", JSON.stringify(user));
  } else {
    localStorage.removeItem("authenticatedUser");
  }
};

// Guardar el tema en localStorage
const saveThemeToLocalStorage = (theme: string): void => {
  localStorage.setItem("mui-mode", theme);
};

const initialState: State = {
  user: loadUserFromLocalStorage(), // Carga desde localStorage o usa un usuario de ejemplo
  theme: loadThemeFromLocalStorage(), // Carga el tema desde localStorage o usa "light" por defecto
};

// Definir las acciones posibles
interface Action {
  type: string;
  payload: UserLogin | null | string; // Puede ser UserLogin o un string (tema)
}

// Acción para establecer el usuario
const setUser = (user: UserLogin | null): Action => ({
  type: "SET_USER",
  payload: user,
});

// Acción para establecer el tema
const setTheme = (theme: string): Action => ({
  type: "SET_THEME",
  payload: theme,
});

// Reducer que maneja las acciones
const rootReducer = (state = initialState, action: Action): State => {
  switch (action.type) {
    case "SET_USER":
      saveUserToLocalStorage(action.payload); // Puede ser null
      return {
        ...state,
        user: action.payload,
      };
    case "SET_THEME":
      saveThemeToLocalStorage(action.payload as string); // Guarda el tema en localStorage
      return {
        ...state,
        theme: action.payload as string,
      };
    default:
      return state;
  }
};

// Crear el store de Redux
const store = createStore(rootReducer);

// Función para obtener el usuario autenticado
export const getAuthenticatedUser = (): UserLogin | null => {
  const state = store.getState();
  return state.user; // Devuelve el usuario autenticado
};

// Función para establecer el usuario autenticado
export const setAuthenticatedUser = (user: UserLogin | null): void => {
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

// Función para obtener el nombre del usuario autenticado
export const getAuthenticatedUserName = (): string => {
  const userAuthenticated = getAuthenticatedUser();
  if (!userAuthenticated) {
    throw new Error("No authenticated user found");
  }
  return userAuthenticated.name; // Devuelve el nombre del usuario autenticado
};

// Función para obtener el correo del usuario autenticado
export const getAuthenticatedUserEmail = (): string => {
  const user = getAuthenticatedUser();
  if (!user) {
    throw new Error("No authenticated user found");
  }
  return user.email; // Devuelve el email del usuario autenticado
};

// Función para obtener la identidad del usuario autenticado
export const getAuthenticatedUserIdentity = (): number => {
  const user = getAuthenticatedUser();
  if (!user) {
    throw new Error("No authenticated user found");
  }
  return user.user_id; // Devuelve el email del usuario autenticado
};

// Función para obtener el tema actual
export const getTheme = (): string => {
  const state = store.getState();
  return state.theme; // Devuelve el tema actual
};

// Función para establecer el tema
export const setThemeMode = (theme: string): void => {
  store.dispatch(setTheme(theme)); // Despacha la acción para cambiar el tema
};

// Logout
export const logout = (): void => {
  localStorage.removeItem("token");
  localStorage.removeItem("authenticatedUser");
  localStorage.removeItem("role");
  localStorage.removeItem("mui-mode"); // Eliminar el tema en el logout
  setAuthenticatedUser(null); // borra en Redux
};

export default store;
