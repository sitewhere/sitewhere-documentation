# Configuración Global

Esta guía cubre la administración de características globales asociadas con una instancia 
de SiteWhere.

Después de iniciar sesión correctamente, se muestra la página de administración del sistema. 
Esta página admite la configuración a nivel de instancia, como agregar usuarios de instancia, 
agregar / configurar inquilinos y configurar microservicios globales.

<InlineImage src="/images/guide/administration/system-administration.png" caption="System Administration"/>

## Gestión de Inquilinos

SiteWhere es un sistema multi-inquilino, lo que significa que múltiples aplicaciones aisladas pueden usar la misma 
instancia de SiteWhere simultáneamente. A diferencia de muchas otras plataformas donde varios inquilinos 
comparten la misma base de datos, los inquilinos de SiteWhere están completamente separados unos de otros, 
tanto en la persistencia de sus datos como en la canalización de procesamiento subyacente. Los Inquilinos en SiteWhere:

- Usan bases de datos separadas y puede usar una infraestructura de base de datos diferente por cada inquilino.
- Utilizan colas de procesamiento de Kafka separadas para que la información en camino no se mezcle.
- Utilizan _tenant engines_ independientes que se configuran de forma independiente y pueden iniciarse / detenerse 
sin afectar a otros inquilinos

Se puede acceder a las funciones de administración de inquilinos haciendo clic en **:fa-layer-group: Manage Tenants**
en la barra de herramientas de la configuración global..

### Agregar un nuevo inquilino

Se pueden agregar nuevos inquilinos haciendo clic en el símbolo **:fa-plus:** en la esquina superior derecha de
la pantalla de la lista de inquilinos

::: warning
Esta guía está en construcción. Vuelva a consultar por actualizaciones.
:::
