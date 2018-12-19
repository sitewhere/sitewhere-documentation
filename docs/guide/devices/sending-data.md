# Sending Data to SiteWhere 2.0

SiteWhere is designed to be flexible in the way that it sends and receives data from devices and other agents.
Most popular communication protocols and encodings are supported out-of-the-box, but the system is also designed
to be easily extended. Each system tenant can have any number of protocols configured for communicating with
devices. By default, tenants are configured to communicate over MQTT with support for multiple encodings
to allow for interactions with many types of devices.

## Sending Device Data

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

| Field       | Description                                                                                                               |
| ------------| ------------------------------------------------------------------------------------------------------------------------- |
| deviceToken | Device token that uniquely identifies a device within a tenant. This informs the system which device is generating events.|
| type        | The type of request for the device. This indicates how the data in the _request_ section should be interpreted.           |
| originator  | This field is used by devices if they are sending an event in response to a command, indicating the _id_ of the command.  |
| request     | The request content which is specific to the type of packet being sent as indicated by the _type_ field.                  |

### Sending Device Data Using Profocol Buffer

```groovy
compile group: 'com.sitewhere', name: 'sitewhere-device-protobuf', version:'2.0.0-SNAPSHOT'
```

### Registering a Device

Before devices can send event data, they must be registered with the system. SiteWhere will send back a
response on the system command channel to indicate whether the device could be registered. It will also
indicate if the device was already registered or not. 

#### Registering a Device with JSON

The JSON packet below can be used to register a device:

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

#### Registering a Device with Protocol Buffer

The Protocol Buffer packet below can be used to register a device:

```java
import com.sitewhere.communication.protobuf.proto.SiteWhere;
import com.sitewhere.communication.protobuf.proto.SiteWhere.DeviceEvent.Command;

...

// Header
SiteWhere.DeviceEvent.Header.Builder headerBuilder = SiteWhere.DeviceEvent.Header.newBuilder();
// Command
headerBuilder.setCommand(Command.SendRegistration);
// Device Token
headerBuilder.setDeviceToken(GOptionalString.newBuilder().setValue("mydevicetoken"));
//Originator
headerBuilder.setOriginator(GOptionalString.newBuilder().setValue("originator"));

// Payload
SiteWhere.DeviceEvent.DeviceRegistrationRequest.Builder builder =
  SiteWhere.DeviceEvent.DeviceRegistrationRequest.newBuilder();

builder.getAreaTokenBuilder().setValue("myareatoken");
builder.getCustomerTokenBuilder().setValue("mycustomertoken");
builder.getDeviceTypeTokenBuilder().setValue("mydevicetoken");
builder.putAllMetadata(myMetadata);

SiteWhere.DeviceEvent.DeviceRegistrationRequest payload = builder.build();
```

### Send Device Measurement

SiteWhere supports storing measurements related to a device as event data.

#### Send Device Measurement with JSON

The JSON format for sending a device measurement is shown below:

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

| Field           | Description                                                |
| --------------- | ---------------------------------------------------------- |
| type            | `DeviceMeasurement`                                        |
| name            | Name of the measurement being send.                        |
| value           | Value of the measurement being send.                       |
| updateState     | if `true`, it updates the `DeviceState` of the Assignement |
| eventDate       | Timestamp of the event.                                    |
| metadata        | The metadata of the event.                                 |

#### Send Device Measurement with Protocol Buffers

The Protocol Buffers format for sending a device measurement is shown below:

```java
import com.sitewhere.communication.protobuf.proto.SiteWhere;
import com.sitewhere.communication.protobuf.proto.SiteWhere.DeviceEvent.Command;

...

// Header
SiteWhere.DeviceEvent.Header.Builder headerBuilder = SiteWhere.DeviceEvent.Header.newBuilder();
// Command
headerBuilder.setCommand(Command.SendMeasurement);
// Device Token
headerBuilder.setDeviceToken(GOptionalString.newBuilder().setValue("mydevicetoken"));
//Originator
headerBuilder.setOriginator(GOptionalString.newBuilder().setValue("originator"));

// Payload
SiteWhere.DeviceEvent.DeviceMeasurement.Builder builder = SiteWhere.DeviceEvent.DeviceMeasurement.newBuilder();
builder.setEventDate(GOptionalFixed64.newBuilder().setValue(new Date().getTime()));
builder.setMeasurementName(GOptionalString.newBuilder().setValue("temp"));
builder.setMeasurementValue(GOptionalDouble.newBuilder().setValue(34.7));

SiteWhere.DeviceEvent.DeviceMeasurement payload = builder.build();
```

