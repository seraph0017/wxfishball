"use strict";
var common_vendor = require("../../../../common/vendor.js");
const _sfc_main = {
  name: "u-gap",
  props: {
    bgColor: {
      type: String,
      default: "transparent "
    },
    height: {
      type: [String, Number],
      default: 30
    },
    marginTop: {
      type: [String, Number],
      default: 0
    },
    marginBottom: {
      type: [String, Number],
      default: 0
    }
  },
  computed: {
    gapStyle() {
      return {
        backgroundColor: this.bgColor,
        height: this.height + "rpx",
        marginTop: this.marginTop + "rpx",
        marginBottom: this.marginBottom + "rpx"
      };
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.s($options.gapStyle)
  };
}
var Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-fbbf9d6e"], ["__file", "/Users/xunan/Projects/wxfishball/uni_modules/vk-uview-ui/components/u-gap/u-gap.vue"]]);
wx.createComponent(Component);
