# Java API - Customers

<Seo/>

Esta sección contiene la documentación y ejemplos del end point `customers` de la API de Java de SiteWhere.

Este ejemplo asume que usted obtiene su autenticación del _tenant_ ya sea por

```java
ITenantAuthentication tenantAuthentication = SiteWhereClient.defaultTenant();
```

o por la utilización del tenant `default`.

```java
ITenantAuthentication tenantAuthentication = SiteWhereClient.forTenant("token", "auth");
```

## Busqueda de Customers

Para buscar resultados de `Customer` se necesita una instancia de `CustomerSearchCriteria` y una instancia de `CustomerResponseFormat`,
las cuales serán pasadas al método `listCustomers` de `com.sitewhere.spi.ISiteWhereClient`. El siguiente ejemplo muestra
como consultar la API REST de SiteWhere para listar la primer página con 100 resultados de `Customer`.

```java
CustomerSearchCriteria searchCriteria = new CustomerSearchCriteria(1, 100);
CustomerResponseFormat responseFormat = new CustomerResponseFormat();
SearchResults<Customer> results =
  client.listCustomers(tenantAuthentication, searchCriteria, responseFormat);
```

El objeto `CustomerSearchCriteria` define los criterios de búsqueda para un `Customer`, la siguiente tabla
muestra las propiedades, con su tipo y desdcripción, que pueden ser usadas para filtar los resultados.

| Propiedad              | Tipo      | Descripción                                            |
| :--------------------- | :-------- | :----------------------------------------------------- |
| setRootOnly            | `Boolean` | Indicates if only root elements are to be returned.    |
| setCustomerTypeToken   | `String`  | Requerir que los clientes se de un determinado tipo.   |
| SetParentCustomerToken | `String`  | Requerir que los clientes tengan un determinado padre. |
| setPageNumber          | `Integer` | Indicar el número de pagina del dataset.               |
| setPageSize            | `Integer` | Indicar el número de registros por página.             |

Además se puede controlar que información es retornada en los resultados proveyendo una instancia de
`CustomerResponseFormat`. La siguiente tabla muestra las propiedades que pueden ser establecidas para controlar
el formato del resultado de la respuesta.

| Propiedad              | Tipo      | Descripción                                                     |
| :--------------------- | :-------- | :-------------------------------------------------------------- |
| setIncludeCustomerType | `Boolean` | Indicar si el tipo de cliente se debe devolver en la respuesta. |

## Crear un Cliente

Para crear un `Customer` se necesita llamar a `createCustomer` pasando el objeto `ITenantAuthentication` y una
instancia de `CustomerCreateRequest` construido como en el siguiente ejemplo.

```java
String token = "e2ce4ffe-2d9c-4103-b519-1e07c58a2886"; // GUID for the Customer
String customerTypeToken = "construction";
String parentToken = "acme";
String name = "Test Customer";
CustomerCreateRequest.Builder builder = new CustomerCreateRequest.Builder(customerTypeToken, parentToken, token, name);
builder.withDescription("Some customer description");
// Build the Create Request
CustomerCreateRequest createRequest = builder.build();
// Create the Customer
Customer createdCustomer = client.createCustomer(tenantAuthentication, createRequest);
```

## Actualizar un Cliente existente

Para actualizar un `Customer` se necesita llamar a `updateCustomer` pasando el objeto `ITenantAuthentication`,
el `token` de un `Customer` existente y instancia de `CustomerCreateRequest` construido como en el siguiente ejemplo.

```java
String token = "e2ce4ffe-2d9c-4103-b519-1e07c58a2886"; // GUID for the Customer
String customerTypeToken = "construction";
String parentToken = "acme";
String name = "Test Customer";
CustomerCreateRequest.Builder builder = new CustomerCreateRequest.Builder(customerTypeToken, parentToken, token, name);
builder.withDescription("Some updated customer description");
// Build the Create Request
CustomerCreateRequest updateRequest = builder.build();
// Update the Customer
Customer updatedCustomer = client.updateCustomer(tenantAuthentication, token, updateRequest);
```

## Deleting an existing Customer

Para eliminar un `Customer` se necesita llamar a `deleteCustomer` pasando el objeto `ITenantAuthentication` y el
`token` del `Customer` que se quiere eliminar, como en el siguiente ejemplo.

```java
String token = "e2ce4ffe-2d9c-4103-b519-1e07c58a2886"; // GUID for the Customer
Customer deletedCustomer = client.deleteCustomer(tenantAuthentication, token);
```

## Obtener información asociada a un Customer

### Obtener Alertas asociadas a un Customer

El siguiente ejemplo recupera las primeras 100 `DeviceAlert`s asociadas con un `Customer`
del último año.

```java
String token = "e2ce4ffe-2d9c-4103-b519-1e07c58a2886"; // GUID for the Customer
Calendar cal = Calendar.getInstance();

cal.setTime(new Date());
cal.add(Calendar.YEAR, -1);

Date startDate = cal.getTime();
Date endDate = new Date();

DateRangeSearchCriteria searchCriteria = new DateRangeSearchCriteria(1, 100, startDate, endDate);
SearchResults<DeviceAlertWithAsset> alerts =
  client.listAlertsForCustomer(tenantAuthentication, token, searchCriteria);
```

