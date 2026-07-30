@regression @swipe
Feature: Swipe - Navegación por carrusel
  Como usuario de la aplicación
  Quiero deslizar el carrusel horizontalmente
  Para ver las diferentes tarjetas informativas

  Background:
    Given El usuario navega a la pantalla de Swipe

  @smoke
  Scenario: Validación visual de la pantalla de Swipe
    Then La pantalla de Swipe debe mostrar todos los elementos

  @positive @carousel
  Scenario: [CP-015] Deslizar el carrusel hacia la izquierda
    When El usuario desliza el carrusel hacia la izquierda
    Then El contenido del carrusel debe haber cambiado

  @positive @carousel
  Scenario: [CP-016] Deslizar el carrusel hacia la derecha
    Given El usuario desliza el carrusel hacia la izquierda
    When El usuario desliza el carrusel hacia la derecha
    Then El carrusel debe volver a la tarjeta inicial

  @positive @carousel
  Scenario: [CP-017] Navegar por todas las tarjetas del carrusel
    When El usuario desliza el carrusel hacia la izquierda
    And El usuario desliza el carrusel hacia la izquierda nuevamente
    Then El carrusel debe mostrar contenido diferente

  @positive
  Scenario: [CP-018] Verificar que el logo de WebdriverIO está visible
    Then El logo de WebdriverIO debe estar visible en la pantalla
