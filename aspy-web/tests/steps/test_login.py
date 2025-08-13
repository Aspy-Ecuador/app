# steps.py

# Importa las librerías necesarias de Playwright y pytest-bdd
from playwright.sync_api import Page, expect
from pytest_bdd import given, when, then, scenarios, parsers

# Carga el archivo .feature para que pytest lo reconozca
scenarios('../features/login.feature')

# --- Pasos 'Dado' ---
# Define la precondición del escenario: estar en la página de login
@given("que estoy en la pagina de login")
def navigate_to_login(page: Page):
    """Navega a la página de login."""
    page.goto("http://localhost:5173/app/login")

# --- Pasos 'Cuando' ---
# Combina los pasos de ingresar el usuario y la contraseña en una sola función
@when(parsers.parse("ingreso el usuario \"{user}\" y la contraseña \"{password}\""))
def fill_credentials(page: Page, user, password):
    """Rellena los campos de usuario y contraseña."""
    page.get_by_placeholder("tu@correo.com").fill(user)
    page.locator('input[name="password"]').fill(password)

# Define el paso para hacer clic en el botón de iniciar sesión
@when("presiono el botón de iniciar sesión")
def click_login_button(page: Page):
    """Hace clic en el botón de Iniciar sesión."""
    page.get_by_role("button", name="Iniciar sesión").click()

# --- Pasos 'Entonces' ---
# Verifica que se ha llegado a la página principal y se ve el encabezado de bienvenida
@then("debería ver la página principal")
def verify_main_page(page: Page):
    """
    Verifica que la URL es la de la página principal
    y que el encabezado de bienvenida es visible.
    """
    # Verifica que la URL es la de la página principal
    expect(page).to_have_url("http://localhost:5173/app", timeout=120000)
    
    # Verifica que el encabezado de bienvenida está presente
    expect(page.get_by_role("heading", name="Bienvenid@ al Panel de Control, ASPY")).to_be_visible(timeout=120000)