"use strict";
var common_vendor = require("./vendor.js");
function refreshToken() {
  common_vendor.index.request({
    method: "POST",
    url: getApp().globalData.backendUrl + "api/token/refresh/",
    data: { refresh: common_vendor.index.getStorageSync("refresh_token") },
    success: (res) => {
      if (res.data.access) {
        common_vendor.index.setStorageSync("access_token", res.data.access);
      } else {
        common_vendor.index.navigateTo({ url: "../login/login" });
      }
    }
  });
}
function getFileName(path) {
  var pos1 = path.lastIndexOf("/");
  var pos2 = path.lastIndexOf("\\");
  var pos = Math.max(pos1, pos2);
  if (pos < 0)
    return path;
  else
    return path.substring(pos + 1);
}
exports.getFileName = getFileName;
exports.refreshToken = refreshToken;
