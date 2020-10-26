import Vue from "vue";
import Router from "vue-router";
import store from "../store";
Vue.use(Router);

const router = new Router({
  routes: [
    { path: "/", name: "home", component: require("@/home.vue") },
    {
      path: "/login",
      name: "login",
      component: require("@/components/login.vue"),
    },
    {
      path: "/register",
      name: "register",
      component: require("@/components/register.vue"),
    },
    {
      path: "/sysmsg",
      name: "sysMsg",
      component: require("@/components/sysMsg.vue"),
    },
    {
      path: "/chat",
      name: "chat",
      component: require("@/components/chat.vue"),
    },
    {
      path: "/404",
      component: require("@/components/404.vue"),
    },
  ],
  linkActiveClass: "active",
});
router.beforeEach((to, from, next) => {
  let userid = store.state.userInfo.id;
  let friends = JSON.parse(store.state.userInfo.friends || "[]");
  if (userid) {
    // 已登录
    if (to.path === "/") {
      if (friends.length > 0) {
        next({
          path: "/chat",
          query: {
            id: friends[friends.length - 1],
          },
        });
      } else {
        next({
          path: "/404",
        });
      }
    } else {
      next();
    }
  } else {
    if (to.path === "/login" || to.path === "/register" || to.path === "/") {
      next();
    } else {
      next({
        path: "/",
      });
    }
  }
});
router.push({ path: "/" });
export default router;
