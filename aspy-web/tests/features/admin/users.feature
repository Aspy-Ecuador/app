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
    And relleno el campo Nombres con Carlos
    And relleno el campo Apellidos con Salazar
    And relleno el campo Fecha de Nacimiento con 1995-03-15
    And relleno el campo Correo con carlos@example.com
    And selecciono Masculino en el campo Genero
    And doy click en el boton Siguiente
    And selecciono Ingeniero en el campo Ocupacion
    And selecciono Casado en el campo Estado Civil
    And selecciono Postgrado en el campo Nivel Educativo
    And selecciono Administrador en el campo Rol
    And relleno el campo Contraseña con 12345678
    And doy click en el boton Siguiente
    And relleno el campo Confirmar Contraseña con 12345678
    And doy click en el boton Crear
    Then deberia ver un mensaje que diga Se ha registrado con éxito!!