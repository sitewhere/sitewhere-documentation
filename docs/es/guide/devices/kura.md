# Programación de Dispositivos con el Kura

El [Conector](https://github.com/sitewhere/sitewhere-kura) de SiteWhere Kura Cloud provee
la conectividad necesaria para las aplicaciones Kura puedan comunicarse con SiteWhere 2.0.

## Desplegar SiteWhere Kura Cloud Connector

Para desplegar el conector SiteWhere Kura Cloud Connector, sila los siguientes
[pasos](https://eclipse.github.io/kura/dev/deploying-bundles.html).

## Configurar SiteWhere Kura Cloud Connector

Una vez desplegado el bundle en el dispotivo que corre Kura, es necesario create una _Nueva Conexión_ Cloud.
Seleccione el _Cloud Connection Factory PID_ del tipo `com.sitewhere.cloud.SiteWhereCloudService` e introduzca
el _Cloud Connection Service PID_ siguiente el patrón `com.sitewhere.cloud.SiteWhereCloudService(-[a-zA-Z0-9]+)?$`, por
ejemplo:`com.sitewhere.cloud.SiteWhereCloudService-1`.

<InlineImage src="/images/guide/kura-new-connector.png" caption="SiteWhere Kura MQTT Settings"/>

Luego de esto, se necesita configurar las preferencias MQTT del SiteWhere Kura Cloud Connector,
con la URL de SiteWhere 2.0 MQTT, como se muestra en la siguiente imagen.

<InlineImage src="/images/guide/kura-mqtt.png" caption="SiteWhere Kura MQTT Settings"/>

Además, se necesita configurar el _SiteWhere Kura Cloud Service_ con la información
necesaria para registrar el dispositivo:

<InlineImage src="/images/guide/kura-cloud.png" caption="SiteWhere Kura Cloud Connector"/>

La siguiente tabla muestra los parámentro necesarios para configurar _SiteWhere Kura Cloud Service_.

| Field           | Description                                                |
| --------------- | ---------------------------------------------------------- |
| Tenant          | Id of the tenant of the device.                            |
| areaToken       | A token that specifies the `Area` being registered.        |
| customerToken   | A token that specifies the `Customer` being registered     |
| deviceTypeToken | A token that specifiies the `Device Type` being registered |

