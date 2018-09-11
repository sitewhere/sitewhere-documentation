---
sidebar: auto
---

# Instance Management Microservice

The instance management microservice is used to bootstrap a SiteWhere instance and is
required to be present when starting an uninitialized SiteWhere instance. The instance
management microservice also manages updates to global instance settings such as shared
database and connector configurations.

## Microservice Dependencies

- **User Management** - Required in order to bootstrap default system users based on the
  chosen instance template.
- **Tenant Management** - Required in order to bootstrap default system tenants based on
  the chosen instance template.

## Configuration Schema

[Instance Management Configuration XML Schema](http://sitewhere.io/schema/sitewhere/microservice/instance-management/current/instance-management.xsd)

### Example Configuration

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

# Zookeeper Bootstrapping

The instance management microservice is responsible for connecting to Zookeeper and
creating the base tree where all other configuration data for the instance is stored.
For more information about connectivity to Zookeeper and how the base of the configuration
tree is populated, see the [Apache Zookeper configuration guide](../zookeeper-configuration.md).

# Instance Templates

An _instance template_ is used to specify the scripts that will be executed to populate the
default users and tenants for the instance. A list of instance templates is packaged as part
of the Docker image for the instance management microservice. Each template has a JSON descriptor
that includes a unique id which may be passed if the instance is to be initialized by that
template's scripts. Below is an example of the JSON descriptor:

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

## Adding a Custom Instance Template

Additional instance templates may be added by mounting them into the filesystem of the
instance management Docker image under the templates folder.

## Changing the Instance Template

The following environment variable is used to indicate which template
will be used for initialization:

| Setting              | Environment Variable           | Default Value |
| -------------------- | ------------------------------ | ------------- |
| Instance Template Id | sitewhere.instance.template.id | default       |

::: tip
The `default` template that is packaged in the Docker image loads the default `admin` and
`noadmin` users normally expected in a new system along with a default tenant based on
the `mongo` tenant template and `construction` dataset.
:::

## Instance Data Boostrapping

If no `bootstrapped` marker is found in the `state` subfolder of Zookeeper for
the instance, the instance management microservice will attempt to use the instance
template to bootstrap the user and tenant data. It waits for the user and tenant
management microservices to start before running the scripts which push data via
the respective APIs.

Once the initialization scripts have run, the instance is considered to be initialized and
a `bootstrapped` marker is pushed to Zookeeper to prevent re-running the scripts every
time the instance starts. Removing the marker will cause the instance template data to be
loaded over the existing data, which may cause problems with duplicate key exceptions.
