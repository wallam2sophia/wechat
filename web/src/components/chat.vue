<template>
  <div class="content">
    <div class="chatbox">
      <message></message>
      <v-text></v-text>
    </div>
  </div>
</template>

<script>
import message from "./message";
import vText from "./text";
export default {
  components: {
    message,
    vText,
  },
};
</script>

<style lang="stylus" scoped>
.content {
  display: flex;

  // width: 800px
  .msglist {
    width: 250px;
    background: rgb(230, 230, 230);
  }

  .chatbox {
    flex: 1;
  }
}
</style>
