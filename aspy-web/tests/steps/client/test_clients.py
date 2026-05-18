# tests/steps/admin/test_users.py
from pytest_bdd import scenarios, given, then, when, parsers
from playwright.sync_api import expect

# Carga el feature correspondiente
scenarios("../../features/client/clients.feature")

@given("que estoy en la pagina de clientes")
def clients_page(page):
    # Login primero (igual que en tu steps de login)
    page.goto("http://localhost:5173/app/login")
    page.get_by_placeholder("tu@correo.com").fill("client1@aspy.com")
    page.locator('input[name="password"]').fill("client1")
    page.get_by_role("button", name="Iniciar sesión").click()
    expect(page).to_have_url("http://localhost:5173/app", timeout=120000)
    
    # Verifica que el encabezado de bienvenida está presente
    expect(page.get_by_role("heading", name="Bienvenid@ al Panel de Control, ASPY")).to_be_visible(timeout=120000)
    
@then("deberia poder ver el calendario de citas con los valores Hoy, Mes, Semana, Día")
def verify_calendar_options(page):
   # Lista de opciones esperadas
    expected_options = ["Hoy", "Mes", "Semana", "Día"]
    
    for option in expected_options:
        # Busca el botón por aria-label
        button = page.get_by_role("button", name=option)
        expect(button).to_be_visible(timeout=120000)
        expect(button).to_have_text(option, timeout=120000)
        
# --- Ver tabla de comprobantes de pago ---
@when("doy click en el botón Recibos")
def click_receipts_button(page):
    page.get_by_text("Recibos", exact=True).wait_for(state="visible", timeout=10000)
    page.get_by_text("Recibos", exact=True).click()
    expect(page).to_have_url("http://localhost:5173/app/recibos", timeout=20000)

@then("deberia ver el titulo Comprobantes de Pago")
def verify_receipts_title(page):
    expect(page.get_by_role("heading", name="Comprobantes de Pago")).to_be_visible(timeout=10000)

@then("deberia ver la tabla de comprobantes con los encabezados N° de Recibo, Cliente, Fecha de Emisión, Total")
def verify_receipts_table_headers(page):
    page.locator("div.MuiDataGrid-columnHeaderTitle").first.wait_for(state="visible", timeout=12000)
    headers = [text.strip() for text in page.locator("div.MuiDataGrid-columnHeaderTitle").all_text_contents()]
    expected_headers = ["N° de Recibo", "Cliente", "Fecha de Emisión", "Total"]
    for h in expected_headers:
        assert h in headers, f"Encabezado '{h}' no encontrado en la tabla. Headers visibles: {headers}"

@then("deberia existir al menos un comprobante con N° de Recibo 4, Cliente Karla null, Fecha de Emisión 2025-08-02 y Total $ 12.00")
def verify_receipt_in_table(page):
    receipt_numbers = page.locator("div.MuiDataGrid-cell[data-field='id']").all_text_contents()
    clients = page.locator("div.MuiDataGrid-cell[data-field='client']").all_text_contents()
    issue_dates = page.locator("div.MuiDataGrid-cell[data-field='issueDate']").all_text_contents()
    totals = page.locator("div.MuiDataGrid-cell[data-field='price']").all_text_contents()

    assert "4" in receipt_numbers, f"No se encontró el recibo número 4. Recibos visibles: {receipt_numbers}"
    assert "Karla null" in clients, f"No se encontró cliente 'Karla null'. Clientes visibles: {clients}"
    assert "2025-08-02" in issue_dates, f"No se encontró la fecha '2025-08-02'. Fechas visibles: {issue_dates}"
    assert "$ 12.00" in totals, f"No se encontró el total '$ 12.00'. Totales visibles: {totals}"
    
# --- Buscar un comprobante por cliente ---
@when('escribo "Karla null" en el filtro de búsqueda')
def search_receipt_by_client(page):
    search_box = page.get_by_placeholder("Search…")
    search_box.fill("Karla null")
    page.wait_for_timeout(1000)  # espera breve para que aplique el filtro

@then('deberia ver al menos un comprobante cuyo cliente contenga "Karla null"')
def verify_receipt_search_result(page):
    clients = page.locator("div.MuiDataGrid-cell[data-field='client']").all_text_contents()
    assert any("Karla null" in client for client in clients), \
        f"No se encontró ningún comprobante con cliente 'Karla null'. Clientes visibles: {clients}"
        
# --- Ver tabla de servicios desde el menú Servicios ---
@when("doy click en el botón Servicios")
def click_services_button(page):
    page.get_by_role("button", name="Servicios").wait_for(state="visible", timeout=10000)
    page.get_by_role("button", name="Servicios").click()
    expect(page).to_have_url("http://localhost:5173/app/consultarServicios", timeout=20000)

@then("deberia ver el titulo Consultar servicios")
def verify_services_title(page):
    expect(page.get_by_role("heading", name="Consultar servicios")).to_be_visible(timeout=10000)

@then("deberia ver la tabla de servicios con los encabezados ID, Nombre, Costo")
def verify_services_table_headers(page):
    page.locator("div.MuiDataGrid-columnHeaderTitle").first.wait_for(state="visible", timeout=12000)
    headers = [text.strip() for text in page.locator("div.MuiDataGrid-columnHeaderTitle").all_text_contents()]
    expected_headers = ["ID", "Nombre", "Costo"]
    for h in expected_headers:
        assert h in headers, f"Encabezado '{h}' no encontrado en la tabla. Headers visibles: {headers}"

