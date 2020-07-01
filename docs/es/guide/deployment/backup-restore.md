# Procedimientos de Copias de Seguridad y  Restauración

<Seo/>

Este documento proporciona procedimientos para realizar copias de seguridad y restaurar servicios que utilizan 
almacenamiento persistente, incluidos MongoDB y Apache Zookeeper.

## Procedimiento de Copias de Seguridad

### Crear PVC de Copia de Seguridad

Si planea usar el almacenamiento `rook-ceph-block` storageClass ejecute:

```bash
kubectl apply -f utils/sitewhere-mongodb-dump-pvc-rook.yaml
```

Si planea utilizar un servidor NFS externo, edite el archivo
`utils / sitewhere-mongodb-dump-pvc-nfs.yaml`, modifique la URL y Path del servidor NFS.

```yaml
nfs:
  server: <NFS_SERVER_IP>
  path: "<NFS_SERVER_PATH>"
```

Guarde el archivo y aplíquelo al clúster.

```bash
kubectl apply -f utils/sitewhere-mongodb-dump-pvc-nfs.yaml
```

### Desescalar Microservicios de SiteWhere 

```bash
kubectl scale deploy --replicas=0 -l sitewhere.io/role=microservice
```

### Copia de seguridad de Base de Datos MongoDB

```bash
kubectl apply -f utils/sitewhere-mongodb-dump-job.yaml
```

Espere a que se complete el trabajo `sitewhere-mongodump`.

```bash
kubectl get job
```

```bash
NAME                  DESIRED   SUCCESSFUL   AGE
sitewhere-mongodump   1         1            7s
```

Alternativamente, puede crear un `CronJob` que ejecutará el trabajo de copia de seguridad repetidamente. Puede 
crear el `CronJob` ejecutando:

```bash
kubectl apply -f utils/sitewhere-mongodb-dump-crojob.yaml
```

Por defecto, ejecutará un trabajo de respaldo una vez al día, a las `12: 01`. Puede cambiar este comportamiento 
cambiando la expresión de cron (`schedule`) en `utils/sitewhere-mongodb-dump-crojob.yaml`

```yaml
apiVersion: batch/v1beta1
kind: CronJob
metadata:
  name: sitewhere-mongodump
spec:
  schedule: "*/1 * * * *"
  jobTemplate:
```

### Copiar datos de copia de seguridad fuera del clúster

Si está utilizando  `rook-ceph-block` storage class `PVC`, es posible que deba extraer el archivo de copia de 
seguridad de Kubernates. Para llevar a cabo esta tarea, proporcionamos un `YAML` que crea un `Pod` que monta 
el `PVC` utilizado para almacenar el resultado de la copia de seguridad. Después de crear el Pod, puede extraer 
los archivos usando el comando `kubectl cp`. Los siguientes comandos muestran cómo extraer el resultado de la
trabajo de respaldo / cronjob.

```bash
kubectl apply -f utils/sitewhere-mongodb-backup-pod.yaml
kubectl cp sitewhere-backup-admin-pod:/dump <YOUR_BACKUP_DIR>
kubectl delete -f utils/sitewhere-mongodb-backup-pod.yaml
```

**Nota:** Si está utilizando `rook-ceph-block`, tenga en cuenta la limitación `RWO` de esta clase de almacenamiento.
Esto significa que solo un `Pod` puede tener el PVC `sitewhere-mongodump-pvc` montado en su sistema de archivos.

### Escalar Microservicios de SiteWhere 

```bash
kubectl scale deploy --replicas=1 -l sitewhere.io/role=microservice
```

## Procedimiento de Restauración

### Desescalar Microservicios de SiteWhere

```bash
kubectl scale deploy --replicas=0 -l sitewhere.io/role=microservice
```

### Copiar datos de copia de seguridad en el Clúster

Si está utilizando `rook-ceph-block` storage class `PVC`, es posible que deba copiar el archivo 
de copia de seguridad en Kubernates. Para llevar a cabo esta tarea, proporcionamos un `YAML` que crea un `Pod` 
que monta el `PVC` utilizado para almacenar el resultado de la copia de seguridad. Después de crear el Pod, 
puede copiar los archivos usando el comando `kubectl cp` en el clúster. Los siguientes comandos muestran cómo 
copiar su archivo de copia de seguridad en el clúster.

```bash
kubectl apply -f utils/sitewhere-mongodb-backup-pod.yaml
kubectl cp <YOUR_BACKUP_DIR> sitewhere-backup-admin-pod:/dump
kubectl delete -f utils/sitewhere-mongodb-backup-pod.yaml
```

**Nota:** Si está utilizando `rook-ceph-block`, tenga en cuenta la limitación` RWO` de esta clase de 
almacenamiento. Esto significa que solo un `Pod` puede tener el PVC` sitewhere-mongodump-pvc` montado en su 
sistema de archivos.

### Restaurar la base de datos MongoDB

```bash
kubectl apply -f utils/sitewhere-mongodb-restore-job.yaml
```

### Escalar Microservicios de SiteWhere 

```bash
kubectl scale deploy --replicas=1 -l sitewhere.io/role=microservice
```
