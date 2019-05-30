# Enviar datos a SiteWhere 2.0

SiteWhere está diseñado para ser flexible en la forma en que envía y recibe datos de dispositivos y otros agentes.
La mayoría de los protocolos y codificaciones de comunicación más populares son compatibles de fábrica,
pero el sistema también está diseñado para ser extendido fácilmente. Cada inquilino del sistema puede tener
cualquier número de protocolos configurados para comunicarse con dispositivos. De forma predeterminada,
los inquilinos están configurados para comunicarse a través de MQTT con soporte para múltiples codificaciones
para permitir interacciones con muchos tipos de dispositivos.

## Enviando datos del dispositivo

### Formato del Paquete JSON

Las siguientes secciones muestran ejemplos de datos JSON estructurados para interactuar con SiteWhere. 
Todos los paquetes JSON comparten información común como se muestra a continuación:

```json
{
  "deviceToken": "(Token único del dispositivo)",
  "type": "(indicador del pedido)",
  "originator": "(originator of the message)",
  "request": {
    ...
  }
}
```

| Campo       | Descripción                                                                                                               |
| :-----------| :------------------------------------------------------------------------------------------------------------------------ |
| deviceToken | El token del dispositivo que identifica de forma única un dispositivo dentro de un inquilino. Esto informa al sistema qué dispositivo está generando eventos. |
| type        | El tipo de solicitud para el dispositivo. Esto indica cómo deben interpretarse los datos en la sección _request_.         |
| originator  | Este campo es utilizado por los dispositivos si envían un evento en respuesta a un comando, indicando el _id_ del comando.|
| request     | El contenido de la solicitud que es específico para el tipo de paquete que se envía, como lo indica el campo _type_.      |

### Enviando datos del dispositivo usando Profocol Buffer

To send data to SiteWhere using Protocol Buffers, use the `sitewhere-device-protobuf` library provided by
the SiteWhere development team. To import it using [Gradle](https://gradle.org) use the instruction.

```groovy
compile group: 'com.sitewhere', name: 'sitewhere-device-protobuf', version:'2.0.4'
```

To import the library from a project [Maven](https://maven.apache.org/) use the following entry in your `pom.xml`.

```xml
<dependency>
    <groupId>com.sitewhere</groupId>
    <artifactId>sitewhere-device-protobuf</artifactId>
    <version>2.0.4</version>
</dependency>
```

### Registrar un Dispositivo

Antes de que los dispositivos puedan enviar datos de eventos, deben registrarse con el sistema.
SiteWhere enviará una respuesta en el canal de comando del sistema para indicar si el dispositivo podría registrarse.
También indicará si el dispositivo ya estaba registrado o no. 

#### Registrar un Dispositivo con JSON

El siguiente paquete JSON se puede usar para registrar un dispositivo:

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

| Campo           | Descripción                                                                     |
| :-------------- | :------------------------------------------------------------------------------ |
| type            | `RegisterDevice`                                                                |
| areaToken       | Un token que especifica el `Area` del dispositivo que se esta registrado.       |
| customerToken   | Un token que especifica el `Customer` del dispositivo que se esta registrado.   |
| deviceTypeToken | Un token que especifica el `Device Type` del dispositivo que se esta registrado.|
| metadata        | La metadata del dispositivo que se esta registrado.                             |

#### Registrar un Dispositivo con Profocol Buffer

De igual manera, se puede registrar el dispositivo utilizando Java y Protocol Buffers de la siguiente manera:

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

### Enviar Mediciones del Dispositivo

#### Enviar Mediciones del Dispositivo con JSON

SiteWhere admite el almacenamiento de mediciones relacionadas con un dispositivo como datos de eventos.
El formato JSON para enviar una medición del dispositivo se muestra a continuación:

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

| Campo           | Descripción                                                |
| :-------------- | :--------------------------------------------------------- |
| type            | `DeviceMeasurement`                                        |
| name            | Nombre de la medeción que se está enviando.                |
| value           | Valor de la medeción que se está enviando.                 |
| updateState     | Si es `true`, actualiza el `DeviceState` de la asigación.  |
| eventDate       | Timestamp del evento.                                      |
| metadata        | The metadata del evento.                                   |

#### Enviar Mediciones del Dispositivo con Protocol Buffers

El formato Protocol Buffers para enviar una medición del dispositivo se muestra a continuación:

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

### Enviar Ubicación del Dispositivo

SiteWhere admite el almacenamiento de ubicaciones relacionadas con un dispositivo como datos de eventos.

#### Enviar Ubicación del Dispositivo con JSON

El formato JSON para enviar una ubicación de dispositivo se muestra a continuación:

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

| Campo           | Descripción                                                |
| :-------------- | :--------------------------------------------------------- |
| type            | `DeviceLocation`                                           |
| latitude        | Latitud de la Ubicación que se está enviando.              |
| latitude        | Longitud de la Ubicación que se está enviando.             |
| elevation       | Elevación de la Ubicación que se está enviando.            |
| updateState     | Si es `true`, actualiza el `DeviceState` de la asigación. |
| eventDate       | Timestamp del evento.                                      |
| metadata        | The metadata del evento.                                   |

#### Enviar Ubicación del Dispositivo con Protocol Buffers

El formato Protocol Buffers para enviar una ubicación de dispositivo se muestra a continuación:

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

### Enviar Alertas del Dispositivo

SiteWhere admite el almacenamiento de alertas relacionadas con un dispositivo como datos de eventos.

#### Enviar Alertas del Dispositivo con JSON

El formato JSON para enviar una alerta de dispositivo se muestra a continuación:

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

| Campo           | Descripción                                                |
| :-------------- | :--------------------------------------------------------- |
| type            | `DeviceAlert`                                              |
| type            | Tipo de Alerta `Info`,`Warning`,`Error`,`Fatal`            |
| message         | Mensaje asociado a la Alerta                               |
| eventDate       | Timestamp del evento.                                      |
| metadata        | The metadata del evento.                                   |

#### Enviar Alertas del Dispositivo con Protocol Buffers

El formato Protocol Buffers para enviar una alerta de dispositivo se muestra a continuación:

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
