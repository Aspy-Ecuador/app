from playwright.sync_api import sync_playwright
import os

# Carpeta donde se guardarán los archivos de sesión
os.makedirs("tests/sessions", exist_ok=True)

# Usuarios y credenciales
USERS = {
    "admin": {"email": "admin@aspy.com", "password": "admin", "file": "sessions/admin_state.json"},
    "staff": {"email": "staff1@aspy.com", "password": "staff1", "file": "sessions/staff_state.json"},
    "prof": {"email": "prof1@aspy.com", "password": "prof1", "file": "sessions/prof_state.json"},
    "client": {"email": "client1@aspy.com", "password": "client1", "file": "sessions/client_state.json"},
}

with sync_playwright() as p:
    browser = p.chromium.launch(headless=False)  # headless=True si no quieres ver los navegadores
    for user, info in USERS.items():
        print(f"Guardando sesión de {user}...")
        context = browser.new_context()
        page = context.new_page()
        
        # Navega al login
        page.goto("http://localhost:5173/app/login")
        
        # Ingresa credenciales
        page.get_by_placeholder("tu@correo.com").fill(info["email"])
        page.locator('input[name="password"]').fill(info["password"])
        
        # Presiona el botón de login
        page.get_by_role("button", name="Iniciar sesión").click()
        
        # Espera a que se cargue la página principal
        page.wait_for_url("http://localhost:5173/app")
        
        # Guarda el estado de la sesión
        context.storage_state(path=info["file"])
        print(f"Sesión guardada en {info['file']}\n")
        
    browser.close()
    print("¡Todas las sesiones se guardaron correctamente!")
