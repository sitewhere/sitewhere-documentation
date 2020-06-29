# Modelo de Gestión de Activos

<Seo/>

Los dispositivos a menudo se implementan en asociación con activos del mundo 
real que derivan algún servicio del dispositivo. Los casos de uso incluyen:

- un dispositivo de rastreo asociado con un automóvil en la vertical de rastreo de flota
- una insignia asociada con una persona en la vertical de seguridad
- un monitor cardíaco asociado con una cama en un vertical sanitario

SiteWhere proporciona un modelo de gestión de activos para almacenar activos 
que pueden estar asociados con dispositivos del sistema. Se pueden proporcionar 
sistemas de gestión de activos externos basados ​​en el mismo conjunto de API en los 
casos en que los activos deban gestionarse externamente.

## Asociaciones de Activos

El concepto de un activo se utiliza para asociar un dispositivo con una entidad del 
mundo real, como una persona u objeto físico.
Dado que la información de los activos se pasa a los eventos generados por un dispositivo, 
es posible consultar eventos basados en los activos a los que están vinculados.
Esta información puede ser utilizada por servicios externos como los algoritmos de 
aprendizaje automático para inferir el comportamiento específico de los activos a lo 
largo del tiempo.

### Tipos de Activos

Los tipos de activos representan una clase de activos que pueden usarse en el sistema.
Generalmente corresponden a entradas en un catálogo de productos y se identificarían 
con una SKU en lugar de un número de serie.
Los tipos de activos capturan metadatos comunes para activos como peso, dimensiones 
u otras facetas que se aplican a todos los activos del tipo.

### Activos

Los activos son instancias de tipos de activos y generalmente corresponden a entidades 
del mundo real que pueden tener un número de serie único.
Los activos pueden estar asociados con uno o más dispositivos en función de las 
asignaciones de dispositivos y estas asignaciones pueden cambiar con el tiempo.
El historial de asignación de dispositivos refleja la lista de activos asociados a lo 
largo del tiempo.
Por ejemplo, una insignia de seguridad temporal que está asociada con activos personales 
tendrá un historial de cada persona a la que se le asignó la insignia. Todos los eventos 
para la insignia también estarían vinculados a las tareas y podrían filtrarse según la 
persona a la que se le asignó la insignia.
