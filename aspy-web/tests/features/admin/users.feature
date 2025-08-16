Feature: Gestion de usuarios
  Como administrador del sistema
  Quiero poder visualizar la lista de usuarios
  Para asegurarme de que los datos están correctos

  Scenario: Ver la tabla de usuarios con datos correctos
    Given que estoy en la pagina de usuarios
    Then deberia ver la tabla con los encabezados Nombres, Apellidos, Rol, Correo
    And deberia ver al menos un usuario en la tabla
    And deberia existir un usuario con nombre Milena, rol Administrador y correo admin@aspy.com


 Scenario: Buscar un usuario por nombre en el filtro
    Given que estoy en la pagina de usuarios
    When escribo "Milena" en el filtro de búsqueda
    Then deberia ver al menos un usuario cuyo nombre contenga "Milena"

Scenario: Registrar un usuario con todos los campos válidos
    Given que estoy en la pagina de usuarios
    When doy click en el boton Agregar Usuario
    And relleno el campo Nombre con Carlos
    And relleno el campo Apellido con Salazar
    And relleno el campo Fecha de Nacimiento con 1995-03-15
    And relleno el campo Correo con carlos1@example.com 
    And selecciono Masculino en el campo Genero
    And doy click en el boton Siguiente
    And selecciono Ingeniero en el campo Ocupacion
    And selecciono Casado en el campo Estado Civil
    And selecciono Postgrado en el campo Nivel Educativo
    And selecciono Cliente en el campo Rol
    And doy click en el boton Siguiente
    And relleno el campo Contraseña con 12345678
    And relleno el campo Confirmar Contraseña con 12345678
    And doy click en el boton Crear
    Then deberia ver un mensaje que diga Se ha registrado con éxito!!

Scenario: Ver la tabla de servicios con los datos correctos
    Given que estoy en la pagina de servicios
    Then deberia ver la tabla con los encabezados ID, Nombre, Costo
    And deberia ver al menos un servicio en la tabla
    And deberia existir un servicio con id 1, nombre Charla y costo $ 1.00

 Scenario: Buscar un servicio por nombre en el filtro
    Given que estoy en la pagina de servicios
    When escribo "Consulta" en el filtro de búsqueda
    Then deberia ver al menos un servicio cuyo nombre contenga "Consulta"

Scenario: Agregar un servicio con todos los campos válidos
    Given que estoy en la pagina de servicios
    When doy click en el boton Agregar Servicio
    And relleno el campo Nombre del servicio con TerapiaTTTest10
    And relleno el campo Precio con 26
    And doy click en el boton Crear
    Then deberia ver un mensaje que diga ¡Se ha creado con éxito!