### Send Device Location

SiteWhere supports storing locations related to a device as event data.

#### Send Device Location with JSON

The JSON format for sending a device locacation is shown below:

```json
{
  "type":"DeviceLocation",
  "originator":"device",
  "deviceToken":"mydevicetoken",
  "request": {
    "latitude": "33.75",
    "latitude": "-84.39",
    "elevation": "1",
    "updateState": true,
    "eventDate": "2018-11-03T19:40:03.390Z"
  }
}
```

| Field           | Description                                                |
| --------------- | ---------------------------------------------------------- |
| type            | `DeviceLocation`                                           |
| latitude        | Latitud of the Location being send.                        |
| latitude        | Longitud of the Location being send.                       |
| elevation       | Elevation of the Location being send.                      |
| updateState     | if `true`, it updates the `DeviceState` of the Assignement |
| eventDate       | Timestamp of the event.                                    |
| metadata        | The metadata of the event.                                 |

#### Send Device Location with Protocol Buffers

The Protocol Buffers format for sending a device locacation is shown below:

```java
import com.sitewhere.communication.protobuf.proto.SiteWhere;
import com.sitewhere.communication.protobuf.proto.SiteWhere.DeviceEvent.Command;

...

// Header
SiteWhere.DeviceEvent.Header.Builder headerBuilder = SiteWhere.DeviceEvent.Header.newBuilder();
// Command
headerBuilder.setCommand(Command.SendLocation);
// Device Token
headerBuilder.setDeviceToken(GOptionalString.newBuilder().setValue("mydevicetoken"));
//Originator
headerBuilder.setOriginator(GOptionalString.newBuilder().setValue("originator"));

// Payload
SiteWhere.DeviceEvent.DeviceMeasurement.Builder builder = SiteWhere.DeviceEvent.DeviceMeasurement.newBuilder();
builder.setEventDate(GOptionalFixed64.newBuilder().setValue(new Date().getTime()));
builder.setMeasurementName(GOptionalString.newBuilder().setValue("temp"));
builder.setMeasurementValue(GOptionalDouble.newBuilder().setValue(34.7));

SiteWhere.DeviceEvent.DeviceMeasurement payload = builder.build();
```

### Sending Device Alert

SiteWhere supports storing alerts for exceptional conditions as event data.

#### Sending Device Alert with JSON

The JSON format for sending a device alert is shown below:

```json
{
  "type":"DeviceAlert",
  "originator":"device",
  "deviceToken":"mydevicetoken",
  "request": {
    "type": "Warning",
    "message": "Engine overheat.",
    "eventDate": "2018-11-03T19:40:03.390Z"
  }
}
```

| Field           | Description                                                |
| --------------- | ---------------------------------------------------------- |
| type            | `DeviceAlert`                                              |
| type            | Type of the Alter `Info`,`Warning`,`Error`,`Fatal`         |
| message         | Message assosiated with the Alert.                         |
| eventDate       | Timestamp of the event.                                    |
| metadata        | The metadata of the event.                                 |

#### Send Device Alert with Protocol Buffers

The Protocol Buffers format for sending a device alert is shown below:

```java
import com.sitewhere.communication.protobuf.proto.SiteWhere;
import com.sitewhere.communication.protobuf.proto.SiteWhere.DeviceEvent.Command;

...

// Header
SiteWhere.DeviceEvent.Header.Builder headerBuilder = SiteWhere.DeviceEvent.Header.newBuilder();
// Command
headerBuilder.setCommand(Command.SendAlert);
// Device Token
headerBuilder.setDeviceToken(GOptionalString.newBuilder().setValue("mydevicetoken"));
//Originator
headerBuilder.setOriginator(GOptionalString.newBuilder().setValue("originator"));

// Payload
SiteWhere.DeviceEvent.DeviceAlert.Builder builder = SiteWhere.DeviceEvent.DeviceAlert.newBuilder();
builder.setEventDate(GOptionalFixed64.newBuilder().setValue(new Date().getTime()));
builder.setAlertType(GOptionalString.newBuilder().setValue("Warning"));
builder.setAlertMessage(GOptionalString.newBuilder().setValue("Engine overheat."));
SiteWhere.DeviceEvent.DeviceAlert payload = builder.build();
```
