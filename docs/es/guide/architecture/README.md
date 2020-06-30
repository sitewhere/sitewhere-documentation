# Guía de Arquitectura

<Seo/>

Esta guía cubre los conceptos centrales de la arquitectura SiteWhere 2.0 y está 
destinada a proporcionar una comprensión de cómo funciona el sistema en un nivel bajo. 
Si bien el conocimiento de estos conceptos no es necesario para implementar y configurar 
una instancia de SiteWhere, proporciona una base para comprender cómo interactúan varias 
partes del sistema.

Para obtener información sobre la funcionalidad proporcionada por los microservicios 
individuales y cómo configurarlos, consulte las [guías de microservicios](../microservices/).

## Gestión de la configuración

SiteWhere proporciona un subsistema de gestión de configuración externo y altamente disponible 
basado en [Apache Zookeeper](https://zookeeper.apache.org/). Los microservicios no contienen 
ninguna información de configuración persistente localmente, sino que se conectan a Zookeeper 
para su configuración al iniciar y continúan escuchando los cambios en tiempo de ejecución.

Consulte la [guía](./configuration-management.md) de administración de configuración para obtener más información.

::: warning
Esta guía está en construcción. Vuelva a consultar las actualizaciones.
:::
