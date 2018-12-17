# Plataforma SiteWhere

SiteWhere es una plataforma código abierto para crear  tanto la infraestructura
como las aplicaciones que conforman el Internet de las cosas. Cubre muchos de los
casos de uso requeridos para administrar grandes implementaciones de IoT y está 
construido con un enfoque de marco que facilita la adición de nuevos conceptos
fácilmente. La plataforma ha sido diseñada para un procesamiento confiable, de alto
rendimiento, de baja latencia y de escalabilidad dinámica.

::: tip
SiteWhere 2.0 es un rediseño completo de la arquitectura de SiteWhere 1.x. La plataforma introduce una arquitectura modernizada basada en microservicios que desacopla el enfoque monolítico anterior en áreas funcionales limpiamente separadas. SiteWhere 2.0 es compatible con la mayoría de los conceptos de modelo de datos y las API de la plataforma 1.x, pero lo hace de una manera modular que abarca flujos de trabajo de desarrollo e implementación modernos.
:::

## Enfoque Arquitectónico

SiteWhere separa los muchos aspectos del procesamiento de IoT en microservicios,
cada uno especializado en una tarea específica. Estos incluyen funcionalidades como la
ingesta de eventos, la persistencia de eventos de big data, la administración del estado
del dispositivo, la entrega de comandos a gran escala, la integración de datos del dispositivo
con sistemas externos y mucho más. Cada microservicio es una aplicación
[Spring Boot](https://spring.io/projects/spring-boot) envuelta como un contenedor
[Docker](https://www.docker.com/). Los microservicios se ensamblan a sí mismos en una
instancia de SiteWhere que se organiza como un sistema distribuido de alta disponibilidad.
Además, muchos de los microservicios se organizan en una tubería de procesamiento respaldada
por [Apache Kafka](https://kafka.apache.org/) para un procesamiento de flujo de alto
rendimiento y resistente. Se puede encontrar más información sobre la arquitectura de
microservicio SiteWhere 2.0 [aquí](./microservice-overview.md).

## Metodología de Despliegue

Los microservicios de SiteWhere se implementan y organizan utilizando [Kubernetes](https://kubernetes.io/)
como plataforma de infraestructura. Esto permite la implementación en casi cualquier servicio en la nube
(por ejemplo, [Microsoft Azure](https://azure.microsoft.com/en-us/services/kubernetes-service/),
[AWS](https://aws.amazon.com/eks/), [Google Cloud](https://cloud.google.com/kubernetes-engine/),
[OpenShift](https://www.openshift.com/), así como la capacidad de implementación on-prem.
SiteWhere proporciona gráficos [Helm](https://helm.sh/) que ocultan las complejidades de la configuración
del sistema, lo que permite que una instancia se reinicie con un solo comando. Para obtener más
información sobre la implementación de una instancia de SiteWhere, consulte la [guía de implementación](../deploy/).

## Aplicación de Administración

SiteWhere proporciona una aplicación administrativa basada en [Electron](https://electronjs.org/),
que permite que las instancias de SiteWhere se administren fácilmente desde la comodidad de una aplicación
de escritorio. Utilice uno de los [charts](https://github.com/sitewhere/sitewhere-k8s/tree/master/charts)
Helm disponibles  para iniciar una instancia de SiteWhere en Kubernetes, luego apunte la aplicación
administrativa a la instancia para administrarla. La nueva aplicación administrativa es compatible
con todas las nuevas características de SiteWhere 2.0 y ofrece actualizaciones automatizadas para
agilizar el proceso de desarrollo.

<InlineImage src="/images/platform/login.png" caption="Admnistrative Interface"/>
