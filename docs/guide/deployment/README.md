# :book: Deployment Guide

<Seo/>

This guide covers the SiteWhere deployment processing including infrastructure
configuration as well as options for deploying the core platform.

## Prerequisites Details

- Kubernetes 1.8+
- Rook v0.9+

## Chart Details

This chart will do the following:

- Deploy SiteWhere 2.0 Core Infrastructure
- Deploy SiteWhere 2.0 Core Database
- Deploy SiteWhere 2.0 Microservices

## Installing the Chart

### Add SiteWhere Helm

Before installing SiteWhere helm charts, you need to add the [SiteWhere helm repository](https://sitewhere.io/helm-charts) to your helm client.

```console
helm repo add sitewhere https://sitewhere.io/helm-charts
```

Then you need to update your local helm repository

```console
helm repo update
```

### Install Chart

To install the chart with the release name `sitewhere` execute:

```console
helm install --name sitewhere sitewhere/sitewhere
```

Please refere to [Common Issues](./common-issues.md) if you a problem with the Deployment of SiteWhere.

### Install in a Developer Machine

You can install SiteWhere on a Developer Machine, using the non-HA configuration of MongoDB, Apache Kafka,
Apache Zookeeper and Consul. In order to do this, you need to clone `sitewhere-k8s` repository, using

```console
git clone https://github.com/sitewhere/sitewhere-k8s.git
```

Then, on the `charts` folder run the command:

```console
helm install --name sitewhere \
  -f ./sitewhere/dev-values.yaml \
  sitewhere
```

### Remove Installed Helm Chart

To remove sitewhere deployment, run the command:

```console
helm del sitewhere --purge
```

This will remove sitewhere infrastructure and microservices.

### Delete SiteWhere Data

To remove SiteWhere Persistence Volume Claims, run the command:

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

## Backup and Restore

For backup and restore procedure, please refere to [Backup and Restore](./backup-restore.md).
