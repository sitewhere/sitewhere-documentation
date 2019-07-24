# :book: Java API - Device Groups

<Seo/>

Esta sección contiene la documentación y ejemplos del end point `devicegroups` de la API de Java de SiteWhere.

Este ejemplo asume que usted obtiene su autenticación del *tenant* ya sea por

```java
ITenantAuthentication tenantAuthentication = SiteWhereClient.defaultTenant();
```

o por la utilización del tenant `default`.

```java
ITenantAuthentication tenantAuthentication = SiteWhereClient.forTenant("token", "auth");
```

## Busqueda de Device Groups

For searching `DeviceGroup` you need to provide an instance of `DeviceGroupSearchCriteria` to the method
`listDeviceGroups` of `com.sitewhere.spi.ISiteWhereClient`. The example below shows how you can query SiteWhere
REST API to list the first page of 100 results of device groups.

```java
DeviceGroupSearchCriteria searchCriteria = new DeviceGroupSearchCriteria(1, 100);
SearchResults<DeviceGroup> results = client.listDeviceGroups(tenantAuthentication, searchCriteria);
```

`DeviceGroupSearchCriteria` defines the search criteria for quering `DeviceGroup`, the following table shows the properties, with 
thier type and description, that can be set to filter the results.

| Propiedad              | Tipo        | Descripción                                                    |
|:-----------------------|:------------|:---------------------------------------------------------------|
| getRole                | `String`    | Limits search by a given role.                                 |
| setPageNumber          | `Integer`   | Indicar el número de pagina del dataset.                       |
| setPageSize            | `Integer`   | Indicar el número de registros por página.                     |

## Obtener un Device Group

Para obtener un `DeviceGroup` por su token utilice el siguiente ejemplo.

```java
String token = "e2ce4ffe-2d9c-4103-b519-1e07c58a2886"; // GUID for the DeviceGroup
DeviceGroup deviceGroup = client.getDeviceGroupByToken(token);
```

## Creating an Device Group

For creating an `DeviceGroup` you need to call `createDeviceGroup` passing the `ITenantAuthentication` object and an
`DeviceGroupCreateRequest` build like in the folling example.

```java
String token = "e2ce4ffe-2d9c-4103-b519-1e07c58a2886"; // GUID for the DeviceGroup
String name = "test group";
DeviceGroupCreateRequest.Builder builder = new DeviceGroupCreateRequest.Builder(token, name);
builder.withRole("primary");
builder.withDescription("Some description");
// Build the Create Request
DeviceGroupCreateRequest createRequest = builder.build();
// Create the DeviceGroup
DeviceGroup createdDeviceGroup = client.createDeviceGroup(tenantAuthentication, createRequest);
```

## Actualizar un existing Device Group

For updating an `DeviceGroup` you need to call `updateDeviceGroup` passing the `ITenantAuthentication` object,
the `token` of the existing `DeviceGroup` and an `DeviceGroupCreateRequest` build like in the folling example.

```java
String token = "e2ce4ffe-2d9c-4103-b519-1e07c58a2886"; // GUID for the DeviceGroup
String name = "test group";
DeviceGroupCreateRequest.Builder builder = new DeviceGroupCreateRequest.Builder(token, name);
builder.withRole("primary");
builder.withDescription("Some updated description");
// Build the Create Request
DeviceGroupCreateRequest updateRequest = builder.build();
// Update the DeviceGroup
DeviceGroup updatedDeviceGroup = client.updateDeviceGroup(tenantAuthentication, token, updateRequest);
```

## Deleting an existing Device Group

For deleting an existing `DeviceGroup` you need to call `deleteDeviceGroup` method of `com.sitewhere.spi.ISiteWhereClient`
providing the `token` of the device group you want to delete, like the following example.

```java
String token = "e2ce4ffe-2d9c-4103-b519-1e07c58a2886"; // GUID for the DeviceGroup
DeviceGroup deletedDeviceGroup = client.deleteDeviceGroup(tenantAuthentication, token);
```
