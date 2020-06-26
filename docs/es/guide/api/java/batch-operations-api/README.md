# Java API - Batch Operations

<Seo/>

Esta sección contiene la documentación y ejemplos del end point `batch` de la API de Java de SiteWhere.

Este ejemplo asume que usted obtiene su autenticación del _tenant_ ya sea por

```java
ITenantAuthentication tenantAuthentication = SiteWhereClient.defaultTenant();
```

o por la utilización del tenant `default`.

```java
ITenantAuthentication tenantAuthentication = SiteWhereClient.forTenant("token", "auth");
```

## Busqueda de Batch Operations

Para buscar resultados de `BatchOperation` se necesita una instancia de `BatchOperationSearchCriteria`,
las cuales serán pasadas al método `listBatchOperations` de `com.sitewhere.spi.ISiteWhereClient`. El siguiente ejemplo muestra
como consultar la API REST de SiteWhere para listar la primer página con 100 resultados de `BatchOperation`.

```java
BatchOperationSearchCriteria searchCriteria = new BatchOperationSearchCriteria(1, 100);
SearchResults<BatchOperation> batchOperations =
  client.listBatchOperations(tenantAuthentication, searchCriteria);
```

## Obtener un Batch Operations

Para obtener un `BatchOperation` por su token utilice el siguiente ejemplo.

```java
String token = "e2ce4ffe-2d9c-4103-b519-1e07c58a2886"; // GUID for the Batch Operation
BatchOperation batchOperation = client.getBatchOperationByToken(tenantAuthentication, token);
```

## Crear un Batch Operation

Para crear un `BatchOperation` se necesita llamar a `createBatchCommandInvocation` pasando el objeto `ITenantAuthentication` y una
instancia de `BatchCommandInvocationRequest` construido como en el siguiente ejemplo.

```java
String token = "e2ce4ffe-2d9c-4103-b519-1e07c58a2886"; // GUID for the Batch Operation
BatchCommandInvocationRequest request = BatchCommandInvocationRequest.newBuilder()
  .withToken(token)
  .withCommandToken("ping")
  .addDeviceToken("15737-UNO-7576364")
  .parameter("host", "localhost")
  .build();

BatchOperation batchOperation =
  client.createBatchCommandInvocation(tenantAuthentication, request);
```

## Listing the elements of a Batch Operation

Para listar los elementos de un `BatchOperation` se necesita llamar a `listBatchOperationElements` pasando
el objeto `ITenantAuthentication` y el token del `BatchOperation`.

```java
String token = "e2ce4ffe-2d9c-4103-b519-1e07c58a2886"; // GUID for the Batch Operation
SearchResults<BatchElement> batchElements =
  client.listBatchOperationElements(tenantAuthentication, token);
```