@then("deberia existir al menos un servicio con id 1, nombre Charla y costo $ 1.00")
def verify_service_in_table(page):
    service_ids = page.locator("div.MuiDataGrid-cell[data-field='service_id']").all_text_contents()
    names = page.locator("div.MuiDataGrid-cell[data-field='name']").all_text_contents()
    prices = page.locator("div.MuiDataGrid-cell[data-field='price']").all_text_contents()

    assert "1" in service_ids, f"No se encontró servicio con ID 1. IDs visibles: {service_ids}"
    assert "Charla" in names, f"No se encontró servicio 'Charla'. Nombres visibles: {names}"
    assert "$ 1.00" in prices, f"No se encontró costo '$ 1.00'. Precios visibles: {prices}"

# --- Buscar un servicio por nombre ---
@when('escribo "Charla" en el filtro de búsqueda')
def search_service_by_name(page):
    search_box = page.get_by_placeholder("Search…")
    search_box.fill("Charla")
    page.wait_for_timeout(1000)

@then('deberia ver al menos un servicio cuyo nombre contenga "Charla"')
def verify_service_search_result(page):
    names = page.locator("div.MuiDataGrid-cell[data-field='name']").all_text_contents()
    assert any("Charla" in name for name in names), \
        f"No se encontró ningún servicio con nombre 'Charla'. Nombres visibles: {names}"
        
        
# --- Ir a la pestaña de Reportes ---
@when("doy click en el botón Reportes")
def click_reports_button(page):
    page.get_by_role("button", name="Reportes").wait_for(state="visible", timeout=10000)
    page.get_by_role("button", name="Reportes").click()
    expect(page).to_have_url("http://localhost:5173/app/reportes", timeout=20000)

@then("deberia ver el titulo Mi histórico")
def verify_reports_title(page):
    expect(page.get_by_role("heading", name="Mi histórico")).to_be_visible(timeout=10000)

# --- Ver datos del reporte ---
@then("deberia ver al menos un reporte con Fecha, Hora, Profesional y Completado")
def verify_report_data(page):
    # Localizamos los contenedores de cada reporte
    reports = page.locator("div.MuiGrid2-root.MuiGrid2-container > div.MuiGrid2-root.MuiGrid2-grid-xs-6").all()
    assert len(reports) > 0, "No se encontró ningún reporte visible"

    # Tomamos el primero para verificar su contenido
    report_texts = reports[0].locator("p").all_text_contents()
    assert any("Fecha:" in text for text in report_texts), f"No se encontró Fecha en el reporte: {report_texts}"
    assert any("Hora:" in text for text in report_texts), f"No se encontró Hora en el reporte: {report_texts}"
    assert any("Profesional:" in text for text in report_texts), f"No se encontró Profesional en el reporte: {report_texts}"
    assert any("Completado" in text for text in report_texts), f"No se encontró Completado en el reporte: {report_texts}"
    
# --- Probar botón Ver Reporte ---
@when("doy click en el boton Ver Reporte")
def click_view_report(page):
    page.locator("button:has-text('Ver Reporte')").first.wait_for(state="visible", timeout=10000)
    page.locator("button:has-text('Ver Reporte')").first.click()
    page.wait_for_timeout(1000)  # espera a que cargue el iframe

@then("deberia ver el iframe con la vista previa del reporte")
def verify_report_iframe(page):
    iframe = page.locator("iframe[title='Vista previa del reporte']")
    expect(iframe).to_be_visible(timeout=10000)
    src = iframe.get_attribute("src")
    assert src and src.startswith("https://res.cloudinary.com/"), f"El iframe no tiene src válido: {src}"
    
# --- Ir a Nueva Cita ---
@when("doy click en el botón Nueva cita")
def click_new_appointment(page):
    page.get_by_role("button", name="Nueva cita").wait_for(state="visible", timeout=10000)
    page.get_by_role("button", name="Nueva cita").click()
    expect(page).to_have_url("http://localhost:5173/app/agendar-cita", timeout=20000)

@then("deberia ver el titulo Agendar cita")
def verify_schedule_title(page):
    expect(page.get_by_role("heading", name="Agendar cita")).to_be_visible(timeout=10000)

# --- Seleccionar Servicio y Profesional ---
@when("escojo el servicio Charla y el profesional Jaime")
def select_service_and_professional(page):
    # Primero servicio
    service_select = page.locator("select:has(option[value='1'])")
    service_select.select_option("1")
    
    # Esperamos que cargue la opción de profesional
    page.wait_for_timeout(500)  # pequeño delay para renderizar
    professional_select = page.locator("select:has(option[value='6'])")
    professional_select.select_option("6")

# --- Seleccionar Fecha ---
@when("escojo la fecha 22 de agosto de 2025")
def select_date(page):
    # Abrir el mes de agosto 2025 si no está
    calendar_label = page.locator(".MuiPickersCalendarHeader-label")
    if "August 2025" not in calendar_label.inner_text():
        page.locator("button[aria-label='Next month']").click()
    # Click en el día 22
    page.locator("button:has-text('22')").click()

# --- Seleccionar hora ---
@when("escojo la hora 11:00 - 12:00")
def select_hour(page):
    page.locator("button[aria-label='11:00 - 12:00']").click()

# --- Proceder a pagar ---
@when("doy click en el boton Proceder a pagar")
def click_proceed_to_pay(page):
    page.locator("button:has-text('Proceder a pagar')").click()

@then("deberia ver la pestaña Pagar con el boton Subir comprobante")
def verify_payment_tab(page):
    expect(page.get_by_role("heading", name="Pagar", exact=True)).to_be_visible(timeout=10000)
    subir_btn = page.locator("button:has-text('Subir comprobante')")
    expect(subir_btn).to_be_visible(timeout=10000)
    

