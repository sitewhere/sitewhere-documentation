# Modelo de Gestión de Dispositivos

<Seo/>

Una de las funciones principales de una plataforma IoT es representar los dispositivos 
con los que interactúa la plataforma. SiteWhere proporciona un modelo integral para capturar
información sobre los dispositivos administrados por el sistema y para organizarlos de 
modo que se brinde contexto en torno a los datos generados por los dispositivos.

## Tipos de dispositivos

La plataforma puede interactuar con muchos tipos de dispositivos, cada uno con sus propias
características. Estos incluyen aspectos como el hardware del dispositivo, la configuración
de opciones, indicadores de estado y comandos disponibles. Los _tipo de dispositivo_ de SiteWhere
se utilizan para capturar información sobre una clase de dispositivos con
características similares.

::: tip
Los _tipos de dispositivos_ de SiteWhere 2.0 corresponden a 
_especificaciones del dispositivo_ de SiteWhere 1.x. 
Todas las características del modelo previo permanecen en 2.0.
:::

### Comandos de dispositivos

Cada tipo de dispositivo puede contener una lista de comandos que son aceptados por
el dispositivo. Los comandos se identifican mediante un espacio de nombres y nombre único,
junto con una lista de parámetros con nombre fuertemente tipados.
Los actores externos pueden emitir eventos de invocación de comando de dispositivo, que
a su vez se comunican con dispositivos para transmitir un comando de información
al dispositivo

### Estados de dispositivos

Cada tipo de dispositivo puede tener muchos valores de estado potenciales que reflejan
el estado interno de un dispositivo. El estado de un dispositivo contiene información
como un código único, icono, texto en pantalla e información de color que
puede usarse para representar el indicador de estado en aplicaciones que usan
las API de SiteWhere.

### Dispositivos

Los dispositivos representan instancias del mundo real de un tipo de dispositivo que puede
interactuar con el sistema. Cada dispositivo tiene un token de dispositivo único
que se utiliza al registrar, actualizar o asociar datos con
el dispositivo.

### Asignaciones de dispositivos

Los dispositivos pueden estar asociados con varias entidades durante su vida útil
para proporcionar contexto para el dispositivo en un punto de tiempo dado. La entidad
que captura estas asociaciones se llama una "asignación de dispositivo". Ejemplos
de las asociaciones de asignación de dispositivos incluyen propiedad del cliente, geoespacial
ubicación y asociación con diversos activos. Una asignación de dispositivo es
efectivo por un período de tiempo dado mientras se considera _activo_ y
puede marcarse como _released_ cuando ya no esté vigente. La lista de dispositivo
las asignaciones a lo largo del tiempo proporcionan un registro histórico para el dispositivo. 
Asociaciones de la asignación actual del dispositivo se almacenan con los eventos del dispositivo en orden
para proporcionar contexto al consultar los datos del evento.

::: tip
A partir de SiteWhere 2.1, un dispositivo puede tener múltiples asignaciones simultáneas 
de dispositivos. Tenga en cuenta que los dispositivos con múltiples asignaciones generarán 
múltiples eventos cuando se reciban datos del dispositivo, ya que los datos de contexto 
de cada asignación se fusionarán como parte de la construcción de los eventos. Esto 
permite que los eventos se consulten posteriormente en función de múltiples contextos 
debido a las asignaciones que estaban vigentes en el momento del evento.
:::

## Asociaciones de clientes

El concepto de cliente se utiliza para inferir la propiedad corporativa de un dispositivo.
Un dispositivo determinado puede asignarse a muchos clientes diferentes durante su vida útil.
Cuando se registran eventos para un dispositivo, los eventos incluyen una referencia al cliente 
asignado al dispositivo en el momento del evento.

::: tip
Tenga en cuenta que los clientes son generalmente entidades corporativas en lugar de individuos.
Para asociar un dispositivo con un individuo, un _personal_personal_ asociado es generalmente 
una mejor opción.
:::

### Tipos de clientes

Los tipos de clientes se utilizan para agrupar tipos de clientes relacionados. Son de naturaleza 
jerárquica, por lo que los tipos de clientes pueden ser padres o hijos de otros tipos de clientes. 
Por ejemplo, en la construcción vertical, la jerarquía de tipo de cliente podría ser `División> Municipio> Sitio`.
Se pueden adjuntar metadatos adicionales e información de marca a cada tipo de cliente para 
proporcionar más contexto.

### Clientes

Los clientes son instancias de tipos de clientes que representan entidades del mundo real
que reflejan la propiedad de los dispositivos. Cada cliente puede tener un cliente 
principal y cualquier número de clientes secundarios según la jerarquía establecida en 
los tipos de clientes. Un ejemplo de clientes basado en la jerarquía de tipos de clientes 
anterior sería `División comercial> Atlanta> Sitio 777 Peachtree`.

## Asociaciones de Área

Un dispositivo determinado puede asignarse a muchas áreas durante su vida útil. Cuando 
se registran eventos para un dispositivo, incluyen una referencia al área asignada al 
dispositivo en el momento del evento. Estos datos se pueden usar para crear mapas de 
calor y otras visualizaciones basadas en eventos que ocurren cerca de una ubicación 
determinada.

::: tip
Las _areas_ de SiteWhere 2.0 corresponden a SiteWhere 1.x _sites_. La mayoría de las 
características del modelo anterior permanecen en 2.0, pero las áreas ahora definen 
un polígono delimitador en lugar de solo la latitud / longitud central utilizada en 1.x.
:::

### Tipo de Área

Los tipos de área proporcionan contexto para las áreas y están organizados en una jerarquía padre-hijo.
En general, los tipos de área principal están destinados a ser contenedores para los tipos secundarios. 
Por ejemplo, en una vertical de hotel, la jerarquía de tipo de área
podría ser `Región> Hotel> Piso> Habitación`. Se pueden adjuntar metadatos adicionales e información de marca a cada tipo de área para proporcionar más contexto.

### Áreas

Las áreas son instancias de tipos de áreas que representan ubicaciones geoespaciales del 
mundo real que proporcionan contexto para los dispositivos. Un área tiene un polígono 
delimitador de lat / longs que define los bordes de la entidad. Un ejemplo de áreas que 
se ajustan a la jerarquía de tipo de área anterior sería `Región sudeste> Marqués de Mariot> Piso 20> Sala 2001`.

### Zonas

Las zonas son entidades geoespaciales limitadas que tienen áreas como padres. Un área 
puede contener cualquier número de zonas, que se utilizan para significar una parte del 
área que tiene un significado particular. Por ejemplo, si modela un aeropuerto como un 
área, las secciones de acceso restringido podrían marcarse como zonas. Al procesar 
eventos desde un dispositivo ubicado en el aeropuerto, se pueden generar eventos de 
alerta al ingresar a zonas restringidas. Junto con los delimitadores latitud / longitud 
para una zona, se almacenan un color de fondo, un color de borde y una opacidad para 
que las zonas se puedan representar en la parte superior de los mapas o planos de planta 
dinámicamente en función de los metadatos almacenados.
