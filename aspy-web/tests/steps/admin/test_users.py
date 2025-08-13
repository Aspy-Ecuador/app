# tests/steps/admin/test_users.py
from pytest_bdd import scenarios, given, then
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


@then("deberia ver la tabla con los encabezados Nombres, Apellidom, Rol, Correo")
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

    first_names = page.locator("div.MuiDataGrid-cell[data-field='first_name']").all_text_contents()
    roles = page.locator("div.MuiDataGrid-cell[data-field='role']").all_text_contents()
    emails = page.locator("div.MuiDataGrid-cell[data-field='email']").all_text_contents()

    assert "Milena" in first_names
    assert "Administrador" in roles
    assert "admin@aspy.com" in emails