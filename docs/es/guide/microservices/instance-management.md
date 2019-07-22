# :book: Microservicio Instance Management

<Seo/>

El microservicio de gestión de instancias (_instance management_) se utiliza para iniciar
una instancia de SiteWhere y se requiere que esté presente cuando se inicia una instancia
SiteWhere no iniciada. El microservicio de gestión de instancias también gestiona las
actualizaciones de configuraciones de instancias globales, como la base de datos compartida
y las configuraciones de los conectores.

## Dependencias del Microservicio

- **User Management** - Requerido para iniciar los usuarios por defecto del sistema en
  función de la plantilla de instancia elegida.

- **Tenant Management** - Requerido para iniciar el _tenant_ por defector del sistemas
  basado en la plantilla de instancia elegida.

## Esquema de Configuración

[Instance Management Configuration XML Schema](http://sitewhere.io/schema/sitewhere/microservice/instance-management/current/instance-management.xsd)

### Ejemplo de Configuración

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:context="http://www.springframework.org/schema/context"
  xmlns:im="http://sitewhere.io/schema/sitewhere/microservice/instance-management"
  xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans-3.1.xsd
  http://www.springframework.org/schema/context http://www.springframework.org/schema/context/spring-context-3.1.xsd
  http://sitewhere.io/schema/sitewhere/microservice/instance-management
  http://sitewhere.io/schema/sitewhere/microservice/instance-management/current/instance-management.xsd">
  <!-- Allow property placeholder substitution -->
  <context:property-placeholder />
  <!-- Instance global configuration -->
  <im:instance-management>
    <!-- Reusable persistence configurations -->
    <im:persistence-configurations>
      <!-- MongoDB global configuration management -->
      <im:mongodb-configurations>
        <!-- Configuration used for global services -->
        <im:mongodb-configuration id="global"
          hostname="${mongodb.host:mongodb}"
          port="${mongodb.port:27017}"
          databaseName="${mongodb.database:sitewhere}"
          replicaSetName="${mongodb.replicaset:}" />
        <!-- Configuration used for tenant microservices -->
        <im:mongodb-configuration id="tenant"
          hostname="${mongodb.host:mongodb}"
          port="${mongodb.port:27017}"
          databaseName="${mongodb.tenant.prefix:tenant-[[tenant.id]]}"
          replicaSetName="${mongodb.replicaset:}" />
      </im:mongodb-configurations>
      <!-- InfluxDB global configuration management -->
      <im:influxdb-configurations>
        <!-- Default configuration for InfluxDB data access -->
        <im:influxdb-configuration id="tenant"
          hostname="${influxdb.host:influxdb}"
          port="${influxdb.port:8086}"
          database="${influxdb.database:[[tenant.id]]}" />
      </im:influxdb-configurations>
      <!-- Apache Cassandra global configuration management -->
      <im:cassandra-configurations>
        <im:cassandra-configuration id="tenant"
          contactPoints="${cassandra.contact.points:cassandra}"
          keyspace="${cassandra.keyspace:tenant_[[tenant.id]]}" />
      </im:cassandra-configurations>
    </im:persistence-configurations>
    <!-- Global connector configurations -->
    <im:connector-configurations>
    </im:connector-configurations>
  </im:instance-management>
</beans>
```

## Inicio de Zookeeper

El microservicio de gestión de instancias es responsable de conectarse con Zookeeper y crear
el árbol base donde se almacenan todos los demás datos de configuración para la instancia.
Para obtener más información sobre la conectividad con Zookeeper y cómo se completa la base 
del árbol de configuración, consulte la [Configuración de Apache Zookeper](../zookeeper-configuration.md).

## Plantillas de Instancia

Una _plantilla de instancia_ se usa para especificar las secuencias de comandos que se ejecutarán
para rellenar los usuarios y tenants predeterminados para la instancia. Una lista de plantillas de
instancia se empaqueta como parte de la imagen de Docker para el microservicio de gestión de instancias.
Cada plantilla tiene un descriptor JSON que incluye una identificación única que se puede pasar si
la instancia debe ser inicializada por los scripts de esa plantilla. A continuación se muestra un
ejemplo del descriptor JSON:

```json
{
  "id": "default",
  "name": "Default",
  "initializers": {
    "userManagement": ["scripts/groovy/initializer/userModel.groovy"],
    "tenantManagement": ["scripts/groovy/initializer/tenantModel.groovy"]
  }
}
```

### Agregar Plantillas de Instancia Personalizadas

Se pueden agregar plantillas de instancias adicionales montándolas en el sistema de
archivos de la imagen Docker de _instance management_ debajo de la carpeta de _templates_.

### Cambiar la Plantilla de Instancia

La siguiente variable de entorno se usa para indicar qué plantilla se utilizará para
la inicialización:

| Configuración          | Variable de Entorno            | Valor por Defecto |
| ---------------------- | ------------------------------ | ----------------- |
| Id Plantilla Instancia | sitewhere.instance.template.id | default           |

::: tip AVISO
La plantilla `default` que se empaqueta en la imagen Docker carga los usuarios predeterminados
`admin` y `noadmin` que normalmente se esperan en un nuevo sistema junto con un _tenant_ por
defecto basado en el tenant `mongo` y el dataset `construction`.
:::

### Instance Data Boostrapping

Si no se encuentra un marcador `bootstrapped` en la subcarpeta `state` de Zookeeper para la instancia,
el microservicio de gestión de instancias intentará utilizar la plantilla de instancia para iniciar
los datos del usuario y del tenat. Espera a que los microservicios de gestión de usuarios
(_user management_) y de tenants (_tenant management_) comiencen antes de ejecutar los scripts que
envían datos a través de las respectivas API.

Una vez que se han ejecutado los scripts de inicialización, se considera que la instancia se ha
inicializado y un marcador `bootstrapped` se envía al Zookeeper para evitar que se vuelvan a ejecutar
los scripts cada vez que se inicia la instancia. Al eliminar el marcador, los datos de la plantilla
de instancia se cargarán sobre los datos existentes, lo que puede causar problemas con las excepciones
de clave duplicadas.
