# SiteWhere Android SDK Programming

Clone the [SiteWhere Android SDK](https://github.com/sitewhere/sitewhere-android-sdk.git) to develop Andriod Application that can connect to
SiteWhere and send/recive data to/from SiteWhere 2.0.



## Developer Setup

* Install [Java SE SDK 1.8](https://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html).
* Install [Android Studio](http://developer.android.com/sdk/index.html).
* Download Android SDK 19 (It is possible to use this SDK with a lower SDK version).

## Quickstart

Step 1. Clone this repository.

Step 2. Create a new Project.

Step 3. Add the following to the settings.gradle file:

```groovy
include ':sitewhere-android-sdk'
project(':sitewhere-android-sdk').projectDir = new File('../sitewhere-android-sdk') // <- points to the 'sitewhere-android-sdk' folder inside local repository cloned in Step 1 
```

Step 4. Select "Open Module Settings" and add module "sitewhere-android-sdk" in the Dependencies tab.

## Sample Application

The sample app can be found in the SiteWhereExample folder.  The app demostrates how an Android device can be an IoT gateway and/or client device for SiteWhere.  As an IoT gateway you can register an Android device with SiteWhere and send location and measurement events.  As an IoT client you can register to have events pushed in real-time to an Android device.  Configuring what events get pushed to a specific device is done using server side filters and groovy scripts.  The sample app uses the device's current location and accelerometer.
