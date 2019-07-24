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

For searching `Customer Types` you need to provide an instance of `CustomerTypeSearchCriteria`  to the method 
`listCustomerTypes` of `com.sitewhere.spi.ISiteWhereClient`. The example below shows how you can query SiteWhere REST API to 
list the first page of 100 results of customer types.

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
| setIncludeContainedCustomerTypes | `Boolean`   | Indicates if contained customer types are to be returned.      |

## Creating an Customer Type

For creating an `CustomerType` you need to call `createCustomerType` passing the `ITenantAuthentication` object and an
`CustomerTypeCreateRequest` build like in the folling example.

```java
String token = "e2ce4ffe-2d9c-4103-b519-1e07c58a2886"; // GUID for the Customer Type
CustomerTypeCreateRequest.Builder builder = new  CustomerTypeCreateRequest.Builder(token, "my customer type");
builder.withDescription("Some description");
CustomerTypeCreateRequest createRequest = builder.build();
// Create the Customer Type
CustomerType createdCustomerType = client.createCustomerType(tenantAuthentication, createRequest);
```

## Actualizar un existing Customer Type

For updating an `CustomerType` you need to call `updateCustomerType` passing the `ITenantAuthentication` object,
the `token` of the existing `CustomerType` and an `CustomerTypeCreateRequest` build like in the folling example.

```java
CustomerTypeCreateRequest.Builder builder = new  CustomerTypeCreateRequest.Builder(token, "my customer type");
builder.withDescription("Some description");
CustomerTypeCreateRequest updateRequest = builder.build();
// Update the Customer Type
CustomerType updatedCustomer = client.updateCustomerType(tenantAuthentication, token, updateRequest);
```

## Deleting an existing Customer Type

For deleting an existing `CustomerType` you need to call `deleteCustomerType` method of `com.sitewhere.spi.ISiteWhereClient`
providing the `token` of the customer type you want to delete, like the following example.

```java
String token = "e2ce4ffe-2d9c-4103-b519-1e07c58a2886"; // GUID for the Customer Type
CustomerType deletedCustomerType = client.deleteCustomerType(tenantAuthentication, token);
```
