Feature: Gestion de clientes
    Como cliente del sistema
    Quiero poder visuaizar la informacion de la app
    Para realizar una comoda navegacion
 
 Scenario: ver calendario cargado en el sistema cuando ingrese
    Given que estoy en la pagina de clientes
    Then deberia poder ver el calendario de citas con los valores Hoy, Mes, Semana, Día

 Scenario: Ver la tabla de comprobantes de pago con datos correctos
    Given que estoy en la pagina de clientes
    When doy click en el botón Recibos
    Then deberia ver el titulo Comprobantes de Pago
    And deberia ver la tabla de comprobantes con los encabezados N° de Recibo, Cliente, Fecha de Emisión, Total
    And deberia existir al menos un comprobante con N° de Recibo 4, Cliente Karla null, Fecha de Emisión 2025-08-02 y Total $ 12.00

  Scenario: Buscar un comprobante por cliente en el filtro
    Given que estoy en la pagina de clientes
    When doy click en el botón Recibos
    And escribo "Karla null" en el filtro de búsqueda
    Then deberia ver al menos un comprobante cuyo cliente contenga "Karla null"

  Scenario: Ver la tabla de servicios con datos correctos
    Given que estoy en la pagina de clientes
    When doy click en el botón Servicios
    Then deberia ver el titulo Consultar servicios
    And deberia ver la tabla de servicios con los encabezados ID, Nombre, Costo
    And deberia existir al menos un servicio con id 1, nombre Charla y costo $ 1.00

  Scenario: Buscar un servicio por nombre en el filtro
    Given que estoy en la pagina de clientes
    When doy click en el botón Servicios
    And escribo "Charla" en el filtro de búsqueda
    Then deberia ver al menos un servicio cuyo nombre contenga "Charla"

  Scenario: Ver los reportes y sus datos
    Given que estoy en la pagina de clientes
    When doy click en el botón Reportes
    Then deberia ver el titulo Mi histórico
    And deberia ver al menos un reporte con Fecha, Hora, Profesional y Completado

  Scenario: Ver la vista previa de un reporte
    Given que estoy en la pagina de clientes
    When doy click en el botón Reportes
    And doy click en el boton Ver Reporte
    Then deberia ver el iframe con la vista previa del reporte

  Scenario: Agendar una nueva cita y proceder al pago
    Given que estoy en la pagina de clientes
    When doy click en el botón Nueva cita
    Then deberia ver el titulo Agendar cita
    When escojo el servicio Charla y el profesional Jaime
    And escojo la fecha 22 de agosto de 2025
    And escojo la hora 11:00 - 12:00
    And doy click en el boton Proceder a pagar
    Then deberia ver la pestaña Pagar con el boton Subir comprobante