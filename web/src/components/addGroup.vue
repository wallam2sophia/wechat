<template>
  <div class="add-group">
    <el-input
      v-model="value"
      size="small"
      class="add-input"
      @keyup.enter.native="addFriend"
    ></el-input>
    <div>
      <ul>
        <li v-for="item in friendOptions" :key="item.id">
          <span class="user-name">{{ item.username }}</span>
          <el-checkbox v-model="item.checked"></el-checkbox>
        </li>
      </ul>
      <div class="group-btns">
        <div @click="onSubmit" class="middle-btn main-color">保存</div>
        <div @click="onCancel" class="middle-btn minor-color">取消</div>
      </div>
    </div>
  </div>
</template>

<script>
import service from "@/utils/service";
export default {
  data() {
    return {
      value: "",
    };
  },
  computed: {
    friendOptions() {
      let list = this.$store.state.userInfo.friends;
      return list.map((item) => {
        return {
          id: item,
          username: this.getUsername(item),
          checked: false,
        };
      });
    },
  },
  methods: {
    addFriend() {
      for (let item of this.friendOptions) {
        if (item.username === this.value) {
          item.checked = true;
          break;
        }
      }
      this.$message({
        type: "error",
        message: "没有该朋友",
      });
    },
    onSubmit() {
      let groupIds = this.friendOptions
        .filter((item) => item.checked)
        .map((item) => item.id);
      let sendObj = {
        name: `群聊(${groupIds.length})`,
        members: groupIds,
      };
      service.createGroup(sendObj).then((res) => {
        console.log(res);
      });
    },
    onCancel() {
      this.$emit("close");
    },
  },
};
</script>

<style></style>
