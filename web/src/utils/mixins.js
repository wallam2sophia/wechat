export default {
  data() {
    return {
      WSURL: "ws://localhost:9011",
    };
  },
  computed: {
    WS() {
      return this.$store.state.WS;
    },
    userInfo() {
      return this.$store.state.userInfo;
    },
  },
  methods: {
    getUsername(id) {
      let allUsers = this.$store.state.allUsers;
      return allUsers.filter((item) => item.id === id).length > 0
        ? allUsers.filter((item) => item.id === id)[0].username
        : "";
    },
  },
};
