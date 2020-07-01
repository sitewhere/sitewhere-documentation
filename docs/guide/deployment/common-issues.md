# Common Issues

<Seo/>

## Troubleshooting Techniques

### Rook Instalation

Verify the `rook-ceph-agent` pods are `Running`

```bash
kubectl -n rook-ceph-system get pod
```

Verify that there are not error on `rook-ceph-agent` pods by running:

```bash
kubectl -n rook-ceph-system get pod -l app=rook-ceph-agent -o jsonpath='{range .items[*]}{.metadata.name}{"\t"}{.status.containerStatuses[0].lastState.terminated.message}{"\n"}{end}'
```

### Running on MiniKube

If you are running on `minikube` you can skip using `Rook.io`
and use the `dev-values.yaml`.

```bash
helm install --name sitewhere \
-f ./sitewhere/dev-values.yaml \
--set sitewhere-infra-database.mongodb.persistence.storageClass=standard \
--set sitewhere-infra-core.kafka.persistence.storageClass=standard \
--set sitewhere-infra-core.kafka.zookeeper.persistence.storageClass=standard \
--set sitewhere-infra-core.kafka.external.enabled=false \
./sitewhere
```

Alternative, you can use sitewhere Helm Repo with:

```bash
helm install --name sitewhere \
--set sitewhere-infra-core.kafka.zookeeper.replicaCount=1 \
--set sitewhere-infra-database.mongodb.replicaSet.enabled=false \
--set sitewhere-infra-database.mongodb.persistence.storageClass=standard \
--set sitewhere-infra-core.kafka.persistence.storageClass=standard \
--set sitewhere-infra-core.kafka.zookeeper.persistence.storageClass=standard \
--set sitewhere-infra-core.kafka.external.enabled=false \
sitewhere/sitewhere
```

### Minimal environment with `hostpath` storageClass

```bash
helm install --name sitewhere \
--set services.profile=minimal \
--set sitewhere-infra-core.kafka.zookeeper.replicaCount=1 \
--set sitewhere-infra-database.mongodb.persistence.storageClass=hostpath \
--set sitewhere-infra-core.kafka.persistence.storageClass=hostpath \
--set sitewhere-infra-core.kafka.zookeeper.persistence.storageClass=hostpath \
--set sitewhere-infra-core.kafka.external.enabled=false \
sitewhere/sitewhere
```

### Developer environment with `hostpath` storageClass

```bash
helm install --name sitewhere \
-f ./sitewhere/dev-values.yaml \
--set sitewhere-infra-database.mongodb.persistence.storageClass=hostpath \
--set sitewhere-infra-core.kafka.persistence.storageClass=hostpath \
--set sitewhere-infra-core.kafka.zookeeper.persistence.storageClass=hostpath \
./sitewhere
```
