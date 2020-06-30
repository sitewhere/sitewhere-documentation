# Guía de Despliegue

<Seo/>

SiteWhere es un sistema distribuido que se implementa en una arquitectura de microservicio y 
se orquesta usando una infraestructura [Kubernetes](https://kubernetes.io/). SiteWhere usa 
[Helm](https://helm.sh/) para proporcionar un enfoque simple y parametrizado para iniciar y 
configurar el sistema. Un repositorio separado [sitewhere-k8s](https://github.com/sitewhere/sitewhere-k8s) 
contiene los gráficos Helm, que se lanzan independientemente del ciclo de vida de la plataforma central.

Esta guía cubre los artefactos y procesos invocados en la implementación de una instancia de SiteWhere, 
incluidos los componentes de infraestructura, las tecnologías de persistencia de datos y los microservicios 
que implementan la funcionalidad del sistema.

## Prerrequisitos

- Kubernetes 1.8+
- Rook v0.9+

## Detalles de Helm Charts

El SiteWhere Helm chart cubre las siguientes áreas funcionales:

- [SiteWhere Core Infrastructure](https://github.com/sitewhere/sitewhere-k8s/tree/master/charts/sitewhere-infra-core) (e.g. Kafka, Zookeeper)
- [SiteWhere Database Infrastructure](https://github.com/sitewhere/sitewhere-k8s/tree/master/charts/sitewhere-infra-database) (e.g. MongoDB, InfluxDB, Cassandra)
- [SiteWhere Microservices](https://github.com/sitewhere/sitewhere-k8s/tree/master/charts/sitewhere) (Core system microservices)

Tenga en cuenta que los gráficos de infraestructura se empaquetan por separado y se incluyen como 
dependencias para el gráfico primario de SiteWhere.

## Instalando el Helm Chart

### Agregar el Repositorio Helm de SiteWhere

Antes de instalar los SiteWhere Helm charts, agregar el
[repositorio Helm SiteWhere](https://sitewhere.io/helm-charts/index.yaml)
a su cliente Helm.

```bash
helm repo add sitewhere https://sitewhere.io/helm-charts
```

Después, actualice su repositorio local de Helm para extraer la información más reciente del chart.

```bash
helm repo update
```

### Instalar el Chart de SiteWhere

Para instalar el chart con el nombre de la versión `sitewhere` ejecute:

```bash
helm install --name sitewhere sitewhere/sitewhere
```

Consulte [Problemas comunes](./common-issues.md) si tiene un problema con la implementación de SiteWhere.

### Instalar en una Máquina de Desarrollador

Puede instalar SiteWhere en una máquina de desarrollador, utilizando la configuración no HA de MongoDB, 
Apache Kafka y Apache Zookeeper. Para hacer esto, necesita clonar el repositorio `sitewhere-k8s`, usando

```bash
git clone https://github.com/sitewhere/sitewhere-k8s.git
```
Para instalar una versión del chart SiteWhere que utiliza componentes con menos disponibilidad para 
reducir la huella de memoria y el tiempo de inicio, utilice el siguiente comando en su lugar.
Entonces, en la carpeta `charts` ejecute el comando:

```bash
helm install --name sitewhere \
  -f ./sitewhere/dev-values.yaml \
  sitewhere
```

### Eliminar Helm Chart Instalados

El siguiente comando elimina los artefactos agregados con la instalación del chart SiteWhere 
y libera el nombre del chart `sitewhere` para su reutilización.

```bash
helm del sitewhere --purge
```

Esto eliminará la infraestructura de sitio y microservicios.

### Eliminar Datos de SiteWhere

Para eliminar los Persistence Volume Claims de SiteWhere, ejecute el comando:

```bash
kubectl delete pvc -l release=sitewhere
```

## Instalar Administrador de Kafka

Asumiendo que el nombre de instalación de su sitio es `sitewhere`

```bash
helm install --name kafka-manager \
  --set zkHosts=sitewhere-zookeeper:2181 stable/kafka-manager
```

Port-forward Kafka Manager UI

```bash
kubectl port-forward deployment/kafka-manager-kafka-manager 9000 9000
```
