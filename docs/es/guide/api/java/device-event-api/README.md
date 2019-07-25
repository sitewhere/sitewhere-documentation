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

## Obtener un Event por su Id

El siguiente ejemplo muestra cómo obtener un `DeviceEvent` por su id.

```java
String id = "someDeviceEnventId";
DeviceEventWithAsset deviceEvent = client.getDeviceEventById(tenantAuthentication, id);
```

## Obtener un Event por su Id alternativo

El siguiente ejemplo muestra cómo obtener un `DeviceEvent` por su id alternativo.

```java
String id = "someDeviceEnventId";
DeviceEventWithAsset deviceEvent = client.getDeviceEventByAlternateId(tenantAuthentication, id);
```
