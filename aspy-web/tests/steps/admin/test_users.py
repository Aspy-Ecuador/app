# tests/steps/admin/test_users.py
from pytest_bdd import scenarios, given, then, when, parsers
from playwright.sync_api import expect

# Carga el feature correspondiente
scenarios("../../features/admin/users.feature")


@given("que estoy en la pagina de usuarios")
def users_page(page):
    # Login primero (igual que en tu steps de login)
    page.goto("http://localhost:5173/app/login")
    page.get_by_placeholder("tu@correo.com").fill("admin@aspy.com")
    page.locator('input[name="password"]').fill("admin")
    page.get_by_role("button", name="Iniciar sesión").click()
    expect(page).to_have_url("http://localhost:5173/app", timeout=120000)
    
    # Verifica que el encabezado de bienvenida está presente
    expect(page.get_by_role("heading", name="Bienvenid@ al Panel de Control, ASPY")).to_be_visible(timeout=120000)
    #page.wait_for_timeout(6000)
    # Click en el botón del menú "Usuarios"
    page.get_by_role("button", name="Usuarios").click()

    # Asegura que estamos en la página de usuarios
    #expect(page).to_have_url("http://localhost:5173/app/usuarios", timeout=10000)


@then("deberia ver la tabla con los encabezados Nombres, Apellidos, Rol, Correo")
def verify_table_headers(page):
    page.locator("div.MuiDataGrid-columnHeaderTitle").first.wait_for(state="visible", timeout=12000)
    headers = [text.strip() for text in page.locator("div.MuiDataGrid-columnHeaderTitle").all_text_contents()]
    expected_headers = ["Nombres", "Apellidos", "Rol", "Correo"]
    for h in expected_headers:
        assert h in headers, f"Encabezado '{h}' no encontrado en la tabla"


@then("deberia ver al menos un usuario en la tabla")
def verify_table_rows(page):
    rows = page.locator("div.MuiDataGrid-row")
    assert rows.count() > 0
    
@then("deberia existir un usuario con nombre Milena, rol Administrador y correo admin@aspy.com")
def verify_user_in_table(page):
    # Espera a que la tabla tenga al menos una fila
    first_names = page.locator("div.MuiDataGrid-cell[data-field='first_name']").all_text_contents()
    roles = page.locator("div.MuiDataGrid-cell[data-field='role']").all_text_contents()
    emails = page.locator("div.MuiDataGrid-cell[data-field='email']").all_text_contents()

    assert "Milena" in first_names
    assert "Administrador" in roles
    assert "admin@aspy.com" in emails
    
# Pasos para buscar un usuario por nombre    
@when('escribo "Milena" en el filtro de búsqueda')
def search_user_by_name(page):
    search_box = page.get_by_placeholder("Search…")  
    search_box.fill("Milena")
    page.wait_for_timeout(1000)  
@then('deberia ver al menos un usuario cuyo nombre contenga "Milena"')
def verify_user_search_result(page):
    # Obtener todos los nombres que quedaron visibles en la tabla
    first_names = page.locator("div.MuiDataGrid-cell[data-field='first_name']").all_text_contents()
    assert any("Milena" in name for name in first_names), \
        f"No se encontró ningún usuario con nombre 'Milena'. Nombres visibles: {first_names}"    

# Pasos para agregar un nuevo usuario
@when(parsers.parse("doy click en el boton {boton}"))
def click_button(page, boton):
    """Click en cualquier botón y espera que cargue la siguiente sección."""
    page.get_by_role("button", name=boton).wait_for(state="visible", timeout=10000)
    page.get_by_role("button", name=boton).click()
    page.wait_for_timeout(1000)  # Espera breve para que la siguiente sección se muestre

# --- Rellenar campos de texto ---
@when(parsers.parse("relleno el campo {campo} con {valor}"))
def fill_input_field(page, campo, valor):
    mapping = {
        "Nombres": "first_name",
        "Apellidos": "last_name",
        "Fecha de Nacimiento": "birthdate",
        "Correo": "email",
        "Contraseña": "password",
        "Confirmar Contraseña": "confirmPassword"
    }
    selector = f'input[name="{mapping[campo]}"]'
    page.locator(selector).wait_for(state="visible", timeout=10000)
    page.locator(selector).fill(valor)

# --- Seleccionar opciones en selects ---
@when(parsers.parse("selecciono {valor} en el campo {campo}"))
def select_option_field(page, valor, campo):
    mapping = {
        "Genero": "gender",
        "Ocupacion": "occupation",
        "Estado Civil": "marital_status",
        "Nivel Educativo": "education",
        "Rol": "role_id"
    }
    selector = f'select[name="{mapping[campo]}"]'
    page.locator(selector).wait_for(state="visible", timeout=10000)
    page.locator(selector).select_option(label=valor)

# --- Verificar mensaje de éxito ---
@then(parsers.parse("deberia ver un mensaje que diga {mensaje}"))
def verify_success_message(page, mensaje):
    expect(page.get_by_text(mensaje)).to_be_visible(timeout=5000)