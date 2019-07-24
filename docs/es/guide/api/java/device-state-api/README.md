# :book: Java API - Device States

<Seo/>

Esta sección contiene la documentación y ejemplos del end point `devicestates` de la API de Java de SiteWhere.

Este ejemplo asume que usted obtiene su autenticación del *tenant* ya sea por

```java
ITenantAuthentication tenantAuthentication = SiteWhereClient.defaultTenant();
```

o por la utilización del tenant `default`.

```java
ITenantAuthentication tenantAuthentication = SiteWhereClient.forTenant("token", "auth");
```

## Busqueda de Device States

For searching `DeviceState` you need to provide an instance of `DeviceStateSearchCriteria` and an instance of `DeviceStateResponseFormat` to the method 
`listDeviceStates` of `com.sitewhere.spi.ISiteWhereClient`. The example below shows how you can query SiteWhere REST API to list the first
page of 100 results of device groups.

```java
DeviceStateSearchCriteria searchCriteria = new DeviceStateSearchCriteria(1, 100);
SearchResults<DeviceState> results = client.listDeviceStates(tenantAuthentication, searchCriteria);
```

`DeviceStateSearchCriteria` defines the search criteria for quering `DeviceState`, the following table shows the properties, with 
thier type and description, that can be set to filter the results.

| Propiedad                    | Type           | Descripción                                                                         |
|:-----------------------------|:---------------|:------------------------------------------------------------------------------------|
| setLastInteractionDateBefore | `Date`         | If set, will limit results to those with a last interaction date before this value. |
| setDeviceTypeTokens          | `List<String>` | List of device types to be included in results.                                     |
| setCustomerTokens            | `List<String>` | List of customers to be included in results.                                        |
| setAreaTokens                | `List<String>` | List of areas to be included in results.                                            |
| setAssetTokens               | `List<String>` | List of assets to be included in results.                                           |
| setPageNumber                | `Integer`      | Indicar el número de pagina del dataset.                                            |
| setPageSize                  | `Integer`      | Indicar el número de registros por página.                                           |

Además se puede controlar que información es retornada en los resultados proveyendo una instancia de
`DeviceStateResponseFormat`. La siguiente tabla muestra las propiedades que pueden ser establecidas para controlar
el formato del resultado de la respuesta.

| Propiedad                  | Type      | Descripción                                                    |
|:---------------------------|:----------|:---------------------------------------------------------------|
| setIncludeArea             | `Boolean` | Indicates if area is included.                                 |
| setIncludeAsset            | `Boolean` | Indicates if asset is included.                                |
| setIncludeCustomer         | `Boolean` | Indicates if customer is included.                             |
| setIncludeDevice           | `Boolean` | Indicates if device is included.                               |
| setIncludeDeviceAssignment | `Boolean` | Indicates if device assignment is included.                    |
| setIncludeDeviceType       | `Boolean` | Indicates if device type is included.                          |
| setIncludeEventDetails     | `Boolean` | Indicates if event details is included.                        |
