# :book: Deployment Guide

<Seo/>

SiteWhere is a distributed system which is implemented in a microservice architecture
and orchestrated using a [Kubernetes](https://kubernetes.io/) infrastructure. SiteWhere
uses [Helm](https://helm.sh/) to provide a simple, parameterized approach for launching
and configuring the system. A separate
[sitewhere-k8s](https://github.com/sitewhere/sitewhere-k8s) repository contains
the Helm charts, which are released independently of the core platform
lifecycle.

This guide covers the artifacts and processes invoved in deploying a SiteWhere
instance, including infrastructure components, data persistence technologies
and the microservices which implement system functionality.

## Prerequisites

- Kubernetes 1.8+
- Rook v0.9+

## Chart Details

The SiteWhere Helm chart covers the following functional areas:

- [SiteWhere Core Infrastructure](https://github.com/sitewhere/sitewhere-k8s/tree/master/charts/sitewhere-infra-core) (e.g. Kafka, Zookeeper, Consul)
- [SiteWhere Database Infrastructure](https://github.com/sitewhere/sitewhere-k8s/tree/master/charts/sitewhere-infra-database) (e.g. MongoDB, InfluxDB, Cassandra)
- [SiteWhere Microservices](https://github.com/sitewhere/sitewhere-k8s/tree/master/charts/sitewhere) (Core system microservices)

Note that the infrastructure charts are packaged separately and included as
dependencies for the primary SiteWhere chart.

## Installing the Chart

### Add the SiteWhere Helm Repository

Before installing the SiteWhere Helm charts, add the
[SiteWhere helm repository](https://sitewhere.io/helm-charts/index.yaml)
to your Helm client.

```console
helm repo add sitewhere https://sitewhere.io/helm-charts
```

Afterward, update your local Helm repository to pull the latest
chart information from the index.

```console
helm repo update
```

### Install SiteWhere Chart

To install the chart with the release name `sitewhere` execute:

```console
helm install --name sitewhere sitewhere/sitewhere
```

Please refere to [Common Issues](./common-issues.md) if you a problem with the Deployment of SiteWhere.

### Install on a Developer Machine

To install a version of the SiteWhere chart that uses less
highly-available components in order to reduce the memory footprint
and startup time, use the following command instead.

```console
helm install --name sitewhere \
  -f ./sitewhere/dev-values.yaml \
  sitewhere
```

### Remove Installed Helm Chart

The following command removes the artifacts added with the SiteWhere chart
installation and releases the `sitewhere` chart name for reuse.

```console
helm del sitewhere --purge
```

### Delete SiteWhere Data

```console
kubectl delete pvc -l release=sitewhere
```

## Install Kafka Manager

Assuming your sitewhere install name is `sitewhere`

```console
helm install --name kafka-manager \
  --set zkHosts=sitewhere-zookeeper:2181 stable/kafka-manager
```

Port-forward Kafka Manager UI

```console
kubectl port-forward deployment/kafka-manager-kafka-manager 9000 9000
```
