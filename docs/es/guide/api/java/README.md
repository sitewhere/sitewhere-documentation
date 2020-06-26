# Usando la API Java de SiteWhere

<Seo/>

El equipo de SiteWhere provee una API Java para acceder a la API REST de una Instancia de SiteWhere.
Esta guía muestra cómo usar la API Java de SiteWhere para interactuqr con una Instancia de SiteWhere.

## Importar la Librería

La librería de SiteWhere Java Client library está publicada en [Maven Central](https://search.maven.org/search?q=a:sitewhere-java-client)
para ser utilizada con las herramientas de administración de dependencias, como ser Apache Maven o Gradle.

Si utiliza [Apache Maven](https://maven.apache.org/), agregue la siguiente dependencias en su `pom.xml`.

```xml
<dependency>
    <groupId>com.sitewhere</groupId>
    <artifactId>sitewhere-java-client</artifactId>
    <version>2.1.x</version>
</dependency>
```

Si utilizar [Gradle](https://gradle.org/), agregue la siguiente dependencias en su `build.gradle`.

```groovy
implementation 'com.sitewhere:sitewhere-java-client:2.1.x'
```

## Creando una instancia del client

Una nueva instancia del cliente con la configuración por defecto puede ser creada de la siguiente manera:

```java
ISiteWhereClient client = SiteWhereClient.newBuilder()
    .build().initialize();
```

La configuración por defecto es:

| Attribute | Value     |
| :-------- | :-------- |
| Protocol  | HTTP      |
| Hostname  | localhost |
| Port      | 80        |
| Username  | admin     |
| Password  | password  |

::: warning
Desde SiteWhere 2.1.x el `Port` por defecto ha cambiado de 8080 a 80.
:::

Note que el método `initialize()` debe ser llamado antes de utilizar el cliente. Éste configura
los templates y se conecta al servidor para obtener un _JWT_.

Para cambiar los valores por defecto de la conexión, utilice:

```java
SiteWhereClient client = SiteWhereClient.newBuilder()
    .withConnectionTo("https", "myhost", 8081)
    .build().initialize();
```

Par conectarse utilizando un usuario diferente, utilice:

```java
SiteWhereClient client = SiteWhereClient.newBuilder()
    .forUser("myuser", "mypassword")
    .build().initialize();
```

## Interactuando con el Modelo de Objectos de SiteWhere

Una vez que el cliente ha sido inicializado, se puede invocar a los métodos del mismo para
interactuar con el modelo de objetos de SiteWhere en la instancia remota. Existen dos tipo
de llamadas o métodos, los métodos **globales** y los métodos **específicos del tenant**.

La siguiete imánge muestra un Diagrama de Clases UML del Modelo de Objeto de SiteWhere el cual
puede ayudar en la comprensión de los componentes del sistema.

<InlineImage src="/images/guide/api/object-model.png" caption="SiteWhere Object Model UML Class Diagram"/>

### Llamadas Globales

Para las llamadas globales no es requerida información extra para poder hacer la invocación.

La siguiente es la lista de llamadas **Globales** de la API de SiteWhere:

- [System API](./system-api/)
- [Users API](./user-api/)
- [Tenant API](./tenant-api/)

### Llamadas Específicas del Tenant

Para las llamadas que son específicas de los tenant, se debe proveer información relativa al tenant para
poder realizar la invocación al método. Se debe proveer el id del tenant y el token de autenticación del mismo,
los cual son provistos por las cabeceras de las llamadas REST (junto con el JWT usado para todas las llamadas).

La siguiente es la lista de llamadas **Específicas del Tenant** de la API de SiteWhere:

- [Area API](./area-api/)
- [Area Type API](./area-type-api/)
- [Asset API](./asset-api/)
- [Asset Type API](./asset-type-api/)
- [Batch Operations API](./batch-operations-api/)
- [Command Invocation API](./command-invocations-api/)
- [Customer API](./customer-api/)
- [Customer Type API](./customer-type-api/)
- [Device API](./device-api/)
- [Device Assignment API](./assignment-api/)
- [Device Command API](./device-command-api/)
- [Device Event API](./device-event-api/)
- [Device Group API](./device-group-api/)
- [Device State API](./device-state-api/)
- [Device Status API](./device-state-api/)
- [Device Type API](./device-type-api/)
- [Schedule API](./schedule-api/)
- [Scheduled Job API](./scheduled-job-api/)
- [Zone API](./zone-api/)
