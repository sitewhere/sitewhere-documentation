# SiteWhere Kura Programming

SiteWhere Kura Cloud [Connector](https://github.com/sitewhere/sitewhere-kura)
provides the connectivity necesary for your Kura Application to connect to SiteWhere 2.0.

## Deploy SiteWhere Kura Cloud Connector

To deploy SiteWhere Kura Cloud Connector, follow the this [steps](https://eclipse.github.io/kura/dev/deploying-bundles.html).

## Configure SiteWhere Kura Cloud Connector

Once deployed on your device, you to create a _New Connection_. Select the _Cloud Connection Factory PID_
of the type `com.sitewhere.cloud.SiteWhereCloudService` and the _Cloud Connection Service PID_ with pattern of
`com.sitewhere.cloud.SiteWhereCloudService(-[a-zA-Z0-9]+)?$`, for example `com.sitewhere.cloud.SiteWhereCloudService-1`.

<InlineImage src="/images/guide/kura-new-connector.png" caption="SiteWhere Kura MQTT Settings"/>

After that, you need to configure SiteWhere Kura Cloud Connector MQTT Settings
with SiteWhere 2.0 MQTT URL, as shown in the image below.

<InlineImage src="/images/guide/kura-mqtt.png" caption="SiteWhere Kura MQTT Settings"/>

Alse, you need to configure SiteWhere Kura Cloud Service with the information needed to register the device:

<InlineImage src="/images/guide/kura-cloud.png" caption="SiteWhere Kura Cloud Connector"/>

| Field           | Description                                                |
| --------------- | ---------------------------------------------------------- |
| Tenant          | Id of the tenant of the device.                            |
| areaToken       | A token that specifies the `Area` being registered.        |
| customerToken   | A token that specifies the `Customer` being registered     |
| deviceTypeToken | A token that specifiies the `Device Type` being registered |
