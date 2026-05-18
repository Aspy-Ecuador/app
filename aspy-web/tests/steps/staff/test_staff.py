# tests/steps/staff/test_staff.py
from pytest_bdd import scenarios, given, then, when, parsers
from playwright.sync_api import expect

# Carga el feature correspondiente
scenarios("../../features/staff/staff.feature")

@given("que estoy en la pagina de staff")
def staff_page(page):
    # Login con credenciales staff
    page.goto("http://localhost:5173/app/login")
    page.get_by_placeholder("tu@correo.com").fill("staff1@aspy.com")
    page.locator('input[name="password"]').fill("staff1")
    page.get_by_role("button", name="Iniciar sesión").click()
    expect(page).to_have_url("http://localhost:5173/app", timeout=120000)
    
    # Verifica encabezado de bienvenida
    expect(page.get_by_role("heading", name="Bienvenid@ al Panel de Control, ASPY")).to_be_visible(timeout=120000)

# --- Ver Dashboard con Citas de hoy ---
@then('deberia ver el titulo "Citas de hoy:"')
def verify_todays_appointments_title(page):
    expect(page.get_by_role("heading", name="Citas de hoy:")).to_be_visible(timeout=10000)

@then("deberia ver al menos una cita con Paciente Karla null, Profesional Carlos null, Servicio Charla y Estado Agendado")
def verify_todays_appointments_data(page):
    pacientes = page.locator("p.typography-citas:has-text('Paciente: Karla null')").all_text_contents()
    profesionales = page.locator("p.typography-citas:has-text('Profesional:Carlos null')").all_text_contents()
    servicios = page.locator("p.typography-citas:has-text('Servicio: Charla')").all_text_contents()
    estados = page.locator("p.typography-citas:has-text('Estado: Agendado')").all_text_contents()

    assert len(pacientes) > 0, f"No se encontró la paciente 'Karla null'. Pacientes visibles: {pacientes}"
    assert len(profesionales) > 0, f"No se encontró el profesional 'Carlos null'. Profesionales visibles: {profesionales}"
    assert len(servicios) > 0, f"No se encontró el servicio 'Charla'. Servicios visibles: {servicios}"
    assert len(estados) > 0, f"No se encontró el estado 'Agendado'. Estados visibles: {estados}"

@then("deberia ver la fecha 2025-08-18 y hora 11:00:00")
def verify_date_and_time(page):
    fechas = page.locator("p.p-citas:has-text('2025-08-18')").all_text_contents()
    horas = page.locator("p.p-citas:has-text('11:00:00')").all_text_contents()
    assert len(fechas) > 0, f"No se encontró la fecha '2025-08-18'. Fechas visibles: {fechas}"
    assert len(horas) > 0, f"No se encontró la hora '11:00:00'. Horas visibles: {horas}"

# --- Profesionales ---
@when("doy click en el botón Profesionales")
def click_professionals(page):
    page.get_by_role("button", name="Profesionales").wait_for(state="visible", timeout=10000)
    page.get_by_role("button", name="Profesionales").click()
    expect(page).to_have_url("http://localhost:5173/app/profesionales", timeout=20000)

@then('deberia ver el titulo "Profesionales"')
def verify_professionals_title(page):
    expect(page.get_by_role("heading", name="Profesionales")).to_be_visible(timeout=10000)

@then("deberia ver la tabla de profesionales con los encabezados Nombres, Apellidos, Correo, Titulo, Especialidad")
def verify_professionals_table_headers(page):
    headers = [h.strip() for h in page.locator("div.MuiDataGrid-columnHeaderTitle").all_text_contents()]
    expected_headers = ["Nombres", "Apellidos", "Correo", "Título", "Especialidad"]
    for h in expected_headers:
        assert h in headers, f"Encabezado '{h}' no encontrado en la tabla. Headers visibles: {headers}"

@then("deberia existir al menos un profesional con Nombre Jaime, Correo prof1@aspy.com, Titulo Pisc., Especialidad Psicología")
def verify_professional_data(page):
    nombres = page.locator("div[data-field='first_name']").all_text_contents()
    correos = page.locator("div[data-field='email']").all_text_contents()
    titulos = page.locator("div[data-field='title']").all_text_contents()
    especialidades = page.locator("div[data-field='specialty']").all_text_contents()

    assert "Jaime" in nombres, f"No se encontró el nombre 'Jaime'. Nombres visibles: {nombres}"
    assert "prof1@aspy.com" in correos, f"No se encontró el correo 'prof1@aspy.com'. Correos visibles: {correos}"
    assert "Pisc." in titulos, f"No se encontró el título 'Pisc.'. Títulos visibles: {titulos}"
    assert "Psicología" in especialidades, f"No se encontró la especialidad 'Psicología'. Especialidades visibles: {especialidades}"

@when('escribo "Jaime" en el filtro de búsqueda')
def search_professional(page):
    page.get_by_placeholder("Search…").fill("Jaime")
    page.wait_for_timeout(1000)

@then('deberia ver al menos un profesional cuyo nombre contenga "Jaime"')
def verify_professional_search_result(page):
    nombres = page.locator("div[data-field='first_name']").all_text_contents()
    assert any("Jaime" in n for n in nombres), f"No se encontró ningún profesional con nombre 'Jaime'. Nombres visibles: {nombres}"

# --- Pacientes ---
@when("doy click en el botón Pacientes")
def click_patients(page):
    page.get_by_role("button", name="Pacientes").wait_for(state="visible", timeout=10000)
    page.get_by_role("button", name="Pacientes").click()
    expect(page).to_have_url("http://localhost:5173/app/pacientes", timeout=20000)

