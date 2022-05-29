"use strict";
var common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {};
  },
  methods: {
    TakePhoto() {
      var camera = common_vendor.index.createCameraContext();
      camera.takePhoto({
        quality: "high",
        success: (e) => {
          console.log("\u62CD\u7167\u6210\u529F");
        },
        fail: (e) => {
          console.log(e);
        },
        complete(e) {
          console.log("\u7ED3\u675F");
        }
      });
    }
  }
};
if (!Array) {
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  _easycom_uni_icons2();
}
const _easycom_uni_icons = () => "../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
if (!Math) {
  _easycom_uni_icons();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.o$1($options.TakePhoto),
    b: common_vendor.p({
      type: "camera-filled",
      size: "100"
    })
  };
}
var MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "/Users/xunan/Projects/wxfishball/pages/photo/photo.vue"]]);
wx.createPage(MiniProgramPage);
