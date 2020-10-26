//http post
const postJson = (url, params = "") => {
  return sendRequest(url, "post", params);
};

//http get
const getJson = (url, params = "") => {
  return sendRequest(url, "get", params);
};
function sendRequest(url, type, params = "") {
  return new Promise((resolve, reject) => {
    let xhr = new XMLHttpRequest();
    //使用变量赋值new个XHR请求
    if (type == "post") {
      params = JSON.stringify(params);
    }
    xhr.open(type, "http://localhost:9010" + url, true);
    xhr.onreadystatechange = function () {
      if (xhr.readyState == 4) {
        if (xhr.status == 200) {
          resolve(JSON.parse(xhr.responseText));
        } else {
          reject(JSON.parse(xhr.responseText));
        }
      }
    };
    xhr.setRequestHeader("Content-type", "Application/JSON; charset=utf-8");
    xhr.send(params);
  });
}
export default {
  fetchAllUser() {
    return getJson(`/api/all/user`);
  },
  fetchUser(id) {
    return postJson(`/api/user`, { id: id });
  },
  login(params) {
    return postJson(`/api/login`, params);
  },
  register(params) {
    return postJson(`/api/register`, params);
  },
  addFriend(params) {
    return postJson(`/api/friend/apply`, params);
  },
  fetchAudit(params) {
    return postJson(`/api/sys/audit`, params);
  },
  setAudit(params) {
    return postJson(`/api/friend/approve`, params);
  },
  fetchMsgs(params) {
    return postJson(`/api/history/msg`, params);
  },
  createGroup(params) {
    return postJson(`/api/group/add`, params);
  },
};
