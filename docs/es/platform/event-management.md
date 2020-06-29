# Event Management Model

<Seo/>

The event management model is used to capture temporal events related to
devices. This includes telemetry data and device state changes as well as
audit data such as command invocations and responses. Device events are
stored as time-series data and are generally persisted separately from
device management data due to their temporal nature and large scale
relative to the "master" data.

All device events share common fields such as the date the event
occurred, the date the event was received, the id of the device,
the current device assignment and various associations which
may be used to filter/aggregate event data. In addition, each device
event subtype contains extra data specific to its function.

## Measurement Events

Measurement events contain a measurement name and a measurement value and
are used to capture telemetry data from devices. Examples include:

- Fuel readings from heavy equipment on a contruction site
- Heart rate for a heart monitor in a healthcare facility
- Speed recorded for a vehicle in a fleet-tracking application

## Location Events

Location events track location (latitude/longitude/elevation) for a device
at a specific point in time. Location events may be used in conjunction
with areas and zones to perform logic in response to a device entering/exiting
established boundaries.

## Alert Events

Alert events indicate that an exceptional condition has occurred. An alert
includes an alert type, message, alert level, and other information that
provides context as to the condition that occurred. Alerts may be used to
trigger other system actions based on business logic added to the event
processing pipeline.

## Command Invocation Events

Each time a command is invoked via the SiteWhere APIs, a command invocation
event is recorded. The event processing pipeline passes the event into the
command delivery microservice, which handles packaging the command in the
correct format and delivering the command to the target device. Command
invocation events also provide an audit trail of commands issued along with
how they were invoked and who invoked them.

## Command Response Events

When commands are sent to devices, there are cases where the device
sends data in response to the command. In cases where an originating
event id is sent along with other event data, the event is recorded
as a command response so the response may be correlated back to the
event that originated it. This allows for tracking whether commands
have been received in cases where an acknowledgement is required.

## State Change Events

State change events are used to convey changes to internal device state
as well as other system-level state changes such as presence detection
updates. Devices may send state change events for cases such as going
into sleep mode or detection of a low battery state.
