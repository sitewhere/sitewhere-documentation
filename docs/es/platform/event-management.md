# Modelo de Gestión de Eventos

<Seo/>

El modelo de gestión de eventos se utiliza para capturar eventos temporales relacionados
con dispositivos.
Esto incluye datos de telemetría y cambios de estado del dispositivo, así como datos de 
auditoría como invocaciones de comandos y respuestas.
Los eventos del dispositivo se almacenan como datos de series de tiempo y generalmente 
se conservan por separado de los datos de administración del dispositivo debido a su 
naturaleza temporal y a gran escala en relación con los "maestros" de datos.

Todos los eventos del dispositivo comparten campos comunes, como la fecha en que ocurrió 
el evento, la fecha en que se recibió el evento, la identificación del dispositivo, la 
asignación actual del dispositivo y varias asociaciones que pueden usarse para filtrar / agregar 
datos de eventos. Además, cada subtipo de evento de dispositivo contiene datos adicionales 
específicos de su función.

## Eventos de medición

Los eventos de medición contienen un nombre de medición y un valor de medición y se 
utilizan para capturar datos de telemetría de los dispositivos. Ejemplos incluyen:

- Lecturas de combustible de equipo pesado en un sitio de construcción
- Frecuencia cardíaca para un monitor cardíaco en un centro de salud
- Velocidad registrada para un vehículo en una aplicación de seguimiento de flota

## Eventos de Ubicación

Los eventos de ubicación rastrean la ubicación (latitud / longitud / elevación) de un 
dispositivo en un punto específico en el tiempo.
Los eventos de ubicación se pueden usar junto con áreas y zonas para realizar la lógica 
en respuesta a un dispositivo que entra / sale de los límites establecidos.

## Eventos de alerta

Los eventos de alerta indican que se ha producido una condición excepcional. Un alerta 
incluye un tipo de alerta, mensaje, nivel de alerta y otra información que proporciona 
contexto en cuanto a la condición que ocurrió. Las alertas se pueden usar para activar 
otras acciones del sistema basadas en la lógica empresarial agregada a la canalización 
de procesamiento de eventos.

## Eventos de Invocación de Comandos

Cada vez que se invoca un comando a través de las API de SiteWhere, se registra un 
evento de invocación de comando.
La canalización de procesamiento de eventos pasa el evento al microservicio de entrega 
de comandos, que se encarga de empaquetar el comando en el formato correcto y entregar 
el comando al dispositivo de destino. Los eventos de invocación de comandos también 
proporcionan una pista de auditoría de los comandos emitidos junto con cómo se invocaron 
y quién los invocó.

## Eventos de Respuesta de Comando

Cuando se envían comandos a los dispositivos, hay casos en los que el dispositivo envía 
datos en respuesta al comando. En los casos en que se envía una identificación de evento 
de origen junto con otros datos de evento, el evento se registra como una respuesta de 
comando, por lo que la respuesta puede correlacionarse nuevamente con el evento que la 
originó. Esto permite rastrear si se han recibido comandos en los casos en que se 
requiere un reconocimiento.

## Eventos de Cambio de Estado

Los eventos de cambio de estado se utilizan para transmitir cambios en el estado interno 
del dispositivo, así como otros cambios de estado a nivel del sistema, como las 
actualizaciones de detección de presencia. Los dispositivos pueden enviar eventos de 
cambio de estado para casos como entrar en modo de suspensión o detectar un estado de 
batería baja.
