# Modelo de Objeto de Dominio

<Seo/>

SiteWhere incluye un modelo de objeto completo que contiene
entidades destinadas a representar objetos del mundo real que interactúan 
con aplicaciones IoT.
Muchos de los conceptos siguen siendo bastante genéricos, de modo 
que el mismo modelo puede representar una variedad de mercados verticales potenciales.

## Identificación de Entidad

La mayoría de las entidades de SiteWhere tienen dos identificadores únicos 
separados. El identificador principal es un [UUID] (https://en.wikipedia.org/wiki/Universally_unique_identifier) ​​
que el sistema asigna cuando se crea la entidad y no cambia durante la vida útil 
de la entidad. Un segundo identificador, que es único dentro del tipo de entidad,
es un _token_ que es una cadena asignada a través de las API y actualizada
en cualquier momento. Este enfoque permite que el token de una entidad cambie con 
el tiempo si es necesario sin la necesidad de actualizar el identificador en las 
relaciones que hacen referencia a la entidad. Todas las operaciones de API actúan
sobre el token de entidad, mientras que todas las referencias internas entre entidades usan el UUID interno.

## Áreas Funcionales

El modelo de objetos de SiteWhere cubre muchas áreas funcionales.

### Gestión de Dispositivos

Una de las funciones principales de una plataforma IoT es representar
los dispositivos con los que interactúa la plataforma. SiteWhere proporciona
un modelo completo para capturar información sobre los dispositivos
gestionado por el sistema y para organizarlos de modo que el contexto sea
proporcionado alrededor de los datos generados por los dispositivos.

### Gestión de Activos

Los dispositivos a menudo se implementan en asociación con activos del mundo 
real que derivan algún servicio del dispositivo. Los casos de uso incluyen:

- un dispositivo de rastreo asociado con un automóvil en la vertical de rastreo de flota
- una insignia asociada con una persona en la vertical de seguridad
- un monitor cardíaco asociado con una cama en un vertical sanitario

SiteWhere proporciona un modelo de gestión de activos para almacenar activos 
que pueden estar asociados con dispositivos del sistema. Se pueden proporcionar 
sistemas de gestión de activos externos basados ​​en el mismo conjunto de API en los 
casos en que los activos deban gestionarse externamente.

### Gestión de Eventos

El modelo de gestión de eventos se utiliza para capturar eventos temporales relacionados 
con dispositivos. Esto incluye datos de telemetría y cambios de estado del dispositivo, 
así como datos de auditoría como invocaciones de comandos y respuestas. Los eventos del 
dispositivo se almacenan como datos de series de tiempo y generalmente se conservan por 
separado de los datos de administración del dispositivo debido a su naturaleza temporal 
y a gran escala en relación con los "maestros" de datos.

Todos los eventos del dispositivo comparten campos comunes, como la fecha en que ocurrió 
el evento, la fecha en que se recibió el evento, la identificación del dispositivo, la 
asignación actual del dispositivo y varias asociaciones que pueden usarse para 
filtrar / agregar datos de eventos. Además, cada subtipo de evento de dispositivo contiene 
datos adicionales específicos de su función.
