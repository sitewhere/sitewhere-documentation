# Programación de Dispositivos Androids con el SDK de SiteWhere

<Seo/>

Clone el repositorio de [SiteWhere Android SDK](https://github.com/sitewhere/sitewhere-android-sdk.git)
para desarrollar aplicaciones que se puedan conectar con SiteWhere. Con este SDK podrá registrar los dispositivos
Android, como así también enviar datos de mediciones a SiteWhere y también recibir comandos desde SiteWhere.

## Configuración del desarrollador

- Installe [Java SE SDK 1.8](https://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html).
- Installe [Android Studio](http://developer.android.com/sdk/index.html).
- Descargue Android SDK 19 (Es posible utilizar este SDK con una versión anterior).

## Inicio rápido

Paso 1. Clone este repositorio.

Paso 2. Cree un nuevo proyecto de Android.

Paso 3. Agregue los siguiente a su archivo `settings.gradle`:

```groovy
include ':sitewhere-android-sdk'
project(':sitewhere-android-sdk').projectDir = new File('../sitewhere-android-sdk') // <- ruta a la carpeta 'sitewhere-android-sdk' dentro del repositorio clonado en el Paso 1
```

Paso 4. Seleccione "Open Module Settings" y agregue el modulo "sitewhere-android-sdk" en el tab Dependencias.

## Aplicación de Ejemplo

La [aplicación](https://github.com/sitewhere/sitewhere-android-sdk/tree/master/example) de ejemplo se puede
encontrar en la carpeta `example`. La aplicación demuestra cómo un dispositivo Android puede ser una puerta
de enlace de IoT y/o un dispositivo cliente para SiteWhere. Como puerta de enlace de IoT, puede registrar un
dispositivo Android con SiteWhere y enviar eventos de ubicación y medición. Como cliente de IoT, puede
registrarse para enviar eventos en tiempo real a un dispositivo Android. La configuración de los eventos
que se envían a un dispositivo específico se realiza mediante filtros del lado del servidor y secuencias
de comandos geniales. La aplicación de muestra utiliza la ubicación actual y el acelerómetro del dispositivo.
