# :book: Debugging SiteWhere

<Seo/>

In order to debug SiteWhere debug images need to be deploy on the Kubernetes clusters.
SiteWhere debug microservices images uses [Java Debug Wire Protocol](https://docs.oracle.com/javase/7/docs/technotes/guides/jpda/jdwp-spec.html) for
communication between a debugger and the Java virtual machine (VM) that runs
the microservice. To this end, each microservice exposes JDWP on port 8001 and
the Helm Chart translate that port as a `NodePort` in the Kubernetes Cluster
according to the table below.

| Microservice             | JDWP Port      | JMX Port        |
| ------------------------ | -------------- | --------------- |
| Instance Managemwnt      | 8001           | 1101            |
| User Management          | 8002           | 1102            |
| Tenant Management        | 8003           | 1103            |
| Device Management        | 8004           | 1104            |
| Event Management         | 8005           | 1105            |
| Asset Management         | 8006           | 1106            |
| Event Sources            | 8007           | 1107            |
| Inbound Processing       | 8008           | 1108            |
| Label Generation         | 8009           | 1109            |
| Web Rest                 | 8010           | 1110            |
| Batch Operations         | 8011           | 1111            |
| Command Delivery         | 8012           | 1112            |
| Device Registration      | 8013           | 1113            |
| Device State             | 8014           | 1114            |
| Event Search             | 8015           | 1115            |
| Outbound Connectors      | 8016           | 1116            |
| Rule Processing          | 8017           | 1117            |
| Schedule Management      | 8018           | 1118            |
| Streaming Media          | 8019           | 1119            |

::: tip
Please refer to [Creating Debug Images](./README.md#creating-debug-images) section on
how to build SiteWhere debug images.
:::

## Using Helm to Install Debug Images

SiteWhere Helm Chart provides the tooling necessary to install _debug_ images on Kubernetes.
To install SiteWhere debug image set `services.debug` to `true`. For example, to install
SiteWhere _default_ profile debug images use the following command:

```console
helm install --name sitewhere --set services.debug=true ./sitewhere
```

## Connecting the debugger to SiteWhere

First, you need to have a workspace with source code version of the debug image you are running.
You can you Eclipse and import the sources code. It should look like the image below.

<InlineImage src="/images/development/debug-workspace.png" caption="SiteWhere Workspace"/>

After that you need to forward the JDWP port of the microservice you want to connect the debugger to.
For example, if you want to connect the debugger to Device Management use the following command:

```console
kubectl port-forward deployment/sitewhere-device-management 8004:8001
```

Once you have JPWD port forwarded you need to create a Remove Java Application Debug
Configuration. Go to `Run → Debug Configuration`. Select `Remote Java Application` and click
on `New lunch configuration`.

<InlineImage src="/images/development/debug-create-remote-java-application.png" caption="Create Remove Java Application Debugger"/>

Then select the _project_ you want to debug the _hostname_ and _port_. In the example below, the project selected is
Device Management, the hostname is _localhost_ since we are locally forwarding the port and _8004_ is the port
we are forwarding.

<InlineImage src="/images/development/debug-sample-remote-java-application.png" caption="Sample Remove Java Application Debugger"/>

Once you enter this configuration, click on `Debug` to start the debugger. You should be able to connect to the remote
host, add break points and see the threads running like in the image below.

<InlineImage src="/images/development/debug-connect-debugger.png" caption="Debug Remove Java Application"/>

If you get an error like the image below, please check that you running the debug images, that you
have forwarded the port of the microservice you want to debug and that you have enter the hostname and port
correctly.

<InlineImage src="/images/development/debug-fail-to-connect.png" caption="Debug Fail to Connect"/>
