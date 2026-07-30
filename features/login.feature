@regression @login
Feature: Login - Inicio de sesión y registro
  Como usuario de la aplicación
  Quiero iniciar sesión o registrarme
  Para acceder a las funcionalidades de la app

  Background:
    Given El usuario navega a la pantalla de Login

  @smoke
  Scenario: Validación visual de la pantalla de Login
    Then La pantalla de Login debe mostrar todos los elementos

  @positive @login-success
  Scenario: [CP-001] Inicio de sesión exitoso con credenciales válidas
    When El usuario ingresa "test@example.com" en el campo Email
    And El usuario ingresa "Password123" en el campo Contraseña
    And El usuario presiona el botón LOGIN
    Then El sistema debe procesar el inicio de sesión exitosamente

  @positive @signup-success
  Scenario: [CP-002] Registro exitoso con datos válidos
    When El usuario cambia a la pestaña de registro
    And El usuario ingresa "newuser@test.com" en el campo Email
    And El usuario ingresa "SecurePass1" en el campo Contraseña
    And El usuario ingresa "SecurePass1" en el campo Repetir Contraseña
    And El usuario presiona el botón SIGN UP
    Then El sistema debe procesar el registro exitosamente

  @negative @login-validation
  Scenario: [CP-003] Inicio de sesión con email vacío
    When El usuario deja el campo Email vacío
    And El usuario ingresa "Password123" en el campo Contraseña
    And El usuario presiona el botón LOGIN
    Then El sistema debe mostrar un error de validación de email

  @negative @login-validation
  Scenario: [CP-004] Inicio de sesión con contraseña vacía
    When El usuario ingresa "test@example.com" en el campo Email
    And El usuario deja el campo Contraseña vacío
    And El usuario presiona el botón LOGIN
    Then El sistema debe mostrar un error de validación de contraseña

  @negative @login-validation
  Scenario: [CP-005] Inicio de sesión con email y contraseña vacíos
    When El usuario deja el campo Email vacío
    And El usuario deja el campo Contraseña vacío
    And El usuario presiona el botón LOGIN
    Then El sistema debe mostrar un error de validación

  @negative @signup-validation
  Scenario: [CP-006] Registro con contraseñas que no coinciden
    When El usuario cambia a la pestaña de registro
    And El usuario ingresa "test@example.com" en el campo Email
    And El usuario ingresa "Password1" en el campo Contraseña
    And El usuario ingresa "Different1" en el campo Repetir Contraseña
    And El usuario presiona el botón SIGN UP
    Then El sistema debe mostrar un error de contraseñas no coincidentes

  @negative @signup-validation
  Scenario: [CP-007] Registro con email inválido
    When El usuario cambia a la pestaña de registro
    And El usuario ingresa "email-invalido" en el campo Email
    And El usuario ingresa "Password1" en el campo Contraseña
    And El usuario ingresa "Password1" en el campo Repetir Contraseña
    And El usuario presiona el botón SIGN UP
    Then El sistema debe mostrar un error de email inválido

  @edge-case @boundary
  Scenario: [CP-008] Alternar entre pestañas Login y Sign Up
    When El usuario cambia a la pestaña de registro
    Then Los campos de registro deben estar visibles
    When El usuario cambia a la pestaña de inicio de sesión
    Then Los campos de inicio de sesión deben estar visibles
    And El campo Repetir Contraseña no debe estar visible
