# Guia de Despliegue de SiteWhere

Esta guía cubre el proceso de despliegue de SiteWhere 2.0 que ha cambiado
significativamente del utilizado para SiteWhere 1.x. Mientras que las versiones anteriores
de SiteWhere se desplegaban en un único servidor, la arquitectura de SiteWhere 2.0
se basa en muchos microservicios que se despliegan un cluster
[Kubernetes](https://https://kubernetes.io).

## Requerimientos del Sistema

Debido a que SiteWhere 2.0 utiliza una arquitectura de microservicios,
la cantidad de procesos que se ejecutan simultáneamente ha aumentado,
lo que a su vez requiere más memoria y capacidad de procesamiento.
Las especificaciones mínimas de hardware para un clúster Kubernete de
un solo nodo que ejecuta una instancia de SiteWhere son:

| Recurso       | Valor Min |
| ------------- | --------- |
| Memoria       | 16GB RAM  |
| CPU           | 2 CPUs    |
| Hard Disk/SSD | 80GB      |

Para entornos productivos, recomendamos utilizar un cluster con al menos tres
nodos `workers`, cada uno con similares características de la tabla de arriba.
Cuando se distribuyen microservicios a través de múltiples nodos en el clúster
[Kubernetes](https://kubernetes.io), los requisitos por nodo pueden ser menores
ya que la carga está distribuida.

Otra consideración al implementar SiteWhere es si las instancias de
[Apache Kafka](https://kafka.apache.org/) y [Apache ZooKeeper](https://zookeeper.apache.org/)
se ejecutan en Kuberntes o se administran por separado. En entornos de producción,
los clusters de Kafka y ZooKeeper deben administrarse externamente desde la instancia
de SiteWhere utilizando las mejores prácticas definidas por las tecnologías individuales.
El equipo de SiteWhere lanzará más información sobre las topologías preferidas a medida
que la arquitectura 2.0 se acerque a la disponibilidad general.

## Instalar Kubernetes

SiteWhere 2.0 utiliza Kubernetes como tecnología de orquestación de contenedores de
para producción, la cual es admitida en los principales entornos de nube.
Para instalaciones de un solo nodo, Minikube se puede instalar según el proceso
detallado en el siguiente enlace:

[Instalar Minikube](https://kubernetes.io/docs/setup/minikube/)

Para la instalación de otras configuraciones, utilizar el siguiente link:

[Instalar Kubernetes](https://kubernetes.io/docs/setup/)

## Utilizar las Recetas de SiteWhere para Construir una Instancia

Dado que la arquitectura y la configuración del sistema para SiteWhere permiten
muchas combinaciones diferentes de componentes para desarrollar sistemas personalizados,
el equipo de SiteWhere proporciona una lista de recetas para configuraciones comunes del
sistema que actúan como punto de partida para crear instancias. El repositorio de las recetas
de SiteWhere 2.0 se puede acceder a través del siguiente enlace:

[Repositorio de Recetas de SiteWhere](https://github.com/sitewhere/sitewhere-recipes)

### Clonar el Repositorio de las Recetas

Abra un terminal y comience por clonar el repositorio de recetas en la máquina
donde tiene configurado el entorno Docker. El repositorio puede ser clonado
con el siguiente comando:

```sh
git clone https://github.com/sitewhere/sitewhere-recipes.git
```

Una vez que se haya clonado el repositorio, navegue hasta el subdirectorio **sitewhere-recipes/charts**.
Este directorio contiene los Helm Charts y recursos de Kuberntes para los escenarios de despliegue
de SiteWhere.

## Instalar Helm

SiteWhere 2.0 se puede implementar en un cluster en ejecución Kubernetes. Proporcionamos un [Helm](https://helm.sh/) Chart,
como parte de las recetas de SiteWhere, para instalar SiteWhere en Kubernetes.

Para poder implementar SiteWhere, Helm necesita ser instalado. Siga las instrucciones de
[este](https://docs.helm.sh/using_helm/#installing-helm) artículo para instalar Helm en su máquina.

## Instalar Rook

Si necesita servicios de almacenamiento de archivos, bloques y objetos para sus entornos nativos en la nube,
instale [Rook Ceph](https://rook.io), con los siguientes comandos:

```sh
kubectl create -f rook/operator.yaml
kubectl create -f rook/cluster.yaml
kubectl create -f rook/storageclass.yaml
```

## Iniciar SiteWhere

Para instalar con la configuración por defecto, ejecute:

```sh
helm install --name sitewhere ./sitewhere
```

Además, si desea ejecutar SiteWhere en un clúster de bajos recursos, use las recetas mínimas
e instale este Helm Chart con el siguiente comando:

```sh
helm install --name sitewhere --set services.profile=minimal ./sitewhere
```

Si no necesita Rook.io, puede omitir la instalación de Rook.io e instalar SiteWhere Helm Chart
configurando la propiedad `persistence.storageClass` en otra que no sea `rook-ceph-block`,
por ejemplo, para usar el Persistence Storage Class `hostpath`, use el siguiente comando:

```sh
helm install --name sitewhere --set persistence.storageClass=hostpath ./sitewhere
```

## Desinstalar SiteWhere

Para quitar SiteWhere del cluster Kubernetes utilizando Helm, ejecute el siguiente comando:

```sh
helm del --purge sitewhere
```

## Desintalar Rook

Para desinstalar Rook Ceph, eche un vistazo a este [documento](https://rook.io/docs/rook/v0.8/ceph-teardown.html),
y siga las instrucciones sobre cómo desinstalar Rook Ceph de Kuberntes.

