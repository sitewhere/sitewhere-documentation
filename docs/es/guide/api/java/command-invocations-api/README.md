# :book: Java API - Command Invocations

<Seo/>

Esta sección contiene la documentación y ejemplos del end point `invocations` de la API de Java de SiteWhere.

Este ejemplo asume que usted obtiene su autenticación del *tenant* ya sea por

```java
ITenantAuthentication tenantAuthentication = SiteWhereClient.defaultTenant();
```

o por la utilización del tenant `default`.

```java
ITenantAuthentication tenantAuthentication = SiteWhereClient.forTenant("token", "auth");
```

## Obtener un Command Invocation por Id

El siguiente ejemplo muestra como obtener un `DeviceCommandInvacation` por su Id

```java
String id = "someCommandInvocationId"; // Id of the command invocation
DeviceCommandInvocation commandInvocation = client.getDeviceCommandInvocation(tenantAuthentication, id);
```

## Obtener un Command Invocation Summary por Id

El siguiente ejemplo muestra como obtener un `DeviceCommandInvocationSummary` por su Id

```java
String id = "someCommandInvocationId"; // Id of the command invocation
DeviceCommandInvocationSummary commandInvocationSummary = client.getDeviceCommandInvocationSummary(tenantAuthentication, id);
```

## Listar las Respuesta a Comandos para un Command Invocation

El siguiente ejemplo muestra cómo listar las `DeviceCommandResponse` para un `DeviceCommandInvacation`.

```java
String id = "someCommandInvocationId"; // Id of the command invocation
SearchResults<DeviceCommandResponse> results = client.listCommandResponsesForCommandInvocation(tenantAuthentication, id);
```