@then('deberia ver el titulo "Clientes"')
def verify_clients_title(page):
    expect(page.get_by_role("heading", name="Clientes")).to_be_visible(timeout=10000)

@then("deberia ver la tabla de clientes con los encabezados Nombres, Apellidos, Correo, Edad, Ocupación")
def verify_clients_table_headers(page):
    headers = [h.strip() for h in page.locator("div.MuiDataGrid-columnHeaderTitle").all_text_contents()]
    expected_headers = ["Nombres", "Apellidos", "Correo", "Edad", "Ocupación"]
    for h in expected_headers:
        assert h in headers, f"Encabezado '{h}' no encontrado en la tabla. Headers visibles: {headers}"

@then("deberia existir al menos un cliente con Nombre Karla, Correo client1@aspy.com, Edad 43, Ocupación Estudiante")
def verify_client_data(page):
    nombres = page.locator("div[data-field='first_name']").all_text_contents()
    correos = page.locator("div[data-field='email']").all_text_contents()
    edades = page.locator("div[data-field='age'] p").all_text_contents()
    ocupaciones = page.locator("div[data-field='occupation'] p").all_text_contents()

    assert "Karla" in nombres, f"No se encontró el nombre 'Karla'. Nombres visibles: {nombres}"
    assert "client1@aspy.com" in correos, f"No se encontró el correo 'client1@aspy.com'. Correos visibles: {correos}"
    assert "43" in edades, f"No se encontró la edad '43'. Edades visibles: {edades}"
    assert "Estudiante" in ocupaciones, f"No se encontró la ocupación 'Estudiante'. Ocupaciones visibles: {ocupaciones}"

@when('escribo "Karla" en el filtro de búsqueda')
def search_client(page):
    page.get_by_placeholder("Search…").fill("Karla")
    page.wait_for_timeout(1000)

@then('deberia ver al menos un cliente cuyo nombre contenga "Karla"')
def verify_client_search_result(page):
    nombres = page.locator("div[data-field='first_name']").all_text_contents()
    assert any("Karla" in n for n in nombres), f"No se encontró ningún cliente con nombre 'Karla'. Nombres visibles: {nombres}"

@when("doy click en el boton Citas")
def click_citas(page):
    page.get_by_role("button", name="Citas").wait_for(state="visible", timeout=10000)
    page.get_by_role("button", name="Citas").click()
    expect(page).to_have_url("http://localhost:5173/app/citas", timeout=20000)

@then("deberia poder ver el calendario de citas con los valores Hoy, Mes, Semana, Día")
def verify_calendar_options(page):
    expected_options = ["Hoy", "Mes", "Semana", "Día"]

    for option in expected_options:
        button = page.get_by_role("button", name=option)
        expect(button).to_be_visible(timeout=120000)
        expect(button).to_have_text(option, timeout=120000)

# --- Recibos ---
@when("doy click en el boton Recibos")
def click_recibos(page):
    page.get_by_role("button", name="Recibos").wait_for(state="visible", timeout=10000)
    page.get_by_role("button", name="Recibos").click()
    expect(page).to_have_url("http://localhost:5173/app/recibos", timeout=20000)

@then('deberia ver el titulo "Comprobantes de Pago"')
def verify_recibos_title(page):
    expect(page.get_by_role("heading", name="Comprobantes de Pago")).to_be_visible(timeout=10000)

@then("deberia ver la tabla de recibos con los encabezados N° de Recibo, Cliente, Fecha de Emisión, Total")
def verify_recibos_table_headers(page):
    headers = [h.strip() for h in page.locator("div.MuiDataGrid-columnHeaderTitle").all_text_contents()]
    expected_headers = ["N° de Recibo", "Cliente", "Fecha de Emisión", "Total"]
    for h in expected_headers:
        assert h in headers, f"Encabezado '{h}' no encontrado en la tabla. Headers visibles: {headers}"

@then("deberia existir al menos un recibo con N° 4, Cliente Karla null, Fecha de Emisión 2025-08-02, Total $ 12.00")
def verify_recibo_data(page):
    numeros = page.locator("div[data-field='id'] p").all_text_contents()
    clientes = page.locator("div[data-field='client'] p").all_text_contents()
    fechas = page.locator("div[data-field='issueDate'] p").all_text_contents()
    total = page.locator("div[data-field='price'] p").all_text_contents()

    assert "4" in numeros, f"No se encontró el N° de recibo '4'. Numeros visibles: {numeros}"
    assert "Karla null" in clientes, f"No se encontró el cliente 'Karla null'. Clientes visibles: {clientes}"
    assert "2025-08-02" in fechas, f"No se encontró la fecha '2025-08-02'. Fechas visibles: {fechas}"
    assert "$ 12.00" in total, f"No se encontró el total '$ 12.00'. Total visibles: {total}"

# --- Filtrar Recibos por cliente ---
@when('escribo "Karla" en el filtro de búsqueda de Recibos')
def search_recibo(page):
    page.get_by_placeholder("Search…").fill("Karla")
    page.wait_for_timeout(1000)  # espera que filtre

@then('deberia ver al menos un recibo cuyo cliente contenga "Karla"')
def verify_recibo_search_result(page):
    clientes = page.locator("div[data-field='client'] p").all_text_contents()
    assert any("Karla" in c for c in clientes), f"No se encontró ningún recibo con cliente 'Karla'. Clientes visibles: {clientes}"
