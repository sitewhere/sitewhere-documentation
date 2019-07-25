# :book: Java API - Customer Types

<Seo/>

Esta sección contiene la documentación y ejemplos del end point `customertypes` de la API de Java de SiteWhere.

Este ejemplo asume que usted obtiene su autenticación del *tenant* ya sea por

```java
ITenantAuthentication tenantAuthentication = SiteWhereClient.defaultTenant();
```

o por la utilización del tenant `default`.

```java
ITenantAuthentication tenantAuthentication = SiteWhereClient.forTenant("token", "auth");
```

## Busqueda de Customer Types

Para buscar resultados de `CustomerType` se necesita una instancia de `CustomerTypeSearchCriteria` y una instancia de `CustomerTypeResponseFormat`,
las cuales serán pasadas al método `listCustomerTypes` de `com.sitewhere.spi.ISiteWhereClient`. El siguiente ejemplo muestra
como consultar la API REST de SiteWhere para listar la primer página con 100 resultados de `CustomerType`.

```java
CustomerTypeSearchCriteria searchCriteria = new CustomerTypeSearchCriteria(1, 100);
CustomerTypeResponseFormat responseFormat = new CustomerTypeResponseFormat();
SearchResults<CustomerType> results = client.listCustomerTypes(tenantAuthentication, searchCriteria, responseFormat);
```

El objeto `CustomerTypeSearchCriteria` define los criterios de búsqueda para un `CustomerType`, la siguiente tabla
muestra las propiedades, con su tipo y desdcripción, que pueden ser usadas para filtar los resultados.

| Propiedad                    | Tipo        | Descripción                                                    |
|:-----------------------------|:------------|:---------------------------------------------------------------|
| setPageNumber                | `Integer`   | Indicar el número de pagina del dataset.                       |
| setPageSize                  | `Integer`   | Indicar el número de registros por página.                     |

Además se puede controlar que información es retornada en los resultados proveyendo una instancia de
`CustomerTypeResponseFormat`. La siguiente tabla muestra las propiedades que pueden ser establecidas para controlar
el formato del resultado de la respuesta.

| Propiedad                        | Tipo        | Descripción                                                    |
|:---------------------------------|:------------|:---------------------------------------------------------------|
| setIncludeContainedCustomerTypes | `Boolean`   | Indica si los CustomerType contenidos deben ser devueltos.     |

## Obtener un Customer Type

Para obtener un `CustomerType` por su token utilice el siguiente ejemplo.

```java
String token = "e2ce4ffe-2d9c-4103-b519-1e07c58a2886"; // GUID for the Area
CustomerType customerType = client.getCustomerTypeByToken(token);
```

## Crear un Customer Type

Para crear un `CustomerType` se necesita llamar a `createCustomerType` pasando el objeto `ITenantAuthentication` y una
instancia de `CustomerTypeCreateRequest` construido como en el siguiente ejemplo.

```java
String token = "e2ce4ffe-2d9c-4103-b519-1e07c58a2886"; // GUID for the Customer Type
CustomerTypeCreateRequest.Builder builder = new  CustomerTypeCreateRequest.Builder(token, "my customer type");
builder.withDescription("Some description");
CustomerTypeCreateRequest createRequest = builder.build();
// Create the Customer Type
CustomerType createdCustomerType = client.createCustomerType(tenantAuthentication, createRequest);
```

## Actualizar un Customer Type existente

Para actualizar un `CustomerType` se necesita llamar a `updateCustomerType` pasando el objeto `ITenantAuthentication`,
el `token` de un `CustomerType` y una instancia de `CustomerTypeCreateRequest` construido como en el siguiente ejemplo.

```java
CustomerTypeCreateRequest.Builder builder = new  CustomerTypeCreateRequest.Builder(token, "my customer type");
builder.withDescription("Some description");
CustomerTypeCreateRequest updateRequest = builder.build();
// Update the Customer Type
CustomerType updatedCustomer = client.updateCustomerType(tenantAuthentication, token, updateRequest);
```

## Deleting un Customer Type existente

Para eliminar un `CustomerType` se necesita llamar a `deleteCustomerType` pasando el objeto `ITenantAuthentication` y el
`token` del `CustomerType` que se quiere eliminar, como en el siguiente ejemplo.

```java
String token = "e2ce4ffe-2d9c-4103-b519-1e07c58a2886"; // GUID for the Customer Type
CustomerType deletedCustomerType = client.deleteCustomerType(tenantAuthentication, token);
```
