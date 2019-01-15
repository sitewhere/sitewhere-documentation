<template>
  <div style="margin-top: 50px;" class="shadow" :id="uid"/>
</template>

<script>
let process = require("process");
let SVG;
if (process.browser) {
  SVG = require("svg.js");
}

const boxWidth = 120,
  boxHeight = 65;

const globalLeft = 20,
  globalTop = 50;

const multiLeft = 200,
  multiTop = 50;

const horzPad = 20;
const vertPad = 15;
const labelPad = 10;

const col1 = globalLeft + horzPad;
const col2 = multiLeft + horzPad;
const col3 = multiLeft + boxWidth * 1 + horzPad * 2;
const col4 = multiLeft + boxWidth * 2 + horzPad * 3;
const col5 = multiLeft + boxWidth * 3 + horzPad * 4;

const row1 = globalTop + vertPad,
  row2 = globalTop + boxHeight * 1 + vertPad * 2,
  row3 = globalTop + boxHeight * 2 + vertPad * 3,
  row4 = globalTop + boxHeight * 3 + vertPad * 4;

const global = { border: "#203864", background: "#dae3f3", text: "#262626" };
const multitenant = {
  border: "#548235",
  background: "#2f5597",
  text: "#ffffff"
};

const boxFont = { family: "Roboto", size: 14, "font-weight": "bold" };

const microservices = [
  {
    name: "Instance Management",
    x: col1,
    y: row1,
    type: global,
    link: "../guide/microservices/instance-management.html"
  },
  {
    name: "Tenant Management",
    x: col1,
    y: row2,
    type: global,
    link: "../guide/microservices/tenant-management.html"
  },
  {
    name: "User Management",
    x: col1,
    y: row3,
    type: global,
    link: "../guide/microservices/user-management.html"
  },
  {
    name: "Web/REST",
    x: col1,
    y: row4,
    type: global,
    link: "../guide/microservices/web-rest.html"
  },
  {
    name: "Device Management",
    x: col2,
    y: row1,
    type: multitenant,
    link: "../guide/microservices/device-management.html"
  },
  {
    name: "Event Management",
    x: col2,
    y: row2,
    type: multitenant,
    link: "../guide/microservices/event-management.html"
  },
  {
    name: "Asset Management",
    x: col2,
    y: row3,
    type: multitenant,
    link: "../guide/microservices/asset-management.html"
  },
  {
    name: "Schedule Management",
    x: col2,
    y: row4,
    type: multitenant,
    link: "../guide/microservices/schedule-management.html"
  },
  {
    name: "Batch Operations",
    x: col3,
    y: row1,
    type: multitenant,
    link: "../guide/microservices/batch-operations.html"
  },
  {
    name: "Command Delivery",
    x: col3,
    y: row2,
    type: multitenant,
    link: "../guide/microservices/command-delivery.html"
  },
  {
    name: "Device Registration",
    x: col3,
    y: row3,
    type: multitenant,
    link: "../guide/microservices/device-registration.html"
  },
  {
    name: "Device State",
    x: col3,
    y: row4,
    type: multitenant,
    link: "../guide/microservices/device-state.html"
  },
  {
    name: "Event Search",
    x: col4,
    y: row1,
    type: multitenant,
    link: "../guide/microservices/event-search.html"
  },
  {
    name: "Event Sources",
    x: col4,
    y: row2,
    type: multitenant,
    link: "../guide/microservices/event-sources.html"
  },
  {
    name: "Inbound Processing",
    x: col4,
    y: row3,
    type: multitenant,
    link: "../guide/microservices/inbound-processing.html"
  },
  {
    name: "Label Generation",
    x: col4,
    y: row4,
    type: multitenant,
    link: "../guide/microservices/label-generation.html"
  },
  {
    name: "Outbound Connectors",
    x: col5,
    y: row1,
    type: multitenant,
    link: "../guide/microservices/outbound-connectors.html"
  },
  {
    name: "Rule Processing",
    x: col5,
    y: row2,
    type: multitenant,
    link: "../guide/microservices/rule-processing.html"
  },
  {
    name: "Streaming Media",
    x: col5,
    y: row3,
    type: multitenant,
    link: "../guide/microservices/streaming-media.html"
  }
];

