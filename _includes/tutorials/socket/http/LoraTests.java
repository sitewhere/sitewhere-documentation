package com.sitewhere.test;

import java.util.ArrayList;
import java.util.List;

import org.junit.Test;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.web.client.RestTemplate;

/**
 * JUnit test cases for sending sample LoRa payloads over a socket connection.
 * 
 * @author Derek
 */
public class LoRaTests {

	/** URL for accessing SiteWhere */
	private static final String URL = "http://localhost:8484/lora";

	/**
	 * Send a LoRa payload to SiteWhere which is listening for a socket connection.
	 */
	@Test
	public void sendLoRaPayload() throws Exception {
		// Use Spring REST client.
		RestTemplate client = new RestTemplate();

		// Set up JSON payload encoding.
		List<HttpMessageConverter<?>> converters = new ArrayList<HttpMessageConverter<?>>();
		converters.add(new MappingJackson2HttpMessageConverter());
		client.setMessageConverters(converters);

		// Create payload to mock OSS.
		LoRaPayload lora = createLoRaPayload();

		HttpHeaders headers = new HttpHeaders();
		HttpEntity<LoRaPayload> entity = new HttpEntity<LoRaPayload>(lora, headers);
		ResponseEntity<Void> response = client.exchange(URL, HttpMethod.POST, entity, Void.class);
		response.getStatusCode();
	}

	/**
	 * Create a sample payload.
	 * 
	 * @return
	 */
	protected LoRaPayload createLoRaPayload() {
		LoRaPayload lora = new LoRaPayload();
		lora.setDeveui("hex");
		lora.setDataFrame("AB==");
		lora.setPort(1);
		lora.setTimestamp("2015-02-11 10:33:00.578");
		lora.setFcnt(138);
		lora.setRssi(-111);
		lora.setSnr(-6);
		lora.setSf_used("8");
		lora.setId(278998);
		lora.setLive(true);
		lora.setDecrypted(false);
		return lora;
	}

	public static class LoRaPayload {

		// DevEUI of source node
		private String deveui;

		// Raw (encrypted) payload in base64 format
		private String dataFrame;

		// MAC port the message was receive on
		private int port;

		// Time of reception in GMT
		private String timestamp;

		// Uplink fcnt (needed for decryption)
		private int fcnt;

		// RSSI from gateway
		private int rssi;

		// SNR from gateway
		private int snr;

		// Used spreading factor
		private String sf_used;

		// Unique identifier (64-bit) of payload.
		private long id;

		// Indicate if the message is live, or
		// resent from the temporary storage
		private boolean live;

		// Set true if the DASS decrypted the payload,
		// false if the message is still encrypted.
		private boolean decrypted;

		public String getDeveui() {
			return deveui;
		}

		public void setDeveui(String deveui) {
			this.deveui = deveui;
		}

		public String getDataFrame() {
			return dataFrame;
		}

		public void setDataFrame(String dataFrame) {
			this.dataFrame = dataFrame;
		}

		public int getPort() {
			return port;
		}

		public void setPort(int port) {
			this.port = port;
		}

		public String getTimestamp() {
			return timestamp;
		}

		public void setTimestamp(String timestamp) {
			this.timestamp = timestamp;
		}

		public int getFcnt() {
			return fcnt;
		}

		public void setFcnt(int fcnt) {
			this.fcnt = fcnt;
		}

		public int getRssi() {
			return rssi;
		}

		public void setRssi(int rssi) {
			this.rssi = rssi;
		}

		public int getSnr() {
			return snr;
		}

		public void setSnr(int snr) {
			this.snr = snr;
		}

		public String getSf_used() {
			return sf_used;
		}

		public void setSf_used(String sf_used) {
			this.sf_used = sf_used;
		}

		public long getId() {
			return id;
		}

		public void setId(long id) {
			this.id = id;
		}

		public boolean isLive() {
			return live;
		}

		public void setLive(boolean live) {
			this.live = live;
		}

		public boolean isDecrypted() {
			return decrypted;
		}

		public void setDecrypted(boolean decrypted) {
			this.decrypted = decrypted;
		}
	}
}