@regression @drag
Feature: Drag - Puzzle de arrastrar y soltar
  Como usuario de la aplicación
  Quiero resolver el puzzle arrastrando las piezas
  Para validar la funcionalidad de drag & drop

  Background:
    Given El usuario navega a la pantalla de Drag

  @smoke
  Scenario: Validación visual de la pantalla de Drag
    Then La pantalla de Drag debe mostrar todos los elementos

  @positive @puzzle
  Scenario: [CP-019] Arrastrar una pieza a su zona correcta
    When El usuario arrastra la pieza "drag-l1" a la zona "drop-l1"
    Then La pieza "drag-l1" debe estar en la posición correcta

  @positive @puzzle
  Scenario: [CP-020] Resolver el puzzle completo
    When El usuario resuelve el puzzle completo
    Then Todas las piezas deben estar en sus posiciones correctas

  @positive @reset
  Scenario: [CP-021] Reiniciar el puzzle con el botón Renew
    Given El usuario resuelve el puzzle completo
    When El usuario presiona el botón Renew
    Then Las piezas deben volver a sus posiciones iniciales

  @negative
  Scenario: [CP-022] Arrastrar una pieza a una zona incorrecta
    When El usuario arrastra la pieza "drag-l1" a la zona "drop-r3"
    Then La pieza "drag-l1" no debe estar en la posición correcta
