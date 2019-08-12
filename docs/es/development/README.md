# Guía de Desarrollo de SiteWhere

<Seo/>

Esta guía proporciona información destinada a desarrolladores interesados
en la construcción de componentes SiteWhere a partir del código fuente. Proporciona detalles
sobre la descarga del código fuente, la instalación de las herramientas de compilación necesarias,
luego construyendo imágenes de Docker que se pueden usar para implementar una instancia.

## Acceder al código fuente en GitHub

El código fuente de SiteWhere está disponible en [GitHub](https://github.com/)
en la siguiente ubicación:

[SiteWhere Core Repository](https://github.com/sitewhere/sitewhere)

El repositorio incluye el código fuente, así como el seguimiento de problemas y otros
aspectos del ecosistema de desarrollo.

### Estructura de Ramas del repositorio

El código fuente registrado en la rama _master_ siempre es de la
última versión lanzada de SiteWhere. Cada versión está etiquetada y puede ser
accedido descargando un archivo de la
[página de releases](https://github.com/sitewhere/sitewhere/releases) o
clonando el repositorio y accediendo a la rama correspondiente al release.
La rama para la próxima versión de SiteWhere 2.0 está disponible
en la siguiete ubicación:

[SiteWhere Branch 2.1.0](https://github.com/sitewhere/sitewhere/tree/sitewhere-2.1.0)

La nueva funcionalidad siempre se desarrolla en una rama separada y es
finalmente se fusionó con _master_ como parte del ciclo de publicación.

### Obtener el código fuente de GitHub

Para trabajar con el código, deberá clonarse el repositorio desde GitHub a
su máquina local. El siguiente enlace cubre algunas opciones para la instalación de
un cliente de Git para acceder al repositorio:

[Instalar un cliente de Git](https://help.github.com/articles/set-up-git/)

Con un cliente de Git instalado, comience por clonar el repositorio central de SiteWhere.
Si usa el cliente de línea de comando, puede ejecutar los siguientes
comandos para clonar el repositorio y cambiar a la rama actual:

```bash
git clone https://github.com/sitewhere/sitewhere.git
cd sitewhere
git checkout --force sitewhere-2.1.0
```

El resultado de los comandos debería ser similar al siguiente resultado:

<InlineImage src="/images/development/git-command-line-clone.png" caption="Clonar la línea de comando de Git" />

### Construir desde el Código Fuente

SiteWhere incluye scripts de compilación que facilitan la creación de artefactos
implementables desde el código fuente. Antes de construir desde el código fuente, hay un par
de herramientas que deben instalarse.

### Instalar Java 8

Todo el código fuente central está escrito en Java, por lo que se requiere un compilador Java.
Las versiones recientes de SiteWhere usan características de Java 8, por lo que JDK o JRE deben
ser 1.8 o superior.

[Descargar e instalar Java](http://www.oracle.com/technetwork/java/javase/downloads/index.html)

Una vez instalada, la versión se puede verificar como se muestra a continuación:

<InlineImage src="/images/development/java-version-check.png" caption="Comprobación de la versión de Java" />

### Instalar Docker Engine

SiteWhere 2.0 utiliza Docker como modelo de implementación principal, por lo que los artefactos
de implementación del proceso de compilación son imágenes Docker. Para que los scripts de compilación
puedan interactuar con un repositorio local y la API disponibles, es necesario instalar
una copia local de Docker Engine como se explica a continuación:

[Instalar Docker Engine](https://docs.docker.com/engine/installation/)

Verifique que Docker Engine se haya instalado correctamente ejecutando el comando
abajo:

<InlineImage src="/images/development/docker-engine-version.png" caption="Versión del motor Docker" />

Configure Docker Daemon para escuchar en el puerto TCP 2375. Este es el puerto predeterminado de la API,
pero la mayoría de las instalaciones no habilitan el puerto por defecto. Un ejemplo de
actualización necesaria para Ubuntu 16.04 se puede encontrar
[aquí](https://www.ivankrizsan.se/2016/05/18/enabling-docker-remote-api-on-ubuntu-16-04/).

### Ejecutar script de compilación de Gradle

La carpeta raíz del código fuente contiene un script de construcción [Gradle](https://gradle.org/)
(_build.gradle_) que compila el código de Java, lo empaqueta en imágenes Docker y luego empuja
las imágenes a un repositorio de Docker. De forma predeterminada, el script de Gradle intentará
empujar las imágenes al repositorio que se ejecuta en _localhost_. Se puede agrear información
para otro repositorio sobrescribiendo las siguientes líneas del archivo _gradle.properties_
(o _~/.gradle_ en Unix) en su directorio de usuario predeterminado:

```properties
dockerProtocol=tcp
dockerHostname=192.168.171.100
dockerPort=2375
dockerRepository=docker.io
registryUsername=(your docker username)
registryPassword=(your docker password)
registryEmail=(your docker email address)
```

SiteWhere incluye los artefactos de Gradle [Wrapper](https://docs.gradle.org/current/userguide/gradle_wrapper.html),
por lo que no es necesario instalar Gradle de forma independiente. Para construir toda las bibliotecas núcleo,
empaquetar los microservicios en imágenes Docker e introducirlos en su repositorio, ejecute el siguiente comando:

```bash
gradlew clean dockerImage
```

La primera vez que se ejecuta la compilación tomará mucho más tiempo ya que Gradle
debe descargar todas las dependencias y almacenarlas en caché para usarlas posteriormente. Cuando
el script de compilación se completa, ejecute el siguiente comando para ver
lista de imágenes de Docker que ahora deberían incluir imágenes para todos los microservicios de
SiteWhere:

<InlineImage src="/images/development/docker-image-list.png" caption="Lista de imágenes de Docker" />

### Creación de imágenes de depuración

Además de las imágenes standar de microservicio, la construcción de Gradle se puede parametrizar
para generar imágenes de depuración que exponen un puerto para la depuración remota de Java. Para poder
generar imágenes de depuración, ejecute el siguiente comando:

```bash
gradlew clean dockerImage -Pdebug
```

Las imágenes de depuración usan un identificador de versión con el prefijo _debug-_ para evitar confusiones
con las imágenes sin depuración. Tenga en cuenta que hay una receta SiteWhere separada para ejecutar
las imágenes Docker de depuración, ya que el puerto de depuración para cada microservicio debe ser reasignado
a un puerto diferente. El uso de las imágenes de depuración le permite conectarse desde un depurador remoto
(como el de Eclipse) y establecer puntos de interrupción en los microservicios en ejecución.

## Próximos pasos

Ahora que las imágenes de Docker se han generado para los microservicios, siga los pasos en la
guía de implementación para usar las recetas de SiteWhere que ensamblan los microservicios en una instancia en
funcionamiento.
