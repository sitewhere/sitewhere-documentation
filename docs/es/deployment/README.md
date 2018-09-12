# Guia de Despliegue de SiteWhere

Esta guía cubre el proceso de despliegue de SiteWhere 2.0 que ha cambiado
significativamente del utilizado para SiteWhere 1.x. Mientras que las versiones anteriores
de SiteWhere se desplegaban en un único servidor, la arquitectura de SiteWhere 2.0
se basa en muchos microservicios que se despliegan en la infraestrutura de
[Docker](https://www.docker.com/).

## Requerimientos del Sistema

Como SiteWhere 2.0 usa una arquitectura de microservicios, la cantidad de
procesos que se ejecutan simultáneamente ha aumentado, lo que a su vez requiere
más memoria y potencia de procesamiento. Las especificaciones mínimas de hardware
para una sola máquina que ejecuta una instancia de SiteWhere es:

| Recurso       | Valor Min |
| ------------- | --------- |
| Memoria       | 16GB RAM  |
| CPU           | 2 CPUs    |
| Hard Disk/SSD | 80GB      |

Al distribuir microservicios en varias máquinas usando
[Docker Swarm](https://github.com/docker/swarm) u otra orquestación
tecnologías, los requisitos por máquina pueden ser más bajos ya que la carga
esta distribuido.

Otra consideración al implementar SiteWhere es si las instancias
[Apache Kafka](https://kafka.apache.org/) y [Apache ZooKeeper](https://zookeeper.apache.org/) 
se están ejecutando en Docker o administrado por separado. En entornos de producción, Kafka y
los clústeres de ZooKeeper se deben administrar externamente de la instancia de SiteWhere
utilizando las mejores prácticas definidas por las tecnologías individuales. El equipo de
SiteWhere lanzará más información sobre topologías preferidas a medida que la arquitectura 2.0
se acerque a disponibilidad general.

## Instalar Docker y Docker Compose

SiteWhere 2.0 utiliza Docker como el modelo de implementación principal ya que la tecnología
es compatible con todos los principales entornos de nube, además de ser fácil de
uso para instalaciones locales (on-premises). Para instalaciones de una sola máquina, Docker
Engine se puede instalar según el proceso detallado en el siguiente enlace:

[Install Docker Engine](https://docs.docker.com/engine/installation/)

### Instalar Docker Compose

Además de Docker Engine, se debe instalar alguna forma de motor de orquestación
para permitir que se implementen muchos servicios Docker a la vez en lugar de hacerlo manualmente
desplegándolos individualmente. En las implementaciones de producción, SiteWhere 2.0 aprovechará
el nuevo soporte [stack](https://docs.docker.com/engine/reference/commandline/stack_deploy/)
de Docker Swarm para iniciar el sistema. Para una instalación local, a menudo es más fácil de usar
[Docker Compose](https://docs.docker.com/compose/install/) que proporciona un sencillo
metodología para implementar muchos servicios a la vez al agregar registros a la consola
para una depuración más fácil. Comience por descargar e instalar Docker Compose como se detalla a continuación:

[Install Docker Compose](https://docs.docker.com/compose/install/)

### Habilitar el Modo Swarm

Algunos aspectos del proceso de despliegue requieren funciones como redes superpuestas que
solo están disponibles en Docker Swarm. Dado que Swarm está incluido en Docker Engine,
se puede habilitar y usar en implementaciones locales de una sola máquina sin la necesidad
de construir topologías más complejas. Habilite el modo Swarm con el siguiente comando:

```sh
docker swarm init
```

## Utilizar las Recetas de SiteWhere para Construir una Instancia

Dado que la arquitectura y la configuración del sistema para SiteWhere permiten
muchas combinaciones diferentes de componentes para desarrollar sistemas personalizados,
el equipo de SiteWhere proporciona una lista de _recetas_ para configuraciones comunes
del sistema que actúan como punto de partida para crear instancias. El repositorio de las
recetas de SiteWhere 2.0 se puede acceder a través del siguiente enlace:

[SiteWhere Recipes Repository](https://github.com/sitewhere/sitewhere-recipes)

### Clonar el Repositorio de las Recetas

Abra un terminal y comience por clonar el repositorio de recetas en la máquina
donde tiene configurado el entorno Docker. El repositorio puede ser clonado
con el siguiente comando:

```sh
git clone https://github.com/sitewhere/sitewhere-recipes.git
```

Una vez que se haya clonado el repositorio, navegue hasta el subdirectorio **sitewhere-recipes/docker-compose**.
Este directorio contiene configuraciones de muestra para muchos escenarios comunes de implementación de SiteWhere.

### Iniciar los Servicios de Infraestructura

Para emular mejor un entorno de producción, se proporcionan recetas separadas para
servicios de infraestructura como Apache ZooKeeper, Kafka, corredores de MQTT, bases de datos
y otros componentes que no pertenecen a SiteWhere. Para iniciar los contenedores de infraestructura,
vaya al subdirectorio **sitewhere-recipes/docker-compose/infrastructure_default** (o uno de las otras
recetas según qué componentes se deben cargar). Ejecute el siguiente comando que iniciará la infraestructura en función de la configuración descrita en el **docker-compose.yml** archivo.

```sh
docker-compose up
```

### Iniciar los Microservicios de SiteWhere

En una terminal separada, navegue hasta el subdirectorio **sitewhere-recipes/docker-compose/default**.
Esta receta contiene todos los microservicios de SiteWhere y espera que los otros servicios de infraestructura
ya se estén ejecutandose. Al igual que con la receta de infraestructura, ejecute el siguiente comando para iniciar SiteWhere:

```sh
docker-compose up
```

Docker Compone comenzará a lanzar los microservicios de SiteWhere. El registro de salida es una
combinación de la salida para todos los microservicios individuales y las tecnologías de soporte.

### Registro de Salida del Sistema

El registro de salida de SiteWhere 2.x es significativamente diferente de 1.x debido a
la naturaleza distribuida del sistema y al hecho de que cada microservicio se ejecuta
en un proceso Java por separado. Los microservicios pueden comenzar en cualquier orden y
usar Apache ZooKeeper como punto central de coordinación. En muchos casos, existen dependencias
entre los microservicios, como la necesidad de arrancar datos del sistema o proporcionar acceso
a partes del modelo de datos. Mensajes de registro como
**Waiting for tenant management API to become available** son comunes durante el proceso de arranque.
Para obtener información más detallada sobre el proceso de inicio del sistema, consulte el documento
[inicio y arranque](../guide/README.md).
