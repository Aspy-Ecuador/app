Feature: Gestion de secretarios
    Como secretario del sistema
    Quiero poder visualizar la informacion de la app
    Para realizar una comoda navegacion

  Scenario: Ver el dashboard con Citas de hoy
    Given que estoy en la pagina de staff
    Then deberia ver el titulo "Citas de hoy:"
    And deberia ver al menos una cita con Paciente Karla null, Profesional Carlos null, Servicio Charla y Estado Agendado
    And deberia ver la fecha 2025-08-18 y hora 11:00:00

  Scenario: Ver la tabla de Profesionales con datos correctos
    Given que estoy en la pagina de staff
    When doy click en el botón Profesionales
    Then deberia ver el titulo "Profesionales"
    And deberia ver la tabla de profesionales con los encabezados Nombres, Apellidos, Correo, Titulo, Especialidad
    And deberia existir al menos un profesional con Nombre Jaime, Correo prof1@aspy.com, Titulo Pisc., Especialidad Psicología

  Scenario: Buscar un profesional por nombre en el filtro
    Given que estoy en la pagina de staff
    When doy click en el botón Profesionales
    And escribo "Jaime" en el filtro de búsqueda
    Then deberia ver al menos un profesional cuyo nombre contenga "Jaime"

  Scenario: Ver la tabla de Clientes con datos correctos
    Given que estoy en la pagina de staff
    When doy click en el botón Pacientes
    Then deberia ver el titulo "Clientes"
    And deberia ver la tabla de clientes con los encabezados Nombres, Apellidos, Correo, Edad, Ocupación
    And deberia existir al menos un cliente con Nombre Karla, Correo client1@aspy.com, Edad 43, Ocupación Estudiante

  Scenario: Filtrar clientes por nombre en el filtro
    Given que estoy en la pagina de staff
    When doy click en el botón Pacientes
    And escribo "Karla" en el filtro de búsqueda
    Then deberia ver al menos un cliente cuyo nombre contenga "Karla"

 Scenario: Ver el calendario de Citas
    Given que estoy en la pagina de staff
    When doy click en el boton Citas
    Then deberia poder ver el calendario de citas con los valores Hoy, Mes, Semana, Día

Scenario: Ver la tabla de Recibos
    Given que estoy en la pagina de staff
    When doy click en el boton Recibos
    Then deberia ver el titulo "Comprobantes de Pago"
    And deberia ver la tabla de recibos con los encabezados N° de Recibo, Cliente, Fecha de Emisión, Total
    And deberia existir al menos un recibo con N° 4, Cliente Karla null, Fecha de Emisión 2025-08-02, Total $ 12.00

Scenario: Filtrar Recibos por cliente
    Given que estoy en la pagina de staff
    When doy click en el boton Recibos
    And escribo "Karla" en el filtro de búsqueda de Recibos
    Then deberia ver al menos un recibo cuyo cliente contenga "Karla"

