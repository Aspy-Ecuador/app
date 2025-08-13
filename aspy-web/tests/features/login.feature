Feature: Login para diferentes roles de usuario

  Scenario: Login como Admin
    Given que estoy en la pagina de login
    When ingreso el usuario "admin@aspy.com" y la contraseña "admin"
    And presiono el botón de iniciar sesión
    Then debería ver la página principal

  Scenario: Login como Secretario
    Given que estoy en la pagina de login
    When ingreso el usuario "staff1@aspy.com" y la contraseña "staff1"
    And presiono el botón de iniciar sesión
    Then debería ver la página principal

  Scenario: Login como Profesional
    Given que estoy en la pagina de login
    When ingreso el usuario "prof1@aspy.com" y la contraseña "prof1"
    And presiono el botón de iniciar sesión
    Then debería ver la página principal

  Scenario: Login como Cliente
    Given que estoy en la pagina de login
    When ingreso el usuario "client1@aspy.com" y la contraseña "client1"
    And presiono el botón de iniciar sesión
    Then debería ver la página principal
