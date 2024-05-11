// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  appName: 'DCAA',
  production: false,
  //  serverUrl: "https://bes-gateway.jollybeach-bc0899fb.westeurope.azurecontainerapps.io",
  //serverUrl: "https://dcaa-staging-gateway.calmsea-ff3c33bb.westeurope.azurecontainerapps.io",
  serverUrl: "https://dcaa-testing-gateway.livelypebble-620e9608.westeurope.azurecontainerapps.io",
  //serverUrl: 'https://bes-gateway-demo.kindriver-30c70224.westeurope.azurecontainerapps.io',
  env: 'Development',
  version: '1.0',
  defaultLang: 'en',
  appInsights: {
    instrumentationKey: '77b73c20-78b4-443e-b024-ef802cf2f6eb'
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
