# Frontend del Sistema de Ventas

Este proyecto es el frontend del sistema de gestión de ventas que permite la creacion, visualización y filtrado de cabeceras de venta y detalles de venta. Está construido utilizando Angular.

## Requisitos

- Node.js 18 o superior
- Angular CLI 18 o superior


## Ejecución 
--
--`npm install` para instalar paquetes necesarios, comprobamos que el servidor python esta corriendo en `http://localhost:8000/`  de no ser así podemos modificar el archivo `src\environments\environment.ts`ejecutar el servidor de angular  --  `ng serve`

## Funcionalidades
1. Validación de Token: La aplicacion incluye validación de token para asegurar que solo usuarios autenticados puedan acceder a ciertas funcionalidades.

2. Control de Sesion: Gestión de la sesion del usuario, incluyendo inicio y cierre de sesion, así como manejo de la expiracion del token..

3. Guard para URLs Protegidas: Uso de guards en Angular para proteger rutas y asegurar que solo usuarios autenticados puedan acceder a ellas.

4. Filtros: Implementación de filtros para la busqueda y visualización de datos, como la filtración por fecha en la lista de cabeceras de venta.

5. Creacion de registros y listas.



# FrontLocatel

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 18.0.5.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
