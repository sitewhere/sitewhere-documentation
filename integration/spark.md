---
title: Apache Spark
layout: default
sidebar: sidebar.html
prevLink: integration/openhab.html
prevTitle: OpenHAB
nextLink: integration.html
nextTitle: Integration
---

# {{page.title}}
[Apache Spark Streaming](http://spark.apache.org/streaming/) is an extension of the open 
source [Apache Spark](http://spark.apache.org/) platform that makes it easy to build scalable fault-tolerant 
streaming applications. SiteWhere support includes a custom receiver that streams events 
from a SiteWhere instance via Hazelcast. The event stream can then be manipulated via the standard
Spark Streaming APIs and used as the input for [machine learning](http://spark.apache.org/mllib/) 
and [graph processing](http://spark.apache.org/graphx/) modules available in Spark.

## Create a Spark Project
In order to deploy code to be executed on Spark via **spark-submit**, an [Uber JAR](https://maven.apache.org/plugins/maven-shade-plugin/index.html) must be 
created containing the dependencies needed for it to run. The **pom.xml** used by Maven
to build the project should include dependencies on the SiteWhere Spark module and
the Apache Spark libraries:

{% highlight xml %}
<dependencies>
	<dependency>
		<groupId>com.sitewhere</groupId>
		<artifactId>sitewhere-spark</artifactId>
		<version>${sitewhere.version}</version>
		<scope>compile</scope>
	</dependency>
	<dependency>
		<groupId>org.apache.spark</groupId>
		<artifactId>spark-streaming_2.10</artifactId>
		<version>1.5.2</version>
		<scope>provided</scope>
	</dependency>
</dependencies>
{% endhighlight %}

**Note that the Spark libraries are marked as *provided* since the Spark engine will make them available.**

To create the Uber JAR, an extra plugin needs to be added to the Maven build as shown below:

{% highlight xml %}
<plugin>
	<groupId>org.apache.maven.plugins</groupId>
	<artifactId>maven-shade-plugin</artifactId>
	<version>2.4.2</version>
	<configuration>
		<artifactSet>
			<excludes>
				<exclude>log4j:log4j</exclude>
				<exclude>javax.mail:mail</exclude>
				<exclude>javax.activation:activation</exclude>
			</excludes>
		</artifactSet>
	</configuration>
	<executions>
		<execution>
			<phase>package</phase>
			<goals>
				<goal>shade</goal>
			</goals>
		</execution>
	</executions>
</plugin>
{% endhighlight %}

The *excludes* block prevents unneeded libraries from being included in the JAR.

## Add Stream Processing Logic
A Java class with a **main** method should be created to supply the logic that will be
executed in Spark. The line needed to stream SiteWhere events into Spark is given below: 

{% highlight java %}
JavaReceiverInputDStream<IDeviceEvent> sitewhere =
	context.receiverStream(new SiteWhereReceiver(hzAddress, hzUsername, hzPassword, tenantId));
{% endhighlight %}
			
The receiver will connect to SiteWhere via Hazelcast and stream all measurements, locations, and
alerts for use by the other Spark APIs. An example that counts the number of events processed for each
device assignment token is shown below:

{% highlight java %}
SparkConf conf = new SparkConf().setMaster("local[4]").setAppName("SparkSimple");
JavaStreamingContext context = null;
try {
	context = new JavaStreamingContext(conf, Durations.minutes(1));
	JavaReceiverInputDStream<IDeviceEvent> sitewhere =
			context.receiverStream(new SiteWhereReceiver(hazelcast, HAZELCAST_USERNAME,
					HAZELCAST_PASSWORD, TENANT_ID));
	JavaPairDStream<String, Integer> pairs =
			sitewhere.mapToPair(new PairFunction<IDeviceEvent, String, Integer>() {
				@Override
				public Tuple2<String, Integer> call(IDeviceEvent s) {
					return new Tuple2<String, Integer>(s.getDeviceAssignmentToken(), 1);
				}
			});
	JavaPairDStream<String, Integer> assignmentCounts =
			pairs.reduceByKey(new Function2<Integer, Integer, Integer>() {
				@Override
				public Integer call(Integer i1, Integer i2) {
					return i1 + i2;
				}
			});
	assignmentCounts.print();
	context.start();
	context.awaitTermination();
} finally {
	if (context != null) {
		context.close();
	}
}
{% endhighlight %}

Once the logic has been created, run the Maven build by executing:

> mvn clean install

The output will be a JAR containing everything needed for Spark to execute the logic.
		