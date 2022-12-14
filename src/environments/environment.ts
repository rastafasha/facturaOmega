// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  // url_services: 'http://localhost:8000/index.php',
  url_services: 'https://test.factura-omega.com/api_rest/index.php',
  // url_services: 'http://localhost:8888/proyectos/CI3Server/omega/api_rest/index.php',
  title: 'Facturación Omega Dev',
  user_session_name: 'test_session_usuario_facturacion_dev'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
