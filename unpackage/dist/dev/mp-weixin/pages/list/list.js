"use strict";
var common_vendor = require("../../common/vendor.js");
var common_util = require("../../common/util.js");
const _sfc_main = {
  data() {
    return {
      tag_list: [],
      tag_list_selected: [],
      flowList: [],
      is_superuser: false,
      user_id: 0,
      baseFormData: {
        xiangce: 1
      },
      xiangce: [{
        text: "\u9ED8\u8BA4\u76F8\u518C",
        value: 1
      }, {
        text: "\u7CBE\u9009\u76F8\u518C",
        value: 2
      }],
      banner_img_url: getApp().globalData.backendUrl + "static/image/banner.jpg",
      banner_title: "\u9C7C\u4E38\u672D\u8BB0",
      listData: [],
      last_id: "",
      reload: false,
      status: "more",
      adpid: "",
      contentText: {
        contentdown: "\u4E0A\u62C9\u52A0\u8F7D\u66F4\u591A",
        contentrefresh: "\u52A0\u8F7D\u4E2D",
        contentnomore: "\u6CA1\u6709\u66F4\u591A"
      },
      refresh_token: "",
      access_token: "",
      backend_url: getApp().globalData.backendUrl,
      backend_url_without_slash: getApp().globalData.backendUrlWithOutSlash,
      limit: 10,
      offset: 0,
      media_group_id: 1
    };
  },
  onLoad(params) {
    if (params.media_group_id) {
      this.baseFormData.xiangce = Number(params.media_group_id);
    }
    if (params.tags_in) {
      this.tag_list_selected = JSON.parse(params.tags_in);
    }
    if (params.env) {
      console.log(params.env);
    }
    common_vendor.index.authorize({
      scope: "scope.camera",
      success(e) {
        console.log(e);
      }
    });
    var access_detail = common_vendor.o(this.access_token);
    this.user_id = access_detail.user_id;
    this.is_superuser = access_detail.is_superuser;
    this.adpid = this.$adpid;
    this.getList();
    this.getTags();
  },
  onPullDownRefresh() {
    common_util.refreshToken();
    var that = this;
    setTimeout(function(e) {
      that.clear();
      that.reload = true;
      that.offset = 0;
      that.getList();
      that.getTags();
    }, 1e3);
  },
  onReachBottom() {
    var that = this;
    this.status = "more";
    common_util.refreshToken();
    setTimeout(function(e) {
      that.getList();
    }, 1e3);
  },
  onShareAppMessage() {
    if (res.from === "button") {
      console.log(res.target);
    }
    return {
      title: "\u9C7C\u4E38\u672D\u8BB0",
      path: "/pages/list/list",
      content: "\u9C7C\u4E38\u540C\u5B66\u7684\u6210\u957F\u8BB0\u5F55\uFF0C\u4E00\u8D77\u6765\u770B\u770B\u5427"
    };
  },
  methods: {
    toLoginPage: () => {
      common_vendor.index.navigateTo({
        url: "../login/login"
      });
    },
    formatDate: (nowTimer) => {
      let formats = {
        "year": "\u51E0 \u5E74\u524D",
        "month": "\u51E0 \u6708\u524D",
        "day": "\u51E0 \u5929\u524D",
        "hour": "\u51E0 \u5C0F\u65F6\u524D",
        "minute": "\u51E0 \u5206\u949F\u524D",
        "second": "\u51E0 \u79D2\u524D"
      };
      let now = Date.now();
      let seconds = Math.floor((now - parseInt(nowTimer)) / 1e3);
      let minutes = Math.floor(seconds / 60);
      let hours = Math.floor(minutes / 60);
      let days = Math.floor(hours / 24);
      let months = Math.floor(days / 30);
      let years = Math.floor(months / 12);
      let oldType = "";
      let oldValue = 0;
      if (years > 0) {
        oldType = "year";
        oldValue = years;
      } else {
        if (months > 0) {
          oldType = "month";
          oldValue = months;
        } else {
          if (days > 0) {
            oldType = "day";
            oldValue = days;
          } else {
            if (hours > 0) {
              oldType = "hour";
              oldValue = hours;
            } else {
              if (minutes > 0) {
                oldType = "minute";
                oldValue = minutes;
              } else {
                oldType = "second";
                oldValue = seconds === 0 ? seconds = 1 : seconds;
              }
            }
          }
        }
      }
      return formats[oldType].replace("\u51E0", oldValue);
    },
    filter() {
      var media_group_id = this.baseFormData.xiangce;
      var tags = this.tag_list_selected;
      common_vendor.index.reLaunch({
        url: "list?media_group_id=" + media_group_id + "&tags_in=" + JSON.stringify(tags)
      });
    },
    addData() {
      const reverseListData = this.listData.reverse();
      for (let i = reverseListData.length - 1; i >= 0; i--) {
        let item = JSON.parse(JSON.stringify(reverseListData[i]));
        this.flowList.push(item);
        reverseListData.pop();
      }
    },
    remove(id) {
      this.$refs.uWaterfall.remove(id);
    },
    clear() {
      this.$refs.uWaterfall.clear();
    },
    onClick(e) {
      this.$refs.showRight.open();
    },
    closeDrawer() {
      this.$refs.showRight.close();
    },
    uploadMedia(e) {
      common_util.refreshToken();
      var that = this;
      common_vendor.index.chooseImage({
        count: 9,
        sizeType: ["original", "compressed"],
        sourceType: ["album", "camera"]
      }).then((res2) => {
        res2.tempFilePaths.forEach(function(filePath) {
          common_util.getFileName(filePath);
          common_vendor.index.uploadFile({
            url: that.backend_url + "api/media/",
            filePath,
            name: "filePath",
            formData: {
              "upload_user_id": that.user_id,
              "group_id": that.baseFormData.xiangce
            },
            header: {
              "Authorization": "Bearer " + that.access_token
            }
          }).then((res3) => {
            common_vendor.index.reLaunch({
              url: "list?media_group_id=" + that.baseFormData.xiangce
            });
          });
        });
      });
    },
    getTags() {
      common_util.refreshToken();
      this.access_token = common_vendor.index.getStorageSync("access_token");
      var data = {
        format: "json",
        limit: 999999999999
      };
      common_vendor.index.request({
        url: this.backend_url + "api/tag/",
        data,
        header: {
          "Authorization": "Bearer " + this.access_token
        },
        success: (res2) => {
          let fin_tags = [];
          let ori_tags = res2.data.results;
          ori_tags.forEach((e) => {
            fin_tags.push({
              "text": e.slug,
              "value": e.slug
            });
          });
          this.tag_list = fin_tags;
        }
      });
    },
    getList() {
      common_util.refreshToken();
      this.access_token = common_vendor.index.getStorageSync("access_token");
      var data = {
        format: "json",
        limit: this.limit,
        offset: this.offset,
        media_group_id: this.baseFormData.xiangce,
        tags: this.tag_list_selected
      };
      if (this.offset) {
        this.status = "loading";
        data.limit = this.limit;
        data.offset = this.offset;
      }
      common_vendor.index.request({
        url: this.backend_url + "api/media/",
        data,
        header: {
          "Authorization": "Bearer " + this.access_token
        },
        success: (res2) => {
          if (res2.statusCode == 200) {
            let list = this.setTime(res2.data);
            this.listData = this.reload ? list : this.listData.concat(list);
            this.offset = data.offset + data.limit;
            this.reload = false;
          }
          this.addData();
        },
        fail: (data2, code) => {
          console.log("fail" + JSON.stringify(data2));
        }
      });
    },
    goDetail: function(e) {
      common_vendor.index.navigateTo({
        url: "../detail/detail?media_id=" + e.id
      });
    },
    setTime: function(items) {
      var newItems = [];
      items.forEach((e) => {
        var tdate = new Date(e.update_time);
        var ttimestamp = Date.parse(tdate);
        newItems.push({
          image: this.backend_url_without_slash + e.upload_file,
          upload_local_file_path: this.backend_url_without_slash + "/upload/" + e.upload_local_file_path,
          id: e.id,
          post_id: e.post_id,
          title: e.title,
          is_pic: e.is_pic,
          description: e.description,
          pic_time: e.pic_time,
          create_time: this.formatDate(ttimestamp),
          tags: e.tags
        });
      });
      return newItems;
    },
    aderror(e) {
      console.log("aderror: " + JSON.stringify(e.detail));
    }
  }
};
if (!Array) {
  const _easycom_u_lazy_load2 = common_vendor.resolveComponent("u-lazy-load");
  const _easycom_u_tag2 = common_vendor.resolveComponent("u-tag");
  const _easycom_u_waterfall2 = common_vendor.resolveComponent("u-waterfall");
  const _easycom_uni_load_more2 = common_vendor.resolveComponent("uni-load-more");
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  const _easycom_uni_col2 = common_vendor.resolveComponent("uni-col");
  const _easycom_uni_row2 = common_vendor.resolveComponent("uni-row");
  const _easycom_uni_data_checkbox2 = common_vendor.resolveComponent("uni-data-checkbox");
  const _easycom_uni_forms_item2 = common_vendor.resolveComponent("uni-forms-item");
  const _easycom_uni_drawer2 = common_vendor.resolveComponent("uni-drawer");
  (_easycom_u_lazy_load2 + _easycom_u_tag2 + _easycom_u_waterfall2 + _easycom_uni_load_more2 + _easycom_uni_icons2 + _easycom_uni_col2 + _easycom_uni_row2 + _easycom_uni_data_checkbox2 + _easycom_uni_forms_item2 + _easycom_uni_drawer2)();
}
const _easycom_u_lazy_load = () => "../../uni_modules/vk-uview-ui/components/u-lazy-load/u-lazy-load.js";
const _easycom_u_tag = () => "../../uni_modules/vk-uview-ui/components/u-tag/u-tag.js";
const _easycom_u_waterfall = () => "../../uni_modules/vk-uview-ui/components/u-waterfall/u-waterfall.js";
const _easycom_uni_load_more = () => "../../uni_modules/uni-load-more/components/uni-load-more/uni-load-more.js";
const _easycom_uni_icons = () => "../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
const _easycom_uni_col = () => "../../uni_modules/uni-row/components/uni-col/uni-col.js";
const _easycom_uni_row = () => "../../uni_modules/uni-row/components/uni-row/uni-row.js";
const _easycom_uni_data_checkbox = () => "../../uni_modules/uni-data-checkbox/components/uni-data-checkbox/uni-data-checkbox.js";
const _easycom_uni_forms_item = () => "../../uni_modules/uni-forms/components/uni-forms-item/uni-forms-item.js";
const _easycom_uni_drawer = () => "../../uni_modules/uni-drawer/components/uni-drawer/uni-drawer.js";
if (!Math) {
  (_easycom_u_lazy_load + _easycom_u_tag + _easycom_u_waterfall + _easycom_uni_load_more + _easycom_uni_icons + _easycom_uni_col + _easycom_uni_row + _easycom_uni_data_checkbox + _easycom_uni_forms_item + _easycom_uni_drawer)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.p({
      image: $data.banner_img_url
    }),
    b: common_vendor.t($data.banner_title),
    c: common_vendor.o$1(($event) => $options.goDetail(_ctx.banner)),
    d: common_vendor.w(({
      leftList
    }, s0, i0) => {
      return {
        a: common_vendor.f(leftList, (item, index, i1) => {
          return {
            a: common_vendor.o$1(($event) => $options.goDetail(item)),
            b: "7d5e07c6-2-" + i0 + "-" + i1 + ",7d5e07c6-1",
            c: common_vendor.p({
              threshold: "-450",
              ["border-radius"]: "10",
              image: item.upload_local_file_path,
              index
            }),
            d: common_vendor.t(item.title),
            e: common_vendor.f(item.tags, (tag, i, i2) => {
              return {
                a: i,
                b: "7d5e07c6-3-" + i0 + "-" + i1 + "-" + i2 + ",7d5e07c6-1",
                c: common_vendor.p({
                  text: tag,
                  size: "mini",
                  shape: "circle",
                  mode: "light"
                })
              };
            }),
            f: common_vendor.t(item.create_time),
            g: index
          };
        }),
        b: i0,
        c: s0
      };
    }, {
      name: "left",
      path: "d",
      vueId: "7d5e07c6-1"
    }),
    e: common_vendor.w(({
      rightList
    }, s0, i0) => {
      return {
        a: common_vendor.f(rightList, (item, index, i1) => {
          return {
            a: common_vendor.o$1(($event) => $options.goDetail(item)),
            b: "7d5e07c6-4-" + i0 + "-" + i1 + ",7d5e07c6-1",
            c: common_vendor.p({
              threshold: "-450",
              ["border-radius"]: "10",
              image: item.upload_local_file_path,
              index
            }),
            d: common_vendor.t(item.title),
            e: common_vendor.f(item.tags, (tag, i, i2) => {
              return {
                a: i,
                b: "7d5e07c6-5-" + i0 + "-" + i1 + "-" + i2 + ",7d5e07c6-1",
                c: common_vendor.p({
                  text: tag,
                  size: "mini",
                  shape: "circle",
                  mode: "light"
                })
              };
            }),
            f: common_vendor.t(item.create_time),
            g: index
          };
        }),
        b: i0,
        c: s0
      };
    }, {
      name: "right",
      path: "e",
      vueId: "7d5e07c6-1"
    }),
    f: common_vendor.sr("uWaterfall", "7d5e07c6-1"),
    g: common_vendor.o$1(($event) => $data.flowList = $event),
    h: common_vendor.p({
      modelValue: $data.flowList
    }),
    i: common_vendor.p({
      status: $data.status,
      ["icon-size"]: 16,
      ["content-text"]: $data.contentText
    }),
    j: $data.is_superuser
  }, $data.is_superuser ? {
    k: common_vendor.p({
      type: "settings",
      color: "white"
    }),
    l: common_vendor.o$1((...args) => $options.onClick && $options.onClick(...args)),
    m: common_vendor.p({
      span: 12
    }),
    n: common_vendor.p({
      type: "cloud-upload",
      color: "white"
    }),
    o: common_vendor.o$1((...args) => $options.uploadMedia && $options.uploadMedia(...args)),
    p: common_vendor.p({
      span: 12
    })
  } : {
    q: common_vendor.p({
      type: "settings",
      color: "white"
    }),
    r: common_vendor.o$1((...args) => $options.onClick && $options.onClick(...args)),
    s: common_vendor.p({
      span: 12
    }),
    t: common_vendor.p({
      type: "person-filled",
      color: "white"
    }),
    v: common_vendor.o$1((...args) => $options.toLoginPage && $options.toLoginPage(...args)),
    w: common_vendor.p({
      span: 12
    })
  }, {
    x: common_vendor.o$1(($event) => $data.baseFormData.xiangce = $event),
    y: common_vendor.p({
      localdata: $data.xiangce,
      modelValue: $data.baseFormData.xiangce
    }),
    z: common_vendor.p({
      label: "\u76F8\u518C\u5217\u8868",
      required: true
    }),
    A: common_vendor.o$1(($event) => $data.tag_list_selected = $event),
    B: common_vendor.p({
      mode: "tag",
      multiple: true,
      localdata: $data.tag_list,
      modelValue: $data.tag_list_selected
    }),
    C: common_vendor.p({
      label: "\u6807\u7B7E"
    }),
    D: common_vendor.o$1((...args) => $options.filter && $options.filter(...args)),
    E: common_vendor.sr("showRight", "7d5e07c6-17"),
    F: common_vendor.p({
      mode: "right",
      ["mask-click"]: true
    })
  });
}
var MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-7d5e07c6"], ["__file", "/Users/xunan/Projects/wxfishball/pages/list/list.vue"]]);
_sfc_main.__runtimeHooks = 2;
wx.createPage(MiniProgramPage);
