# Installing a SiteWhere Instance

<Seo/>

This guide covers the SiteWhere 2.1 deployment process which has changed
significantly from the one used for SiteWhere 1.x. While previous versions
of SiteWhere were deployed as a single server node, the SiteWhere 2.1
architecture is based on many microservices which are deployed into a
[Kubernetes](https://https://kubernetes.io) infrastructure.

<InlineImage src="/images/deployment/deployment.png" caption="SiteWhere Deployment Diagram"/>

## System Requirements

Because SiteWhere 2.1 uses a microservices architecture, the number of
processes running concurrently has increased, which in turn requires
more memory and processing power. The minimum hardware specifications
for a single node Kubernetes cluster running a SiteWhere instance is:

| Resource      | Min Value |
| ------------- | --------- |
| Memory        | 16GB RAM  |
| CPU           | 4 CPUs    |
| Hard Disk/SSD | 100GB     |

In most real-world deployment scenarios, a multi-node Kubernetes cluster
will be used so that the system can be made highly available. In cases
where microservices are distributed across multiple k8s nodes,
the per-node requirements can be adjusted based on the number of
microservices per node (generally 500MB of memory per microservice).

## Install Kubernetes

SiteWhere 2.1 uses Kubernetes as a production-grade container orchestration solution
which may be installed both locally/on-premise and in all major cloud environments.
Kubernetes clusters are available as a service on
[Google Cloud](https://cloud.google.com/kubernetes-engine/),
[Amazon AWS](https://aws.amazon.com/eks/),
[Azure](https://azure.microsoft.com/en-us/services/kubernetes-service/) and
most of the other cloud providers.

### Installing a Single-Node Development Environment

A single-node Kubernetes cluster may be deployed for SiteWhere development
and testing. Depending on the underlying operating system used, there are
a few options for running a local k8s instance.

#### Using Docker/Kubernetes Integration

[Docker](https://www.docker.com/) provides the default container implementation
used by most Kubernetes providers. The Docker ecosystem has embraced Kubernetes
and offers out-of-the-box support for running a single-node instance via
their [Docker for Windows](https://docs.docker.com/v17.09/docker-for-windows/install/)
and [Docker for Mac](https://docs.docker.com/v17.09/docker-for-mac/install/)
offerings. After installing the core Docker components, Kubernetes support
may be enabled directly from within the Docker settings. For most users, this
is the fastest path to getting a local Kubernetes environment running. For more
details see [this blog](https://blog.docker.com/2018/07/kubernetes-is-now-available-in-docker-desktop-stable-channel/)
from the Docker team.

#### Using Minikube

[Minikube](https://github.com/kubernetes/minikube) is a tool that makes it easy
to run a single-node Kubernetes cluster inside a virtual machine. Environments supported
include [VirtualBox](https://www.virtualbox.org/),
[VMware Fusion](https://www.vmware.com/products/fusion.html)
and many others. For complete instructions on installing/deploying Minikube
see their [setup guide](https://kubernetes.io/docs/setup/minikube/).

If a Kubernetes cluster is installed on bare metal or on virtual machines, it’s missing an external 
load balancer. It’s a cloud network load balancer that comes with platforms such as Azure or GCM, 
that provides an externally-accessible IP address that sends traffic to the correct port on your cluster nodes. 
[MetalLB](https://metallb.universe.tf/) is a load balancer designed to run on and to work with Kubernetes 
and it will allow you to use the type LoadBalancer when you declare a service.

###### Install MetalLB on Minikube
MetalLB runs in two parts: a cluster-wide controller, and a per-machine protocol speaker. Install MetalLB by 
applying the manifest:

```bash
$ kubectl apply -f https://raw.githubusercontent.com/google/metallb/v0.7.3/manifests/metallb.yaml
```
This manifest creates a bunch of resources. Most of them are related to access control, so that MetalLB can 
read and write the Kubernetes objects it needs to do its job.

The two pieces of interest are the **“controller”** deployment, and the **“speaker”** DaemonSet. By monitoring:

```bash
$ kubectl get pods -n metallb-system
```
similar output should appear:

```bash
NAME                          READY     STATUS    RESTARTS   AGE
controller-7fbd769fcc-58fm8   1/1       Running   0          50m
speaker-rctgd                 1/1       Running   0          50m
```
For complete instructions on installing MetalLB see their [MetalLB installation](https://metallb.universe.tf/installation/).

**Apply ConfigMap**

MetalLB’s configuration is a standard Kubernetes ConfigMap, config under the metallb-system namespace. It contains two pieces 
of information: what IP addresses it’s allowed to hand out and which protocol to use for such task.
In this configuration MetalLB is instructed to hand out address from the 192.168.99.100/28 range, using layer 2 mode (protocol: layer2).   
In local development, Minikube IP address is used as the start of the range. 
To get Minikube IP address use:

```bash
$ minikube ip
```

Result example:

```bash
192.168.99.100
```

Apply this configuration:

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

For complete instructions on configuration MetalLB see their [MetalLB configuration](https://metallb.universe.tf/configuration/).

#### More Options

For a complete list of other options for deploying Kubernetes, see the
[Kubernetes Setup Guide](https://kubernetes.io/docs/setup/).

## Install Helm

The preferred method of deploying a SiteWhere 2.1 instance to a running Kubernetes
Cluster is by using [Helm](https://helm.sh/), which supports a streamlined,
configurable deployment process. SiteWhere provides Helm
[charts](https://github.com/sitewhere/sitewhere-k8s/tree/master/charts) which
can be used to bootstrap the system in various configurations depending
on the profiles and other configuration options selected.

In order to deploy SiteWhere, Helm needs to be installed. Follow
[these](https://docs.helm.sh/using_helm/#installing-helm) instructions to install
Helm in your environment.

::: warning
SiteWhere does not currently support Helm 3 since it has not been officially released
and there are significant changes to the architecture and CLI commands. All instructions
related to Helm assume that a 2.x version is being used.
:::

## Install Istio

SiteWhere 2.1 requeries [Istio](https://istio.io/), with
[Automatic sidecar injection](https://istio.io/docs/setup/kubernetes/additional-setup/sidecar-injection/#automatic-sidecar-injection),
installed on a Kubernetes cluster before you deploy an instance of SiteWhere. You can install Istio
[with](https://istio.io/docs/setup/kubernetes/install/helm/) or [without](https://istio.io/docs/setup/kubernetes/install/kubernetes/) Helm.

Make sure that the namespace where you are deploying SiteWhere has the label `istio-injection=enabled`,
for example for the `default` namespace use:

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

If not, add the label to the namespace:

```bash
kubectl label namespace default istio-injection=enabled
```

## Install SiteWhere from SiteWhere Helm Repository

To intall SiteWhere using Helm, you need to add the [SiteWhere Helm Repository](https://sitewhere.io/helm-charts)
to your helm client.

```bash
helm repo add sitewhere https://sitewhere.io/helm-charts
```

Then you need to update your local helm repository

```bash
helm repo update
```

To install the chart with the release name `sitewhere` execute:

```bash
helm install -name sitewhere sitewhere/sitewhere
```

## Install SiteWhere from SiteWhere Kubernetes Repository

In order to make the process of installing the various SiteWhere infrastructure
components easier, a separate [repository](https://github.com/sitewhere/sitewhere-k8s)
is made available for the various k8s artifacts.

### Clone the Repository

Using a [Git](https://git-scm.com/) client, clone the repository to the machine
where you have the Kubernetes environment configured. The repository can be cloned
with the following command:

```bash
git clone https://github.com/sitewhere/sitewhere-k8s.git
```

Once the repository has been cloned, navigate into the **sitewhere-k8s/charts**
subdirectory. This directory contains Helm Charts and Kubernetes resources for SiteWhere
deployment scenarios.

### Install SiteWhere

To install SiteWhere with the default configuration (including all microservices and
the default infrastructure components) run:

```bash
helm install --name sitewhere ./sitewhere
```

### Running with Constrained Resources

If you wish to run SiteWhere in a low resource cluster, use the _minimal_ profile
with the Helm Chart to only install the core microservices required to bootstrap
the system:

```bash
helm install -name sitewhere --set services.profile=minimal ./sitewhere
```

In this configuration, some services will not be available and the corresponding
APIs will return error codes indicating that requests for the service can not
be satisfied.

### Running with Host Storage

If you don't need Rook.io, you can skip the Rook.io install and install
SiteWhere Helm Chart setting the `persistence.storageClass` property to
other than `rook-ceph-block`, for example to use `hostpath` Persistence
Storage Class, use the following command:

```bash
helm install -name sitewhere --set persistence.storageClass=hostpath ./sitewhere
```

## Install Rook

::: tip
This step is optional, but it is recommended for production grade installations.
:::

In order to support multi-node persistent storage for SiteWhere infrastucture components
such as Kafka, Zookeeper, and the various database technologies, a distributed
storage system such as [Ceph](https://ceph.com/) should be used. The
[Rook](https://rook.io) project supports a streamlined process for deploying
Ceph in a Kubernetes environment, allowing for scalable, reliable persistent
storage that may be used directly from standard k8s storage APIs.

By executing the following list of commands, a Rook cluster will be bootstrapped
and made available for use by SiteWhere.

```bash
kubectl create -f rook/common.yaml
kubectl create -f rook/operator.yaml
kubectl create -f rook/cluster.yaml
```

Note that the Rook components allow persistent information such as databases
or other system state to be kept outside of the SiteWhere instance. SiteWhere
uses k8s [persistent volumes](https://kubernetes.io/docs/concepts/storage/persistent-volumes/)
to create references to the persistent data which is made available across the k8s
cluster in a replicated, highly-available fashion and lives beyond system restarts.
The underlying data is only deleted if the PVCs/PVs are manually deleted.

## Monitor SiteWhere Services

Once SiteWhere has been installed, there are many ways of interacting with the system
to verify that the microservices have started successfully. Any of the standard
Kubernetes tooling may be used to introspect the SiteWhere pods.

### Using Visual Studio Code Kubernetes Support

[Visual Studio Code](https://code.visualstudio.com/) offers an optional Kubernetes
plugin which supports management of many aspects of a running cluster. The extension
is published as an [open source](https://github.com/Azure/vscode-kubernetes-tools)
repository and may be installed via the VS Code extension manager.

<InlineImage src="/images/deployment/vs-code-kubernetes-plugin.png" caption="Kubernetes Plugin"/>

After installing the plugin, browse into the Kubernetes nodes to see the running services.
Once all of the infrastructure services have started, the SiteWhere services will start.
To browse the logs for the individual services, right-click on a pod in the tree and choose
`Follow Logs` to attach to the logs for that microservice in a terminal. Multiple terminals
may be opened concurrently to track logs for multiple services.

<InlineImage src="/images/deployment/vs-code-sitewhere-services.png" caption="SiteWhere Services"/>

### Using Kubernetes Dashboard UI

The Kubernetes project includes a dashboard user interface that may be used to view the
cluster components for tasks such as monitoring component status and viewing logs. For complete
instructions on installing the Kubernetes Dashboard UI, refer to the dashboard deployment
[documentation](https://kubernetes.io/docs/tasks/access-application-cluster/web-ui-dashboard/#deploying-the-dashboard-ui).

## Run the Administrative Application

Once a SiteWhere instance has been deployed, the SiteWhere administrative application may be
used to connect to the instance and configure it. The administrative application is based on
[Electron](https://electronjs.org/) and may be downloaded from directly from the project
[releases](https://github.com/sitewhere/sitewhere-admin-ui/releases) page. After installing
the application, open it and log in using the default administrative credentials:

**username**: `admin`

**password**: `password`

<InlineImage src="/images/platform/login.png" caption="Administrative Application"/>

See the user guide for more information about using the administrative application.

## Remove SiteWhere

To remove SiteWhere, execute the following command

```bash
helm del --purge sitewhere
```

### Remove SiteWhere Persistent Data

In order to remove all SiteWhere data and start with a clean system, you need remove the
[persistent volume claims](https://kubernetes.io/docs/concepts/storage/persistent-volumes/)
that the SiteWhere infrastructure components create. The following commands may be
used to delete data added by the default SiteWhere configuration:

```bash
kubectl delete pvc -l release=sitewhere
```

## Uninstall Rook

To uninstall Rook and the Ceph components it wraps, refer to this
[document](https://rook.io/docs/rook/v0.8/ceph-teardown.html), and
follow the instructions to remove the components and related data.

::: tip
To delete the persistent data associated with SiteWhere, it is not necessary
to uninstall Rook. As detailed above, the k8s persistence claims may be
deleted to remove existing data and start with a clean system.
:::
