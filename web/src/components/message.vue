<!-- 消息框 -->
<template>
  <div class="message">
    <header class="header">
      <div class="friendname">{{ getUsername(friendId) }}</div>
    </header>
    <div class="message-wrapper" ref="list">
      <ul v-if="msgLists">
        <li
          v-for="(item, index) in msgLists"
          :key="index"
          :class="{ 'right-item': item.sender !== $store.state.userInfo.id }"
          class="message-item"
        >
          <div class="send-user">
            <div class="inner">{{ getUsername(item.sender) }}</div>
          </div>

          <div class="send-msg">{{ item.message }}</div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import service from "@/utils/service";
export default {
  data() {
    return {
      // friendId: "",
      msgLists: [],
    };
  },

  mounted() {
    //  在页面加载时让信息滚动到最下面
    setTimeout(
      () => (this.$refs.list.scrollTop = this.$refs.list.scrollHeight),
      0
    );
    this.fetchMsgList();
    // this.WS.onmessage = (evt) => {
    //   let data = JSON.parse(evt.data);
    //   if (data.type === "msg") {
    //   }
    // };
  },
  computed: {
    newMsg() {
      return this.$store.state.newMsg;
    },
    friendId() {
      return this.$route.query.id;
    },
  },
  watch: {
    // 发送信息后,让信息滚动到最下面
    msgLists() {
      setTimeout(
        () => (this.$refs.list.scrollTop = this.$refs.list.scrollHeight),
        0
      );
    },
    // 接收到新消息
    newMsg: {
      deep: true,
      handler(val, oldVal) {
        if (val.sender === this.friendId || val.receiver === this.friendId) {
          this.msgLists.push(val);
          this.$store.commit("setNewMsg", {});
        }
      },
    },
    friendId() {
      this.fetchMsgList();
    },
  },
  methods: {
    fetchMsgList() {
      let sendObj = {
        sender: this.$store.state.userInfo.id,
        receiver: this.friendId,
      };
      // 获取历史消息
      service.fetchMsgs(sendObj).then((res) => {
        this.msgLists = res;
      });
    },
  },
};
</script>

<style lang="stylus" scoped>
.message {
  width: 100%;
  height: 450px;

  .header {
    height: 60px;
    padding: 28px 0 0 30px;
    box-sizing: border-box;
    border-bottom: 1px solid #e7e7e7;

    .friendname {
      font-size: 18px;
    }
  }

  .message-item {
    display:flex;
    justify-content:flex-start;
    align-items:center;
    margin-bottom: 10px;
    .send-user {
     font-size: 12px;
    background: linear-gradient(to right, #ad0e8d, #7d00d1);
    width: 40px;
    height: 40px;
    border-radius: 100%;
    color: #fff;
    display:flex;
    justify-content:center;
    align-items:center;

    .inner {
      width: 24px;
    height: 24px;
    line-height: 24px;
 white-space: nowrap;
    overflow: hidden;
    text-overflow: clip;
    }

    }
    .send-msg {
    font-size: 12px;
    background-color: #409eff;
    padding: 10px 10px;
    border-radius: 10px;
    color: #fff;
    display: inline-block;
    margin-left:10px;
    }

  }

  .right-item {
   justify-content:flex-end;
   .send-user {
     background: linear-gradient(to right, #064543, #097355);
   }
   .send-msg {
     order:-1;
     margin-right:10px;
     margin-left:0px;
   }
  }

  .message-wrapper {
    min-height: 390px;
    max-height: 390px;
    padding: 10px 15px;
    box-sizing: border-box;
    overflow-y: auto;
    overflow-x:hidden;
    border-bottom: 1px solid #e7e7e7;

    .message {
      margin-bottom: 15px;
    }

    .time {
      width: 100%;
      font-size: 12px;
      margin: 7px auto;
      text-align: center;

      span {
        display: inline-block;
        padding: 4px 6px;
        color: #fff;
        border-radius: 3px;
        background-color: #dcdcdc;
      }
    }

    .main {
      .avatar {
        float: left;
        margin-left: 15px;
        border-radius: 3px;
      }

      .content {
        display: inline-block;
        margin-left: 10px;
        position: relative;
        padding: 6px 10px;
        max-width: 330px;
        min-height: 36px;
        line-height: 24px;
        box-sizing: border-box;
        font-size: 14px;
        text-align: left;
        word-break: break-all;
        background-color: #fafafa;
        border-radius: 4px;

        &:before {
          content: ' ';
          position: absolute;
          top: 12px;
          right: 100%;
          border: 6px solid transparent;
          border-right-color: #fafafa;
        }
      }
    }

    .self {
      text-align: right;

      .avatar {
        float: right;
        margin: 0 15px;
      }

      .content {
        background-color: #b2e281;

        &:before {
          right: -12px;
          vertical-align: middle;
          border-right-color: transparent;
          border-left-color: #b2e281;
        }
      }
    }
  }
}
</style>
