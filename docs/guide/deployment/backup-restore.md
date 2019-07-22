# :book: Backup and Restore Procedures

<Seo/>

This document provides procedures for backing up and restoring services
that use persistent storage, including MongoDB and Apache Zookeeper.

## Backup Procedure

### Create Backup PVC

If you plan to use `rook-ceph-block` storageClass use:

```bash
kubectl apply -f utils/sitewhere-mongodb-dump-pvc-rook.yaml
```

If you plan to use an externa NFS Server, edit the file
`utils/sitewhere-mongodb-dump-pvc-nfs.yaml`, set the NFS Server URL and Path.

```yaml
nfs:
  server: <NFS_SERVER_IP>
  path: "<NFS_SERVER_PATH>"
```

Save the file and apply it to the cluster.

```bash
kubectl apply -f utils/sitewhere-mongodb-dump-pvc-nfs.yaml
```

### Gracefully Downscale SiteWhere Microservices

```bash
kubectl scale deploy --replicas=0 -l sitewhere.io/role=microservice
```

### Backup MongoDB Database

```bash
kubectl apply -f utils/sitewhere-mongodb-dump-job.yaml
```

Wait for `sitewhere-mongodump` job to be completed.

```bash
kubectl get job
```

```bash
NAME                  DESIRED   SUCCESSFUL   AGE
sitewhere-mongodump   1         1            7s
```

Alternative, you can create a `CronJob` which will execute the backup job
repeatibly. You can create the `CronJob` by executing:

```bash
kubectl apply -f utils/sitewhere-mongodb-dump-crojob.yaml
```

By default, it will lanch a backup job once a day, at `12:01`. You can change this behaviour
by changing the cron exepression (`schedule`) at `utils/sitewhere-mongodb-dump-crojob.yaml`

```yaml
apiVersion: batch/v1beta1
kind: CronJob
metadata:
  name: sitewhere-mongodump
spec:
  schedule: "*/1 * * * *"
  jobTemplate:
```

### Copy Backup Data Outside of the Cluster

If you are using `rook-ceph-block` storage class `PVC` you may need to extract the backup file
from Kubernates. To accomplish this task we provide a `YAML` that created a `Pod` that mounts
the `PVC` used to store the result of the backup. After you create the Pod, you can extract the
files using `kubectl cp` command. The following commands show how to extract the result of the
backup job/cronjob.

```bash
kubectl apply -f utils/sitewhere-mongodb-backup-pod.yaml
kubectl cp sitewhere-backup-admin-pod:/dump <YOUR_BACKUP_DIR>
kubectl delete -f utils/sitewhere-mongodb-backup-pod.yaml
```

**Note:** If you are using `rook-ceph-block`, be aware of the `RWO` limitation of this storage class.
This means that only one `Pod` can have the `sitewhere-mongodump-pvc` PVC mounted on its filesystem.

### Upscale SiteWhere Microservices

```bash
kubectl scale deploy --replicas=1 -l sitewhere.io/role=microservice
```

## Restore Procedure

### Gracefully Downscale SiteWhere Microservices

```bash
kubectl scale deploy --replicas=0 -l sitewhere.io/role=microservice
```

### Copy Backup Data into the Cluster

If you are using `rook-ceph-block` storage class `PVC` you may need to copy backup file
into Kubernates. To accomplish this task we provide a `YAML` that created a `Pod` that mounts
the `PVC` used to store the result of the backup. After you create the Pod, you can copy the
files using `kubectl cp` command into the cluster. The following commands show how to copy your
backup file into the cluster.

```bash
kubectl apply -f utils/sitewhere-mongodb-backup-pod.yaml
kubectl cp <YOUR_BACKUP_DIR> sitewhere-backup-admin-pod:/dump
kubectl delete -f utils/sitewhere-mongodb-backup-pod.yaml
```

**Note:** If you are using `rook-ceph-block`, be aware of the `RWO` limitation of this storage class.
This means that only one `Pod` can have the `sitewhere-mongodump-pvc` PVC mounted on its filesystem.

### Restore MongoDB Database

```bash
kubectl apply -f utils/sitewhere-mongodb-restore-job.yaml
```

### Upscale SiteWhere Microservices

```bash
kubectl scale deploy --replicas=1 -l sitewhere.io/role=microservice
```
