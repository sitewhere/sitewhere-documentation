<template>
  <a class="inline-image" :href="$withBase(src)">
    <img :src="$withBase(src)" alt="" :title="caption" />
  </a>
</template>

<script>
const options = {
  nav: true,
  widthRatio: 0.9,
  showCounter: false
};

export default {
  props: {
    src: {
      type: String,
      required: true
    },
    caption: {
      type: String,
      required: true
    }
  },
  mounted() {
    try {
      window.$ = window.jQuery = require("jquery");
      var simplelightbox = require("simplelightbox");
      var gal = $(this.$el).simpleLightbox(options);
    } catch (e) {}
  }
};
</script>

<style>
.inline-image img {
  width: 100%;
  height: auto;
  -webkit-box-shadow: 0px 5px 15px 0px rgba(0, 0, 0, 0.32);
  -moz-box-shadow: 0px 5px 15px 0px rgba(0, 0, 0, 0.32);
  box-shadow: 0px 5px 15px 0px rgba(0, 0, 0, 0.32);
  -webkit-transition: -webkit-transform 0.15s ease;
  -moz-transition: -moz-transform 0.15s ease;
  -o-transition: -o-transform 0.15s ease;
  -ms-transition: -ms-transform 0.15s ease;
  transition: transform 0.15s ease;
  position: relative;
}

@import "~simplelightbox/dist/simplelightbox.css";

.sl-overlay {
  opacity: 0.9;
  background: #fff;
}
.sl-image {
  -webkit-box-shadow: 0px 5px 65px -6px rgba(0, 0, 0, 0.4);
  -moz-box-shadow: 0px 5px 65px -6px rgba(0, 0, 0, 0.4);
  box-shadow: 0px 5px 65px -6px rgba(0, 0, 0, 0.4);
}
</style>