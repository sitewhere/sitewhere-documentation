# Problemas comunes

<Seo/>

## Técnicas de solución de problemas

### Instalación de Rook 

Verifique que los pods de `rook-ceph-agent` estén en estado `Running`

```bash
kubectl -n rook-ceph-system get pod
```

Verifique que no haya errores en los pods `rook-ceph-agent` ejecutando:

```bash
kubectl -n rook-ceph-system get pod -l app=rook-ceph-agent -o jsonpath='{range .items[*]}{.metadata.name}{"\t"}{.status.containerStatuses[0].lastState.terminated.message}{"\n"}{end}'
```

### Ejecutando en MiniKube

Si está ejecutando en `minikube` en en entorno de desarrollo, puede omitir el uso` Rook.io`
y usar el `dev-values.yaml`.

```bash
helm install --name sitewhere \
-f ./sitewhere/dev-values.yaml \
--set sitewhere-infra-database.mongodb.persistence.storageClass=standard \
--set sitewhere-infra-core.kafka.persistence.storageClass=standard \
--set sitewhere-infra-core.kafka.zookeeper.persistence.storageClass=standard \
--set sitewhere-infra-core.kafka.external.enabled=false \
./sitewhere
```

Alternativamente, puede usar el Helm Repo de Sitewhere con el comando:

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

### Ambiente Mínimo con `hostpath` storageClass

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

### Entorno de Desarrollo con `hostpath` storageClass

```bash
helm install --name sitewhere \
-f ./sitewhere/dev-values.yaml \
--set sitewhere-infra-database.mongodb.persistence.storageClass=hostpath \
--set sitewhere-infra-core.kafka.persistence.storageClass=hostpath \
--set sitewhere-infra-core.kafka.zookeeper.persistence.storageClass=hostpath \
./sitewhere
```
