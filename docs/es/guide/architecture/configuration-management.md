# Gestión de la configuración

<Seo/>

La arquitectura SiteWhere 2.0 proporciona un subsistema de administración de configuración externo y altamente 
disponible basado en [Apache Zookeeper](https://zookeeper.apache.org/). En lugar de almacenar información de 
configuración localmente, los microservicios de SiteWhere se conectan a Zookeeper y consultan la configuración 
que les corresponde.

## Infraestructura de Zookeeper 

El [Helm chart](https://github.com/sitewhere/sitewhere-k8s/tree/sitewhere-k8s-0.2.0/charts) de SiteWhere
incluye un [template](https://github.com/sitewhere/sitewhere-k8s/blob/sitewhere-2.0.1/charts/sitewhere/templates/Zookeeper.yaml)
que se usa para configurar los componentes de Zookeeper en los que se basa el sistema. Como parte de la lista 
de servicios de infraestructura centrales requeridos por SiteWhere, los pods de Zookeeper deben haberse 
implementado con éxito antes de que se pueda iniciar cualquier microservicio de SiteWhere.
