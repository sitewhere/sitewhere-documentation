# SiteWhere Deployment Guide

This guide covers the SiteWhere 2.0 deployment process which has changed
significantly from the one used for SiteWhere 1.x. While previous versions
of SiteWhere were deployed as a single server node, the SiteWhere 2.0
architecture is based on many microservices which are deployed into a
[Kubernetes](https://https://kubernetes.io) infrastructure.

## System Requirements

Because SiteWhere 2.0 uses a microservices architecture, the number of
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

SiteWhere 2.0 uses Kubernetes as a production-grade container orchestration solution
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
and many others. For complete instuctions on installing/deploying Minikube
see their [setup guide](https://kubernetes.io/docs/setup/minikube/).

#### More Options

For a complete list of other options for deploying Kubernetes, see the
[Kubernetes Setup Guide](https://kubernetes.io/docs/setup/).

## Install Helm

The preferred method of deploying a SiteWhere 2.0 instance to a running Kubernetes
Cluster is by using [Helm](https://helm.sh/), which supports a streamlined,
configurable deployment process. SiteWhere provides Helm
[charts](https://github.com/sitewhere/sitewhere-k8s/tree/master/charts) which
can be used to bootstrap the system in various configurations depending
on the profiles and other configuration options selected.

In order to deploy SiteWhere, Helm needs to be installed. Follow
[these](https://docs.helm.sh/using_helm/#installing-helm) instructions to install
Helm in your environment.

## Get SiteWhere Kubernetes Components from GitHub

In order to make the process of installing the various SiteWhere infrastructure
components easier, a separate [repository](https://github.com/sitewhere/sitewhere-k8s)
is made available for the various k8s artifacts.

### Clone the Repository

Using a [Git](https://git-scm.com/) client, clone the repository to the machine
where you have the Kubernetes environment configured. The repository can be cloned
with the following command:

```
git clone https://github.com/sitewhere/sitewhere-k8s.git
```

Once the repository has been cloned, navigate into the **sitewhere-k8s/charts**
subdirectory. This directory contains Helm Charts and Kubernetes resources for SiteWhere
deployment scenarios.

## Install Rook

In order to support multi-node persistent storage for SiteWhere infrastucture components
such as Kafka, Zookeeper, and the various database technologies, a distributed
storage system such as [Ceph](https://ceph.com/) should be used. The
[Rook](https://rook.io) project supports a streamlined process for deploying
Ceph in a Kubernetes environment, allowing for scalable, reliable persistent
storage that may be used directly from standard k8s storage APIs.

By executing the following list of commands, a Rook cluster will be bootstrapped
and made available for use by SiteWhere.

```
kubectl create -f rook/operator.yaml
kubectl create -f rook/cluster.yaml
kubectl create -f rook/storageclass.yaml
```

Note that the Rook components allow persistent information such as databases
or other system state to be kept outside of the SiteWhere instance. SiteWhere
uses k8s [persistent volumes](https://kubernetes.io/docs/concepts/storage/persistent-volumes/)
to create references to the persistent data which is made available across the k8s
cluster in a replicated, highly-available fashion and lives beyond system restarts.
The underlying data is only deleted if the PVCs/PVs are manually deleted.

## Start SiteWhere

To start SiteWhere with the default configuration (including all microservices and
the default infrastructure components) run:

```
helm install --name sitewhere ./sitewhere
```
### Running with Constrained Resources
If you wish to run SiteWhere in a low resource cluster, use the _minimal_ profile 
with the Helm Chart to only install the core microservices required to bootstrap
the system:

```
helm install --name sitewhere --set services.profile=minimal ./sitewhere
```

In this configuration, some services will not be available and the corresponding
APIs will return error codes indicating that requests for the service can not
be satisfied.

### Running with Host Storage
If you don't need Rook.io, you can skip the Rook.io install and install
SiteWhere Helm Chart setting the `persistence.storageClass` property to
other than `rook-ceph-block`, for example to use `hostpath` Persistence
Storage Class, use the following command:

```
helm install --name sitewhere --set persistence.storageClass=hostpath ./sitewhere
```

## Remove SiteWhere

To remove SiteWhere, execute the following command

```
helm del --purge sitewhere
```

### Remove SiteWhere Persistent Data
In order to remove all SiteWhere data and start with a clean system, you need remove the 
[persistent volume claims](https://kubernetes.io/docs/concepts/storage/persistent-volumes/) 
that the SiteWhere infrastructure components create. The following commands may be
used to delete data added by the default SiteWhere configuration:

#### Delete Consul Metadata
```
kubectl delete pvc/data-sitewhere-consul-server-0
```

#### Delete Kafka Data
```
kubectl delete pvc/sitewhere-kafka-pv-sitewhere-kafka-0
```

#### Delete MongoDB Database
```
kubectl delete pvc/sitewhere-mongodb-pv-sitewhere-mongodb-0
```

#### Delete Zookeeper Metadata
```
kubectl delete pvc/sitewhere-zookeeper-pv-sitewhere-zookeeper-0
```

## Uninstall Rook

To uninstall Rook and the Ceph components it wraps, refer to this 
[document](https://rook.io/docs/rook/v0.8/ceph-teardown.html), and 
follow the instructions to remove the components and related data.

::: tip
To delete the persistent data associated with SiteWhere, it is not necessary
to ininstall Rook. As detailed above, the k8s persistence claims may be 
deleted to remove existing data and start with a clean system.
:::

