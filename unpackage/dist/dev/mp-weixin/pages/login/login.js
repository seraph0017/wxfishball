"use strict";
var common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      baseFormData: {
        name: "",
        password: ""
      }
    };
  },
  onReady() {
  },
  methods: {
    getUserInfo() {
      common_vendor.index.getUserProfile({
        lang: "zh_CN",
        desc: "\u83B7\u53D6\u7528\u6237\u4FE1\u606F",
        success: (userInfo) => {
          console.log(userInfo, "userInfo");
          common_vendor.index.login({
            provider: "weixin",
            success: (loginInfo) => {
              console.log(loginInfo, "loginInfo");
            }
          });
        },
        fail: (err) => {
          console.log(err, "err");
        }
      });
    },
    submit(loginForm) {
      common_vendor.index.request({
        method: "POST",
        url: getApp().globalData.backendUrl + "api/token/",
        data: {
          username: this.baseFormData.name,
          password: this.baseFormData.password
        },
        success: (res) => {
          var access_token = res.data.access;
          var refresh_token = res.data.refresh;
          console.log(access_token);
          console.log(refresh_token);
          common_vendor.index.setStorage({
            key: "access_token",
            data: access_token
          });
          common_vendor.index.setStorage({
            key: "refresh_token",
            data: refresh_token
          });
          common_vendor.index.navigateTo({
            url: "../list/list"
          });
        }
      });
    }
  }
};
if (!Array) {
  const _easycom_uni_easyinput2 = common_vendor.resolveComponent("uni-easyinput");
  const _easycom_uni_forms_item2 = common_vendor.resolveComponent("uni-forms-item");
  const _easycom_uni_forms2 = common_vendor.resolveComponent("uni-forms");
  const _easycom_uni_section2 = common_vendor.resolveComponent("uni-section");
  (_easycom_uni_easyinput2 + _easycom_uni_forms_item2 + _easycom_uni_forms2 + _easycom_uni_section2)();
}
const _easycom_uni_easyinput = () => "../../uni_modules/uni-easyinput/components/uni-easyinput/uni-easyinput.js";
const _easycom_uni_forms_item = () => "../../uni_modules/uni-forms/components/uni-forms-item/uni-forms-item.js";
const _easycom_uni_forms = () => "../../uni_modules/uni-forms/components/uni-forms/uni-forms.js";
const _easycom_uni_section = () => "../../components/uni-section/uni-section.js";
if (!Math) {
  (_easycom_uni_easyinput + _easycom_uni_forms_item + _easycom_uni_forms + _easycom_uni_section)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.o$1(($event) => $data.baseFormData.name = $event),
    b: common_vendor.p({
      placeholder: "\u8BF7\u8F93\u5165\u59D3\u540D",
      modelValue: $data.baseFormData.name
    }),
    c: common_vendor.p({
      label: "\u59D3\u540D",
      required: true
    }),
    d: common_vendor.o$1(($event) => $data.baseFormData.password = $event),
    e: common_vendor.p({
      type: "password",
      placeholder: "\u8BF7\u8F93\u5165\u5BC6\u7801",
      modelValue: $data.baseFormData.password
    }),
    f: common_vendor.p({
      label: "\u5BC6\u7801",
      required: true
    }),
    g: common_vendor.sr("loginForm", "6d63f606-1,6d63f606-0"),
    h: common_vendor.p({
      modelValue: $data.baseFormData,
      rules: _ctx.rules
    }),
    i: common_vendor.o$1(($event) => $options.submit()),
    j: common_vendor.p({
      title: "\u9C7C\u4E38\u672D\u8BB0",
      type: "line"
    })
  };
}
var MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "/Users/xunan/Projects/wxfishball/pages/login/login.vue"]]);
wx.createPage(MiniProgramPage);
