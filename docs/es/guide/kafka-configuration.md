# Configuración de Apache Kafka

[Apache Kafka](https://kafka.apache.org/) es utilizado por SiteWhere para proporcionar una
tubería de procesamiento de datos de alto rendimiento entre microservicios. Kafka depende de
Apache Zookeeper para guardar su estado y generalmente está configurado para compartir
la misma instancia de Zookeeper utilizada para almacenar datos de configuración de SiteWhere.

## Conectividad con Kafka

Todos los microservicios de SiteWhere tienen cierto nivel de dependencia en Kafka y deben
configurarse para acceder al clúster compartido de Kafka. Los microservicios usan las
siguientes variables de entorno y valores por defecto para conectarse a Kafka:

| Configuración           | Variable de Entorno               | Valor por Defecto |
| ----------------------- | --------------------------------- | ----------------- |
| Kafka Bootstrap Servers | sitewhere.kafka.bootstrap.servers | kafka:9092        |

La información que Kafka usa para conectarse a Zookeeper está configurada en el descriptor
de serivcios del archivo Docker Compose (o en la configuración de Kafka si no se ejecuta
Kafka dentro de Docker).

## Persistencia de Datos de Kafka

Si usa Kafka dentro de una configuración Docker Compose, la carpeta de datos de Kafka
debe asignarse a un volumen local para que no se pierda cuando el servicio es
detenido. Las recetas de infraestructura de SiteWhere tienen un volumen común de datos compartidos
que se usa para almacenar datos persistentes de todos los servicios, como Zookeeper,
Kafka, y varias bases de datos. El volumen de datos puede ser eliminado para comenzar
con un sistema "limpio".
