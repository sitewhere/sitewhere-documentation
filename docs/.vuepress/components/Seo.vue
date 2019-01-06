<template>
  <span/>
</template>

<script>
export default {
  created() {
    if (typeof this.$ssrContext !== "undefined") {
      this.$ssrContext.userHeadTags += `\n    <link rel='canonical' href='https://sitewhere.io${
        this.$site.base
      }${this.$page.path.substring(1)}'>`;
    }
  }
};
</script>