"use strict";
var common_vendor = require("../../common/vendor.js");
require("../../common/html-parser.js");
var common_util = require("../../common/util.js");
const _sfc_main = {
  data() {
    return {
      tag_list: [],
      is_show: false,
      is_disabled: true,
      baseFormData: {
        title: "",
        description: "",
        pic_time: "",
        tags: []
      },
      title: "",
      banner: {},
      htmlNodes: [],
      media: {},
      media_id: 0,
      backend_url: getApp().globalData.backendUrl,
      backend_url_without_slash: getApp().globalData.backendUrlWithOutSlash,
      refresh_token: "",
      access_token: "",
      is_superuser: false
    };
  },
  onLoad(params) {
    this.media_id = Number(params.media_id);
    try {
      this.access_token = common_vendor.index.getStorageSync("access_token");
      this.refresh_token = common_vendor.index.getStorageSync("refresh_token");
      if (this.refresh_token == "") {
        common_vendor.index.navigateTo({
          url: "../login/login"
        });
      }
    } catch (e) {
      common_vendor.index.navigateTo({
        url: "../login/login"
      });
    }
    var access_detail = common_vendor.o(this.access_token);
    console.log(access_detail);
    this.user_id = access_detail.user_id;
    this.is_superuser = access_detail.is_superuser;
    this.getDetail();
  },
  onShareAppMessage() {
    if (res.from === "button") {
      console.log(res.target);
    }
    return {
      title: this.media.title,
      path: "/pages/detail/detail?media_id" + this.media_id,
      content: "\u9C7C\u4E38\u540C\u5B66\u7684\u6210\u957F\u8BB0\u5F55\uFF0C\u4E00\u8D77\u6765\u770B\u770B\u5427"
    };
  },
  methods: {
    modifyTags(e) {
      this.baseFormData.tags = e.trim().split(" ");
    },
    editMedia() {
      this.is_disabled = false;
      this.is_show = true;
    },
    deleteMedia() {
      var that = this;
      common_vendor.index.showModal({
        title: "\u63D0\u793A\uFF01",
        content: "\u786E\u8BA4\u5220\u9664\u561B?",
        success: function(res2) {
          if (res2.confirm) {
            common_util.refreshToken();
            common_vendor.index.request({
              url: that.backend_url + "api/media/" + that.media_id,
              method: "DELETE",
              header: {
                "Authorization": "Bearer " + that.access_token
              },
              success: (res3) => {
                common_vendor.index.reLaunch({
                  url: "../list/list?media_group_id=" + that.media.group
                });
              },
              fail: () => {
                console.log("fail");
              }
            });
          }
        }
      });
    },
    modifyMediaMeta() {
      common_util.refreshToken();
      common_vendor.index.request({
        url: this.backend_url + "api/media/" + this.media_id + "/",
        header: {
          "Authorization": "Bearer " + this.access_token
        },
        method: "PUT",
        data: this.baseFormData,
        success: (res2) => {
          common_vendor.index.reLaunch({
            url: "../list/list"
          });
        }
      });
    },
    getDetail() {
      common_util.refreshToken();
      var that = this;
      common_vendor.index.request({
        url: this.backend_url + "api/media/" + this.media_id,
        header: {
          "Authorization": "Bearer " + this.access_token
        },
        success: (res2) => {
          if (res2.statusCode == 200) {
            this.media = res2.data;
            this.media.upload_local_file_path = that.backend_url + "upload/" + res2.data.upload_local_file_path;
            this.baseFormData.title = this.media.title;
            this.baseFormData.description = this.media.description;
            this.baseFormData.pic_time = this.media.pic_time;
            this.baseFormData.tags = this.media.tags;
            this.tag_list = String(this.media.tags).replaceAll(",", " ");
          }
        },
        fail: () => {
          console.log("fail");
        }
      });
    }
  }
};
if (!Array) {
  const _easycom_u_lazy_load2 = common_vendor.resolveComponent("u-lazy-load");
  const _easycom_uni_col2 = common_vendor.resolveComponent("uni-col");
  const _easycom_uni_easyinput2 = common_vendor.resolveComponent("uni-easyinput");
  const _easycom_uni_forms_item2 = common_vendor.resolveComponent("uni-forms-item");
  const _easycom_u_tag2 = common_vendor.resolveComponent("u-tag");
  const _easycom_uni_datetime_picker2 = common_vendor.resolveComponent("uni-datetime-picker");
  const _easycom_uni_forms2 = common_vendor.resolveComponent("uni-forms");
  const _easycom_uni_row2 = common_vendor.resolveComponent("uni-row");
  const _easycom_u_gap2 = common_vendor.resolveComponent("u-gap");
  const _easycom_u_line2 = common_vendor.resolveComponent("u-line");
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  (_easycom_u_lazy_load2 + _easycom_uni_col2 + _easycom_uni_easyinput2 + _easycom_uni_forms_item2 + _easycom_u_tag2 + _easycom_uni_datetime_picker2 + _easycom_uni_forms2 + _easycom_uni_row2 + _easycom_u_gap2 + _easycom_u_line2 + _easycom_uni_icons2)();
}
const _easycom_u_lazy_load = () => "../../uni_modules/vk-uview-ui/components/u-lazy-load/u-lazy-load.js";
const _easycom_uni_col = () => "../../uni_modules/uni-row/components/uni-col/uni-col.js";
const _easycom_uni_easyinput = () => "../../uni_modules/uni-easyinput/components/uni-easyinput/uni-easyinput.js";
const _easycom_uni_forms_item = () => "../../uni_modules/uni-forms/components/uni-forms-item/uni-forms-item.js";
const _easycom_u_tag = () => "../../uni_modules/vk-uview-ui/components/u-tag/u-tag.js";
const _easycom_uni_datetime_picker = () => "../../uni_modules/uni-datetime-picker/components/uni-datetime-picker/uni-datetime-picker.js";
const _easycom_uni_forms = () => "../../uni_modules/uni-forms/components/uni-forms/uni-forms.js";
const _easycom_uni_row = () => "../../uni_modules/uni-row/components/uni-row/uni-row.js";
const _easycom_u_gap = () => "../../uni_modules/vk-uview-ui/components/u-gap/u-gap.js";
const _easycom_u_line = () => "../../uni_modules/vk-uview-ui/components/u-line/u-line.js";
const _easycom_uni_icons = () => "../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
if (!Math) {
  (_easycom_u_lazy_load + _easycom_uni_col + _easycom_uni_easyinput + _easycom_uni_forms_item + _easycom_u_tag + _easycom_uni_datetime_picker + _easycom_uni_forms + _easycom_uni_row + _easycom_u_gap + _easycom_u_line + _easycom_uni_icons)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.p({
      image: $data.media.upload_local_file_path
    }),
    b: common_vendor.t($data.media.title),
    c: common_vendor.p({
      span: 1
    }),
    d: common_vendor.o$1(($event) => $data.baseFormData.title = $event),
    e: common_vendor.p({
      disabled: $data.is_disabled,
      inputBorder: false,
      modelValue: $data.baseFormData.title
    }),
    f: common_vendor.p({
      label: "\u6807\u9898"
    }),
    g: common_vendor.f($data.baseFormData.tags, (tag, i, i0) => {
      return {
        a: i,
        b: "0fa82109-8-" + i0 + ",0fa82109-7",
        c: common_vendor.p({
          text: tag,
          shape: "circle",
          mode: "light"
        })
      };
    }),
    h: $data.is_show,
    i: common_vendor.o$1($options.modifyTags),
    j: common_vendor.o$1(($event) => $data.tag_list = $event),
    k: common_vendor.p({
      disabled: $data.is_disabled,
      modelValue: $data.tag_list
    }),
    l: common_vendor.p({
      label: "\u6807\u7B7E"
    }),
    m: common_vendor.o$1(_ctx.maskClick),
    n: common_vendor.o$1(($event) => $data.baseFormData.pic_time = $event),
    o: common_vendor.p({
      type: "date",
      ["clear-icon"]: false,
      border: false,
      disabled: $data.is_disabled,
      modelValue: $data.baseFormData.pic_time
    }),
    p: common_vendor.p({
      label: "\u62CD\u6444\u65F6\u95F4"
    }),
    q: common_vendor.o$1(($event) => $data.baseFormData.description = $event),
    r: common_vendor.p({
      disabled: $data.is_disabled,
      inputBorder: false,
      modelValue: $data.baseFormData.description
    }),
    s: common_vendor.p({
      label: "\u63CF\u8FF0"
    }),
    t: common_vendor.sr("baseForm", "0fa82109-4,0fa82109-3"),
    v: common_vendor.p({
      ["label-position"]: "top"
    }),
    w: $data.is_show,
    x: common_vendor.o$1((...args) => $options.modifyMediaMeta && $options.modifyMediaMeta(...args)),
    y: common_vendor.p({
      span: 22
    }),
    z: common_vendor.p({
      span: 1
    }),
    A: common_vendor.p({
      height: "500",
      ["bg-color"]: "white"
    }),
    B: common_vendor.p({
      color: "red"
    }),
    C: $data.is_superuser
  }, $data.is_superuser ? {
    D: common_vendor.p({
      type: "pyq",
      color: "white"
    }),
    E: common_vendor.p({
      span: 8
    }),
    F: common_vendor.p({
      type: "settings-filled",
      color: "white"
    }),
    G: common_vendor.o$1((...args) => $options.editMedia && $options.editMedia(...args)),
    H: common_vendor.p({
      span: 8
    }),
    I: common_vendor.p({
      type: "trash-filled",
      color: "white"
    }),
    J: common_vendor.o$1((...args) => $options.deleteMedia && $options.deleteMedia(...args)),
    K: common_vendor.p({
      span: 8
    })
  } : {
    L: common_vendor.p({
      type: "pyq",
      color: "white"
    }),
    M: common_vendor.p({
      span: 24
    })
  });
}
var MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "/Users/xunan/Projects/wxfishball/pages/detail/detail.vue"]]);
_sfc_main.__runtimeHooks = 2;
wx.createPage(MiniProgramPage);
