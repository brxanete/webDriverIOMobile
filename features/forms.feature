@regression @forms
Feature: Forms - Interacción con elementos de formulario
  Como usuario de la aplicación
  Quiero interactuar con los elementos del formulario
  Para validar el comportamiento de inputs, switches y dropdowns

  Background:
    Given El usuario navega a la pantalla de Forms

  @smoke
  Scenario: Validación visual de la pantalla de Forms
    Then La pantalla de Forms debe mostrar todos los elementos

  @positive
  Scenario: [CP-009] Ingreso de texto en el campo de formulario
    When El usuario ingresa "Hola Mundo" en el campo de texto
    Then El texto ingresado debe mostrarse en el resultado

  @positive
  Scenario: [CP-010] Ingreso de texto con caracteres especiales
    When El usuario ingresa "Test@123!#$%&/()" en el campo de texto
    Then El texto ingresado debe mostrarse en el resultado

  @positive
  Scenario: [CP-011] Activar y desactivar el Switch
    When El usuario presiona el Switch
    Then El estado del Switch debe cambiar a "Click to turn the switch OFF"
    When El usuario presiona el Switch nuevamente
    Then El estado del Switch debe cambiar a "Click to turn the switch ON"

  @positive
  Scenario: [CP-012] Limpiar campo de texto y verificar resultado
    When El usuario ingresa "Texto temporal" en el campo de texto
    And El usuario limpia el campo de texto
    Then El campo de texto debe estar vacío

  @positive @dropdown
  Scenario Outline: [CP-013] Seleccionar opción del Dropdown
    When El usuario selecciona "<opcion>" del Dropdown
    Then La opción "<opcion>" debe estar seleccionada en el Dropdown

    Examples:
      | opcion    |
      | webdriver.io is awesome |
      | Appium is awesome |
      | This app is awesome |

  @edge-case
  Scenario: [CP-014] Interacción completa del formulario
    When El usuario ingresa "Validación completa" en el campo de texto
    And El usuario presiona el Switch
    And El usuario selecciona "Appium is awesome" del Dropdown
    Then El texto "Validación completa" debe mostrarse en el resultado
    And El estado del Switch debe cambiar a "Click to turn the switch OFF"
    And La opción "Appium is awesome" debe estar seleccionada en el Dropdown
