# Sending Data to SiteWhere 2.0

SiteWhere is designed to be flexible in the way that it sends and receives data from devices and other agents.
Most popular communication protocols and encodings are supported out-of-the-box, but the system is also designed
to be easily extended. Each system tenant can have any number of protocols configured for communicating with
devices. By default, tenants are configured to communicate over MQTT with support for multiple encodings
to allow for interactions with many types of devices.

## Sending Device Data Using JSON

### JSON Packet Format

The following sections show examples of JSON data structured to interact with SiteWhere. All JSON packets share
some common information as shown below:

```json
{
  "deviceToken": "(unique device token)",
  "type": "(indicator for request type)",
  "originator": "(originator of the message)",
  "request": {
    ...
  }
}
```

| Field       | Description                               |
| ----------- | ----------------------------------------- |
| deviceToken | Device token that uniquely identifies a device within a tenant. This informs the system which device is generating events.|
| type        | The type of request for the device. This indicates how the data in the _request_ section should be interpreted. |
| originator  | ?? |
| request     | The request content which is specific to the type of packet being sent as indicated by the _type_ field. |

### Register a Device

```json
{
  "type": "RegisterDevice",
  "deviceToken": "mydevicetoken",
  "originator": "device",
  "request": {
    "areaToken": "southeast",
    "customerToken": "acme",
    "deviceTypeToken": "raspberrypi",
    "metadata": {
      "name1": "val1",
      "name2": "val2"
    }
  }
}
```

| Field           | Description                                                |
| --------------- | ---------------------------------------------------------- |
| type            | `RegisterDevice`                                           |
| areaToken       | A token that specifies the `Area` being registered.        |
| customerToken   | A token that specifies the `Customer` being registered     |
| deviceTypeToken | A token that specifiies the `Device Type` being registered |
| metadata        | The metadata of the device being registered                |

```json
{
  "type":"DeviceMeasurement",
  "originator":"device",
  "deviceToken":"mydevicetoken",
  "request":{
    "name":"temp",
    "value":"34.7",
    "updateState": true,
    "eventDate":"2018-11-21T22:10:13.418-0300",
    "metadata": {
      "name1": "val1",
      "name2": "val2"
    }
  }
}
```

## Sending Device Data Using Profocol Buffer

```gradle
    compile group: 'com.sitewhere', name: 'sitewhere-device-protobuf', version:'2.0.0-SNAPSHOT'
```

```java
import com.sitewhere.communication.protobuf.proto.SiteWhere;
import com.sitewhere.communication.protobuf.proto.SiteWhere.DeviceEvent.Command;
...

// Header
SiteWhere.DeviceEvent.Header.Builder headerBuilder = SiteWhere.DeviceEvent.Header.newBuilder();
// Command
headerBuilder.setCommand(Command.SendRegistration);
// Device Token
headerBuilder.setDeviceToken(
  headerBuilder.getDeviceTokenBuilder().setValue("mydevicetoken").build());

// Payload
SiteWhere.DeviceEvent.DeviceRegistrationRequest.Builder builder =
  SiteWhere.DeviceEvent.DeviceRegistrationRequest.newBuilder();

builder.getAreaTokenBuilder().setValue("myareatoken");
builder.getCustomerTokenBuilder().setValue("mycustomertoken");
builder.getDeviceTypeTokenBuilder().setValue("mydevicetoken");
builder.putAllMetadata(myMetadata);

SiteWhere.DeviceEvent.DeviceRegistrationRequest payload = builder.build();
```

```java
import com.sitewhere.communication.protobuf.proto.SiteWhere;
import com.sitewhere.communication.protobuf.proto.SiteWhere.DeviceEvent.Measurement;

...

SiteWhere.DeviceEvent.DeviceMeasurements.Builder builder =
  SiteWhere.DeviceEvent.DeviceMeasurements.newBuilder();

builder.getEventDateBuilder().setValue(new Date().getTime());

builder.addMeasurement(Measurement.newBuilder()
  .setMeasurementId(builder.addMeasurementBuilder().getMeasurementIdBuilder()
    .setValue("temp").build())
  .setMeasurementValue(builder.addMeasurementBuilder().getMeasurementValueBuilder()
    .setValue(34.7).build())
  .build());

SiteWhere.DeviceEvent.DeviceMeasurements payload = builder.build();
```
