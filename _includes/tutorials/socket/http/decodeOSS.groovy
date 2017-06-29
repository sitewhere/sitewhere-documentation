import com.fasterxml.jackson.databind.*
import com.sitewhere.rest.model.device.communication.*;
import com.sitewhere.rest.model.device.event.request.*;
import com.sitewhere.spi.device.event.request.*;

// Create String from payload and parse as Jackson JsonNode.
def message = new String(payload);
def mapper = new ObjectMapper()
def json = mapper.readTree(message) 

// Parse Id from JSON.
def jsonId = json.get("id")
if (jsonId == null) {
	throw new RuntimeException("No id value passed.")
}

// Parse RSSI and SNR from JSON.
def jsonRSSI = json.get("rssi")
def jsonSNR = json.get("snr")

// Build a request for adding a new measurements event.
def decoded = new DecodedDeviceRequest<IDeviceMeasurementsCreateRequest>()

// Use 'id' value as device hardware id.
decoded.setHardwareId(jsonId.asText());
  
// Add measurements to event create request if they are present.
def mxs = new DeviceMeasurementsCreateRequest()
if (jsonRSSI != null) {
	logger.info("RSSI: " + jsonRSSI.asInt())
	mxs.addOrReplaceMeasurement("rssi", jsonRSSI.asInt())
}
if (jsonSNR != null) {
	logger.info("SNR: " + jsonSNR.asInt())
	mxs.addOrReplaceMeasurement("snr", jsonSNR.asInt())
}
mxs.setEventDate(new java.util.Date())
decoded.setRequest(mxs)
  
events.add(decoded);
