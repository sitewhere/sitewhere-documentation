# Configuración de Apache Zookeeper

[Apache ZooKeeper](https://zookeeper.apache.org/) se utiliza para la administración
centralizada de la configuración de los microservicios de SiteWhere. Provee el almacenamiento
de los datos de configuración en forma de una estructura de árbol confiable y de alta performance, 
y puede ser agrupado (en cluster) para ofrecer altq disponibilidad y confiabilidad.

## Conectividad con Zookeeper

Todos los microservicios de SiteWhere depende de Zookeeper para proporcionar la información de configuración
en tiempo de ejecución. Los microservicios usan las siguientes variables de entorno y valores por defecto
para conectarse a Zookeeper:

| Configuración  | Variable de Entorno      | Valor por Defecto |
| -------------- | ------------------------ | ----------------- |
| Zookeeper Host | sitewhere.zookeeper.host | localhost         |
| Zookeeper Port | sitewhere.zookeeper.port | 2181              |

::: warning ADVERTENCIA
La configuración de Docker Compose debe pasar un nombre de host de Zookeeper que se pueda
resolver en la red Docker a la que están conectados los microservicios. Tenga en cuenta 
que las variables de entorno del Zookeeper se deben pasar para cada microservicio.
:::

Una vez conectado con Zookeeper, el microservicio de gestión de instancias (instance management)
es responsable de crear la base de la instancia del árbol de Zookeeper basado en las siguientes 
variables y valores por defecto:

| Configuración  | Variable de Entorno    | Valor por Defecto |
| -------------- | ---------------------- | ----------------- |
| Product Id     | sitewhere.product.id   | sitewhere         |
| Instance Id    | sitewhere.instance.id  | sitewhere1        |

Para los valores por defecto del sistema, el árbol de Zookeeper se encontrará en la raíz `sitewhere/sitewhere1`
y todos los demás datos de configuración de la instancia se ubicarán en relación con esa raíz. Si
varias instancias de SiteWhere deben ejecutarse al mismo tiempo utilizando el mismo clúster de Zookeeper,
deberían proporcionar valores diferentes para `sitewhere.instance.id` para que los datos de configuración
no se superpongan. Esto se puede lograr configurando la variable de entorno `sitewhere.instance.id`
a través de la configuración Docker Compose.

::: warning ADVERTENCIA
Todos los microservicios destinados a ejecutarse en la misma instancia deben usar el mismo
valores para `sitewhere.product.id` y `sitewhere.instance.id`.
:::

Si utiliza Zookeeper dentro de una configuración de Docker Compose, la carpeta de datos de
Zookeeper debe asignarse a un volumen local para que no se pierda cuando el servicio es
detenido. Las recetas de infraestructura de SiteWhere tienen un volumen común de datos compartidos
que se usa para almacenar datos persistentes de todos los servicios, como Zookeeper,
Kafka, y varias bases de datos. El volumen de datos puede ser eliminado para comenzar
con un sistema "limpio".
