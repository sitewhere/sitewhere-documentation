# Java API - Device States

<Seo/>

Esta sección contiene la documentación y ejemplos del end point `devicestates` de la API de Java de SiteWhere.

Este ejemplo asume que usted obtiene su autenticación del _tenant_ ya sea por

```java
ITenantAuthentication tenantAuthentication = SiteWhereClient.defaultTenant();
```

o por la utilización del tenant `default`.

```java
ITenantAuthentication tenantAuthentication = SiteWhereClient.forTenant("token", "auth");
```

## Busqueda de Device States

Para buscar resultados de `DeviceState` se necesita una instancia de `DeviceStateSearchCriteria`,
las cuales serán pasadas al método `listDeviceStates` de `com.sitewhere.spi.ISiteWhereClient`. El siguiente ejemplo muestra
como consultar la API REST de SiteWhere para listar la primer página con 100 resultados de `DeviceState`.

```java
DeviceStateSearchCriteria searchCriteria = new DeviceStateSearchCriteria(1, 100);
SearchResults<DeviceState> results = client.listDeviceStates(tenantAuthentication, searchCriteria);
```

El objeto `DeviceStateSearchCriteria` define los criterios de búsqueda para un `DeviceState`, la siguiente tabla
muestra las propiedades, con su tipo y desdcripción, que pueden ser usadas para filtar los resultados.

| Propiedad                    | Type           | Descripción                                                                                                     |
| :--------------------------- | :------------- | :-------------------------------------------------------------------------------------------------------------- |
| setLastInteractionDateBefore | `Date`         | Si se estable, se limitarán los resultados para los cuales la fecha de última interación anterior a este valor. |
| setDeviceTypeTokens          | `List<String>` | Lista de Device Types a incluir en los resultados.                                                              |
| setCustomerTokens            | `List<String>` | Lista de Customers a incluir en los resultados.                                                                 |
| setAreaTokens                | `List<String>` | Lista de Areas a incluir en los resultados.                                                                     |
| setAssetTokens               | `List<String>` | Lista de Assets a incluir en los resultados.                                                                    |
| setPageNumber                | `Integer`      | Indicar el número de pagina del dataset.                                                                        |
| setPageSize                  | `Integer`      | Indicar el número de registros por página.                                                                      |

Además se puede controlar que información es retornada en los resultados proveyendo una instancia de
`DeviceStateResponseFormat`. La siguiente tabla muestra las propiedades que pueden ser establecidas para controlar
el formato del resultado de la respuesta.

| Propiedad                  | Type      | Descripción                                                  |
| :------------------------- | :-------- | :----------------------------------------------------------- |
| setIncludeArea             | `Boolean` | Indica si el Area se incluye en los resultados.              |
| setIncludeAsset            | `Boolean` | Indica si el asset se incluye en los resultados.             |
| setIncludeCustomer         | `Boolean` | Indica si el customer se incluye en los resultados.          |
| setIncludeDevice           | `Boolean` | Indica si el device se incluye en los resultados.            |
| setIncludeDeviceAssignment | `Boolean` | Indica si el device assignment se incluye en los resultados. |
| setIncludeDeviceType       | `Boolean` | Indica si el device type se incluye en los resultados.       |
| setIncludeEventDetails     | `Boolean` | Indica si el event details se incluye en los resultados.     |
