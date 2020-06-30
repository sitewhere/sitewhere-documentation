# Instalando una Instancia de SiteWhere

<Seo/>

Esta guía cubre el proceso de implementación de SiteWhere 2.1 que ha cambiado significativamente 
del utilizado para SiteWhere 1.x. Si bien las versiones anteriores de SiteWhere se implementaron 
como un solo nodo de servidor, la arquitectura de SiteWhere 2.1 se basa en muchos microservicios 
que se despliegan en una infraestructura [Kubernetes](https://kubernetes.io).

<InlineImage src="/images/deployment/deployment.png" caption="Diagrama de Despliegue de SiteWhere"/>

## Requerimientos del Sistema

Debido a que SiteWhere 2.1 utiliza una arquitectura de microservicios, la cantidad de procesos 
que se ejecutan simultáneamente han aumentado, lo que a su vez requiere más memoria y potencia 
de procesamiento. Las especificaciones mínimas de hardware para un clúster Kubernetes de un solo 
nodo que ejecuta una instancia de SiteWhere es:

| Recurso       | Valor Min |
| ------------- | --------- |
| Memory        | 16GB RAM  |
| CPU           | 4 CPUs    |
| Hard Disk/SSD | 100GB     |

En la mayoría de los escenarios de implementación del mundo real, se utilizará un clúster de 
Kubernetes de múltiples nodos para que el sistema pueda estar altamente disponible. En los 
casos en que los microservicios se distribuyen a través de múltiples nodos k8s, los requisitos 
por nodo se pueden ajustar en función de la cantidad de microservicios por nodo (generalmente 
500 MB de memoria por microservicio).

## Instalando Kubernetes

SiteWhere 2.1 utiliza Kubernetes como una solución de orquestación de contenedores de nivel de 
producción que puede instalarse tanto localmente/on-premise como en los entornos de nube principales.
Los grupos de Kubernetes están disponibles como servicio en
[Google Cloud](https://cloud.google.com/kubernetes-engine/),
[Amazon AWS](https://aws.amazon.com/eks/),
[Azure](https://azure.microsoft.com/en-us/services/kubernetes-service/) 
y en la mayoría de los otros proveedores de la nube.

### Instalación en Entorno de Desarrollo de un Solo Nodo

Se puede implementar un clúster de Kubernetes de un solo nodo para el entorno de desarrollo y el 
entorno de pruebas de SiteWhere. Dependiendo del sistema operativo subyacente utilizado, existen 
algunas opciones para ejecutar una instancia de k8s local.

#### Uso de la Integración de Docker / Kubernetes

[Docker](https://www.docker.com/) proporciona la implementación de contenedor predeterminada 
utilizada por la mayoría de los proveedores de Kubernetes. El ecosistema Docker ha adoptado 
Kubernetes y ofrece compatibilidad inmediata para ejecutar una instancia de nodo único a través 
de sus soluciones [Docker para Windows](https://docs.docker.com/v17.09/docker-for-windows/install/) 
y [Docker para Mac](https://docs.docker.com/v17.09/docker-for-mac/install/).
Después de instalar los componentes principales de Docker, el soporte de Kubernetes se puede 
habilitar directamente desde la configuración de Docker. Para la mayoría de los usuarios, esta 
es la ruta más rápida para ejecutar un entorno local de Kubernetes. Para obtener más detalles, 
consulte [este blog](https://blog.docker.com/2018/07/kubernetes-is-now-available-in-docker-desktop-stable-channel/) 
del equipo de Docker.

#### Uso de Minikube

[Minikube](https://github.com/kubernetes/minikube) es una herramienta que facilita la ejecución de 
un clúster de Kubernetes de un solo nodo dentro de una máquina virtual. Los entornos compatibles 
incluyen [VirtualBox](https://www.virtualbox.org/), 
[VMware Fusion](https://www.vmware.com/products/fusion.html) y muchos otros. Para obtener 
instrucciones completas sobre la instalación / implementación de Minikube, consulte su 
[guía de configuración](https://kubernetes.io/docs/setup/minikube/).


Si se instala un clúster de Kubernetes en una nueva instalación o en máquinas virtuales, le 
falta un balanceador de carga externo. Un balanceador de carga de red en la nube que 
viene con plataformas como Azure o GCM, que proporciona una dirección IP accesible desde el 
exterior que envía el tráfico al puerto correcto en los nodos del clúster.
[MetalLB](https://metallb.universe.tf/) es un balanceador de carga diseñado para ejecutarse 
y funcionar con Kubernetes y le permitirá usar el tipo LoadBalancer cuando declare un servicio.

#### Instalar MetalLB en Minikube
MetalLB se ejecuta en dos partes: un controlador de todo el clúster y un altavoz de protocolo por máquina. Instalar MetalLB por
aplicando el manifiesto:

```bash
$ kubectl apply -f https://raw.githubusercontent.com/google/metallb/v0.7.3/manifests/metallb.yaml
```
Este manifiesto crea muchos recursos. La mayoría de ellos están relacionados con el control 
de acceso, por lo que MetalLB puede leer y escribir los objetos de Kubernetes que necesita 
para hacer su trabajo.

Las dos piezas de interés son la implementación **"controlador"** y el **"speaker"** DaemonSet. 
Para monitorear:

```bash
$ kubectl get pods -n metallb-system
```
debería aparecer un resultado similar:

```bash
NAME                          READY     STATUS    RESTARTS   AGE
controller-7fbd769fcc-58fm8   1/1       Running   0          50m
speaker-rctgd                 1/1       Running   0          50m
```
Para obtener instrucciones completas sobre la instalación de MetalLB, 
consulte [Instalación de MetalLB](https://metallb.universe.tf/installation/).

**Aplicar ConfigMap**

La configuración de MetalLB es un ConfigMap Kubernetes estándar, configuración bajo el espacio 
de nombres del sistema metallb. Contiene dos elementos de información: qué direcciones IP puede 
distribuir y qué protocolo utilizar para dicha tarea.
En esta configuración, a MetalLB se le indica que entregue la dirección del rango 192.168.99.100/28, 
utilizando el modo de capa 2 (protocolo: capa2).
En el desarrollo local, la dirección IP de Minikube se utiliza como inicio del rango.
Para obtener el uso de la dirección IP de Minikube:

```bash
$ minikube ip
```

Ejemplo:

```bash
192.168.99.100
```

Aplicar esta configuración:

```bash
apiVersion: v1
kind: ConfigMap
metadata:
  namespace: metallb-system
  name: config
data:
  config: |
    address-pools:
    - name: custom-ip-space
      protocol: layer2
      addresses:
      - 192.168.99.100/28
```

Para obtener instrucciones sobre la configuración de MetalLB, consulte 
[Configuración de MetalLB](https://metallb.universe.tf/configuration/).


#### Más Opciones

Para obtener una lista completa de otras opciones para implementar Kubernetes, consulte
[Kubernetes Setup Guide](https://kubernetes.io/docs/setup/).

## Instalando Helm

El método preferido para implementar una instancia de SiteWhere 2.1 en un Cluster de Kubernetes 
en ejecución es mediante el uso de [Helm](https://helm.sh/), que admite un proceso de 
implementación optimizado y configurable. SiteWhere proporciona Helm 
[charts](https://github.com/sitewhere/sitewhere-k8s/tree/master/charts) que se pueden usar 
para arrancar el sistema en varias configuraciones dependiendo de los perfiles y otras 
opciones de configuración seleccionadas.

Para implementar SiteWhere, se debe instalar Helm. Siga 
[estas instrucciones](https://docs.helm.sh/using_helm/#installing-helm) para instalar Helm en su entorno.

::: warning
SiteWhere no admite actualmente Helm 3 ya que no se ha lanzado oficialmente y hay cambios 
significativos en la arquitectura y los comandos de la CLI. Todas las instrucciones relacionadas 
con Helm suponen que se está utilizando una versión 2.x.
:::

## Instalando Istio

SiteWhere 2.1 requiere [Istio](https://istio.io/), con
[Automatic sidecar injection](https://istio.io/docs/setup/kubernetes/additional-setup/sidecar-injection/#automatic-sidecar-injection),
instalado en un clúster de Kubernetes antes de implementar una instancia de SiteWhere. Puede instalar Istio
[con](https://istio.io/docs/setup/kubernetes/install/helm/) o [sin](https://istio.io/docs/setup/kubernetes/install/kubernetes/) Helm.

Asegúrese de que el espacio de nombres donde está implementando SiteWhere tiene la etiqueta `istio-injection = enabled`, 
por ejemplo, para el uso del espacio de nombres `default`:

```bash
kubectl get namespace -L istio-injection
```

```bash
NAME           STATUS    AGE       ISTIO-INJECTION
default        Active    1h        enabled
istio-system   Active    1h
kube-public    Active    1h
kube-system    Active    1h
```

Si no, agregue la etiqueta al espacio de nombres:

```bash
kubectl label namespace default istio-injection=enabled
```

## Instalando SiteWhere desde el Repositorio Helm de SiteWhere

Para instalar SiteWhere usando Helm, se necesita agregar el [Repositorio Helm de SiteWhere](https://sitewhere.io/helm-charts)
en su cliente Helm.

```bash
helm repo add sitewhere https://sitewhere.io/helm-charts
```

Entonces necesitas actualizar tu repositorio local de Helm

```bash
helm repo update
```

Para instalar el gráfico con el nombre de la versión `sitewhere` ejecute:

```bash
helm install --name sitewhere sitewhere/sitewhere
```

## Instalar SiteWhere desde el Repositorio de Kubernetes de SiteWhere

Para facilitar el proceso de instalación de los diversos componentes de infraestructura de 
SiteWhere, se dispone de un [repositorio](https://github.com/sitewhere/sitewhere-k8s) 
separado para los diversos artefactos de k8s.

### Clonar el Repositorio

Usando un cliente [Git](https://git-scm.com/), clone el repositorio en la máquina donde 
tiene configurado el entorno Kubernetes. El repositorio se puede clonar con el siguiente 
comando:

```bash
git clone https://github.com/sitewhere/sitewhere-k8s.git
```

Una vez que el repositorio ha sido clonado, navegue al subdirectorio **sitewhere-k8s/charts**. 
Este directorio contiene recursos Helm Charts y Kubernetes para escenarios de implementación de SiteWhere.

### Instalar SiteWhere

Para instalar SiteWhere con la configuración predeterminada (incluidos todos los microservicios 
y los componentes de infraestructura predeterminados) ejecute:

```bash
helm install --name sitewhere ./sitewhere
```

### Ejecutando con recursos restringidos

Si desea ejecutar SiteWhere en un clúster de bajos recursos, use el perfil _minimal_ con Helm 
Chart para instalar solo los microservicios principales necesarios para arrancar el sistema:

```bash
helm install --name sitewhere --set services.profile=minimal ./sitewhere
```

En esta configuración, algunos servicios no estarán disponibles y las API correspondientes 
devolverán códigos de error que indican que no se pueden satisfacer las solicitudes del servicio.

### Ejecutando con almacenamiento de host

Si no necesita Rook.io, puede omitir la instalación de Rook.io e instalar SiteWhere Helm Chart
 configurando la propiedad `persistence.storageClass` a otra que no sea` rook-ceph-block`, por 
 ejemplo, para usar `hostpath` Persistence Storage Class, use el siguiente comando:

```bash
helm install --name sitewhere --set persistence.storageClass=hostpath ./sitewhere
```

## Instalar Rook

::: tip
Este paso es opcional, pero se recomienda para instalaciones de nivel de producción.
:::

Para admitir el almacenamiento persistente de múltiples nodos para componentes de 
infraestructura de SiteWhere como Kafka, Zookeeper y las diversas tecnologías de bases de 
datos, se debe utilizar un sistema de almacenamiento distribuido como [Ceph](https://ceph.com/). 
El proyecto [Rook](https://rook.io) admite un proceso simplificado para implementar Ceph 
en un entorno Kubernetes, lo que permite un almacenamiento persistente escalable y confiable 
que se puede utilizar directamente desde las API de almacenamiento estándar de k8s.

Al ejecutar la siguiente lista de comandos, un clúster de Rook se iniciará y estará disponible 
para su uso por SiteWhere.

```bash
kubectl create -f rook/common.yaml
kubectl create -f rook/operator.yaml
kubectl create -f rook/cluster.yaml
```

Tenga en cuenta que los componentes de Rook permiten que la información persistente, como 
bases de datos u otro estado del sistema, se mantenga fuera de la instancia de SiteWhere. 
SiteWhere usa k8s [volúmenes persistentes](https://kubernetes.io/docs/concepts/storage/persistent-volumes/) 
para crear referencias a los datos persistentes que están disponibles en el clúster k8s de 
manera replicada y de alta disponibilidad y vive más allá del reinicio del sistema. Los 
datos subyacentes solo se eliminan si los PVCs/PVs se eliminan manualmente.

## Monitoreo de Servicios de SiteWhere

Una vez que SiteWhere se ha instalado, hay muchas formas de interactuar con el sistema para 
verificar que los microservicios se hayan iniciado con éxito. Cualquiera de las herramientas 
estándar de Kubernetes puede usarse para introspectar los pods de SiteWhere.

### Usando Visual Studio Code Kubernetes Support

[Visual Studio Code](https://code.visualstudio.com/) ofrece un complemento opcional de Kubernetes 
que admite la gestión de muchos aspectos de un clúster en ejecución. La extensión se publica 
como un repositorio de [código abierto](https://github.com/Azure/vscode-kubernetes-tools) y 
puede instalarse a través del administrador de extensiones VS Code.

<InlineImage src="/images/deployment/vs-code-kubernetes-plugin.png" caption="Kubernetes Plugin"/>

Después de instalar el complemento, busque los nodos de Kubernetes para ver los servicios en ejecución.
Una vez que se hayan iniciado todos los servicios de infraestructura, se iniciarán los servicios 
de SiteWhere.
Para examinar los registros de los servicios individuales, haga clic con el botón derecho en 
un pod en el árbol y elija "Follow Logs" para adjuntarlos a los registros de ese microservicio 
en una terminal. Se pueden abrir múltiples terminales simultáneamente para rastrear registros 
de múltiples servicios.

<InlineImage src="/images/deployment/vs-code-sitewhere-services.png" caption="SiteWhere Services"/>

### Usando Kubernetes Dashboard UI

El proyecto Kubernetes incluye una interfaz de usuario de tablero que se puede usar para ver 
los componentes del clúster para tareas como monitorear el estado de los componentes y ver 
registros. Para obtener instrucciones completas sobre cómo instalar la interfaz de usuario de 
Kubernetes Dashboard, consulte la implementación del tablero [documentación](https://kubernetes.io/docs/tasks/access-application-cluster/web-ui-dashboard/#deploying-the-dashboard-ui).

## Ejecute la Aplicación Administrativa

Una vez que se ha implementado una instancia de SiteWhere, la aplicación administrativa de SiteWhere 
se puede usar para conectarse a la instancia y configurarla. La aplicación administrativa se basa en 
[Electron](https://electronjs.org/) y se puede descargar directamente desde el proyecto 
[releases](https://github.com/sitewhere/sitewhere-admin-ui/releases) página. Después de 
instalar la aplicación, ábrala e inicie sesión con las credenciales administrativas 
predeterminadas:

**username**: `admin`

**password**: `password`

<InlineImage src="/images/platform/login.png" caption="Administrative Application"/>

Consulte la guía del usuario para obtener más información sobre el uso de la aplicación administrativa.

## Eliminar SiteWhere

Para eliminar SiteWhere, ejecute el siguiente comando

```bash
helm del --purge sitewhere
```

### Eliminar Datos Persistentes de SiteWhere

Para eliminar todos los datos de SiteWhere y comenzar con un sistema limpio, debe eliminar 
los [persistent volume claims](https://kubernetes.io/docs/concepts/storage/persistent-volumes/)
que crean los componentes de infraestructura de SiteWhere. Los siguientes comandos se pueden 
usar para eliminar datos agregados por la configuración predeterminada de SiteWhere:

```bash
kubectl delete pvc -l release=sitewhere
```

## Desinstalar Rook

Para desinstalar Rook y los componentes de Ceph que envuelve, consulte este 
[documento](https://rook.io/docs/rook/v0.8/ceph-teardown.html) y siga las instrucciones 
para eliminar los componentes y los relacionados datos.

::: tip
Para eliminar los datos persistentes asociados con SiteWhere, no es necesario desinstalar 
Rook. Como se detalló anteriormente, los reclamos de persistencia de k8s pueden eliminarse 
para eliminar los datos existentes y comenzar con un sistema limpio.
:::