export default {
  props: {
    uid: {
      type: String,
      required: true
    },
    base: {
      type: String,
      required: true
    }
  },

  mounted: function() {
    var svg = SVG(this.uid)
      .size("100%", "100%")
      .viewbox(0, 0, 800, 400);
    this.drawGlobal(svg);
    this.addMicroservices(svg);
  },

  methods: {
    // Draw global elements.
    drawGlobal: function(svg) {
      svg
        .rect(800, 400)
        .move(0, 0)
        .fill(svg.image("../images/facets.jpg", 800, 485).opacity(0.9));
      svg
        .rect(boxWidth + 2 * horzPad, 4 * boxHeight + 5 * vertPad + labelPad)
        .move(globalLeft, globalTop - labelPad)
        .fill("#ddd")
        .attr({ stroke: "#ccc" })
        .opacity(0.6);
      svg
        .text("Global Microservices")
        .fill("#999")
        .font({ family: "Roboto", size: 10, "font-weight": "bold" })
        .move(globalLeft + 28, globalTop - 5);
      svg
        .rect(
          boxWidth * 4 + 5 * horzPad,
          4 * boxHeight + 5 * vertPad + labelPad
        )
        .move(multiLeft, multiTop - labelPad)
        .fill("#ddd")
        .attr({ stroke: "#ccc" })
        .opacity(0.6);
      svg
        .text("Multitenant Microservices")
        .fill("#999")
        .font({ family: "Roboto", size: 10, "font-weight": "bold" })
        .move(multiLeft + 18, multiTop - 5);
      svg
        .text("SiteWhere 2.0 Microservices")
        .font({ family: "Roboto", size: 22, "font-weight": "bold" })
        .move(280);
      svg
        .text("(Mouse Over Diagram to Interact)")
        .fill("#999")
        .font({ family: "Roboto", size: 10, "font-weight": "bold" })
        .move(340, 388);
    },
    // Add microservice elements.
    addMicroservices: function(svg) {
      microservices.forEach(microservice => {
        this.addMicroservice(svg, microservice);
      });
    },
    addMicroservice: function(svg, meta) {
      let group = svg
        .group()
        .move(meta.x, meta.y)
        .on("mouseenter", function() {
          this.animate(100).scale(1.05, 1.05);
        })
        .on("mouseleave", function() {
          this.animate(50).scale(1, 1);
        });
      let box = svg
        .rect(boxWidth, boxHeight)
        .attr({ cursor: "pointer" })
        .attr({
          fill: meta.type.background,
          stroke: meta.type.border,
          "stroke-width": 5
        })
        .click(function() {
          console.log(location);
          location.href = meta.link;
        });
      group.add(box);
      this.createBoxText(svg, group, meta);
    },
    // Create text .
    createBoxText: function(svg, group, meta) {
      let words = meta.name.split(" ");
      if (words.length === 1) {
        group.add(
          svg
            .text(words[0])
            .font(boxFont)
            .attr({ fill: meta.type.text })
            .attr({ "text-anchor": "middle", "pointer-events": "none" })
            .move(boxWidth / 2, boxHeight / 2 - 10)
        );
      } else if (words.length === 2) {
        group.add(
          svg
            .text(words[0])
            .font(boxFont)
            .attr({ fill: meta.type.text })
            .attr({ "text-anchor": "middle", "pointer-events": "none" })
            .move(boxWidth / 2, boxHeight / 2 - 17)
        );
        group.add(
          svg
            .text(words[1])
            .font(boxFont)
            .attr({ fill: meta.type.text })
            .attr({ "text-anchor": "middle", "pointer-events": "none" })
            .move(boxWidth / 2, boxHeight / 2 - 2)
        );
      }
    }
  }
};
</script>

<style scoped>
.shadow {
  -webkit-box-shadow: 0px 5px 15px 0px rgba(0, 0, 0, 0.32);
  -moz-box-shadow: 0px 5px 15px 0px rgba(0, 0, 0, 0.32);
  box-shadow: 0px 5px 15px 0px rgba(0, 0, 0, 0.32);
}
</style>
