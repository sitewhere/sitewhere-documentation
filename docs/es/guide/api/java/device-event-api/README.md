# :book: Java API - Device Events

<Seo/>

Esta sección contiene la documentación y ejemplos del end point `events` de la API de Java de SiteWhere.

Este ejemplo asume que usted obtiene su autenticación del *tenant* ya sea por

```java
ITenantAuthentication tenantAuthentication = SiteWhereClient.defaultTenant();
```

o por la utilización del tenant `default`.

```java
ITenantAuthentication tenantAuthentication = SiteWhereClient.forTenant("token", "auth");
```

## Getting a Device Event by its Id

The following example shows how to get a `DeviceEvent` by its id.

```java
String id = "someDeviceEnventId";
DeviceEventWithAsset deviceEvent = client.getDeviceEventById(tenantAuthentication, id);
```

## Getting a Device Event by its Alternate Id

The following example shows how to get a `DeviceEvent` by its alternate id.

```java
String id = "someDeviceEnventId";
DeviceEventWithAsset deviceEvent = client.getDeviceEventByAlternateId(tenantAuthentication, id);
```
