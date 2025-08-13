Feature: Gestion de usuarios

  Scenario: Ver la tabla de usuarios
    Given que estoy en la pagina de usuarios
    Then deberia ver la tabla con los encabezados Nombres, Apellidom, Rol, Correo
    And deberia ver al menos un usuario en la tabla