### Obtener las Asignaciones asociadas a un Customer

El siguiente ejemplo recupera las primeras 100 `DeviceAssignment`s asociadas con un `Customer`
del último año.

```java
String token = "e2ce4ffe-2d9c-4103-b519-1e07c58a2886"; // GUID for the Customer
DeviceAssignmentSearchCriteria searchCriteria = new DeviceAssignmentSearchCriteria(1, 100);
DeviceAssignmentResponseFormat responseFormat = new DeviceAssignmentResponseFormat();
responseFormat.setIncludeCustomer(true);
SearchResults<MarshaledDeviceAssignment> assignments =
  client.listDeviceAssignmentsForCustomer(tenantAuthentication, token, searchCriteria, responseFormat);
```

### Obtener las Invocaciones a Comandos asociadas a un Customer

El siguiente ejemplo recupera las primeras 100 `DeviceCommandInvocation`s asociadas con un `Customer`
del último año.

```java
String token = "e2ce4ffe-2d9c-4103-b519-1e07c58a2886"; // GUID for the Customer
Calendar cal = Calendar.getInstance();

cal.setTime(new Date());
cal.add(Calendar.YEAR, -1);

Date startDate = cal.getTime();
Date endDate = new Date();

DateRangeSearchCriteria searchCriteria = new DateRangeSearchCriteria(1, 100, startDate, endDate);
SearchResults<DeviceCommandInvocation> commandInvocations =
  client.listCommandInvocationsForCustomer(tenantAuthentication, token, searchCriteria);
```

### Obtener las Ubicaciones asociadas an un Customer

El siguiente ejemplo recupera las primeras 100 `DeviceLocation`s asociadas con un `Customer`
del último año.

```java
String token = "e2ce4ffe-2d9c-4103-b519-1e07c58a2886"; // GUID for the Customer
Calendar cal = Calendar.getInstance();

cal.setTime(new Date());
cal.add(Calendar.YEAR, -1);

Date startDate = cal.getTime();
Date endDate = new Date();

DateRangeSearchCriteria searchCriteria = new DateRangeSearchCriteria(1, 100, startDate, endDate);
SearchResults<DeviceLocationWithAsset> locations = client
  .listLocationsForCustomer(tenantAuthentication, token, searchCriteria);
```

### Obtener las Mediciones asociadas a un Customer

El siguiente ejemplo recupera las primeras 100 `DeviceMeasurement`s asociadas con un `Customer`
del último año.

```java
String token = "e2ce4ffe-2d9c-4103-b519-1e07c58a2886"; // GUID for the Customer
Calendar cal = Calendar.getInstance();

cal.setTime(new Date());
cal.add(Calendar.YEAR, -1);

Date startDate = cal.getTime();
Date endDate = new Date();

DateRangeSearchCriteria searchCriteria = new DateRangeSearchCriteria(1, 100, startDate, endDate);
SearchResults<DeviceMeasurementWithAsset> measurements = client
  .listMeasurementsForCustomer(tenantAuthentication, token, searchCriteria);
```

### Obtener las Respuestas a Comandos asociadas a un Customer

El siguiente ejemplo recupera las primeras 100 `DeviceCommandResponse`s asociadas con un `Customer`
del último año.

```java
String token = "e2ce4ffe-2d9c-4103-b519-1e07c58a2886"; // GUID for the Customer
Calendar cal = Calendar.getInstance();

cal.setTime(new Date());
cal.add(Calendar.YEAR, -1);

Date startDate = cal.getTime();
Date endDate = new Date();

DateRangeSearchCriteria searchCriteria = new DateRangeSearchCriteria(1, 100, startDate, endDate);
SearchResults<DeviceCommandResponseWithAsset> commandResponses = client
  .listCommandResponsesForCustomer(tenantAuthentication, token, searchCriteria);
```

### Obtener los Cambio de Estado asociados a un Customer

El siguiente ejemplo recupera las primeras 100 `DeviceStateChange`s asociadas con un `Customer`
del último año.

```java
String token = "e2ce4ffe-2d9c-4103-b519-1e07c58a2886"; // GUID for the Customer
Calendar cal = Calendar.getInstance();

cal.setTime(new Date());
cal.add(Calendar.YEAR, -1);

Date startDate = cal.getTime();
Date endDate = new Date();

DateRangeSearchCriteria searchCriteria = new DateRangeSearchCriteria(1, 10, startDate, endDate);
SearchResults<DeviceStateChangeWithAsset> stateChanges = client
  .listStateChangesForCustomer(tenantAuthentication, token, searchCriteria);
```

### Obtener el árbol de Clientes

El siguiente ejemplo obtiene la estructura de árbol de clientes.

```java
List<TreeNode> tree = client.customerTree(tenantAuthentication);
```
