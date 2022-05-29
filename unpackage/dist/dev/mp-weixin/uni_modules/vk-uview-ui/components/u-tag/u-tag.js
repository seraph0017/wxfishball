"use strict";
var common_vendor = require("../../../../common/vendor.js");
const _sfc_main = {
  name: "u-tag",
  emits: ["click", "close"],
  props: {
    type: {
      type: String,
      default: "primary"
    },
    disabled: {
      type: [Boolean, String],
      default: false
    },
    size: {
      type: String,
      default: "default"
    },
    shape: {
      type: String,
      default: "square"
    },
    text: {
      type: [String, Number],
      default: ""
    },
    bgColor: {
      type: String,
      default: ""
    },
    color: {
      type: String,
      default: ""
    },
    borderColor: {
      type: String,
      default: ""
    },
    closeColor: {
      type: String,
      default: ""
    },
    index: {
      type: [Number, String],
      default: ""
    },
    mode: {
      type: String,
      default: "light"
    },
    closeable: {
      type: Boolean,
      default: false
    },
    show: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {};
  },
  computed: {
    customStyle() {
      let style = {};
      if (this.color)
        style.color = this.color;
      if (this.bgColor)
        style.backgroundColor = this.bgColor;
      if (this.mode == "plain" && this.color && !this.borderColor)
        style.borderColor = this.color;
      else
        style.borderColor = this.borderColor;
      return style;
    },
    iconStyle() {
      if (!this.closeable)
        return;
      let style = {};
      if (this.size == "mini")
        style.fontSize = "20rpx";
      else
        style.fontSize = "22rpx";
      if (this.mode == "plain" || this.mode == "light")
        style.color = this.type;
      else if (this.mode == "dark")
        style.color = "#ffffff";
      if (this.closeColor)
        style.color = this.closeColor;
      return style;
    },
    closeIconColor() {
      if (this.closeColor)
        return this.closeColor;
      else if (this.color)
        return this.color;
      else if (this.mode == "dark")
        return "#ffffff";
      else
        return this.type;
    }
  },
  methods: {
    clickTag() {
      if (this.disabled)
        return;
      this.$emit("click", this.index);
    },
    close() {
      this.$emit("close", this.index);
    }
  }
};
if (!Array) {
  const _easycom_u_icon2 = common_vendor.resolveComponent("u-icon");
  _easycom_u_icon2();
}
const _easycom_u_icon = () => "../u-icon/u-icon.js";
if (!Math) {
  _easycom_u_icon();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $props.show
  }, $props.show ? common_vendor.e({
    b: common_vendor.t($props.text),
    c: $props.closeable
  }, $props.closeable ? {
    d: common_vendor.o$1($options.close),
    e: common_vendor.s($options.iconStyle),
    f: common_vendor.p({
      size: "22",
      color: $options.closeIconColor,
      name: "close"
    })
  } : {}, {
    g: common_vendor.o$1(() => {
    }),
    h: common_vendor.n($props.disabled ? "u-disabled" : ""),
    i: common_vendor.n("u-size-" + $props.size),
    j: common_vendor.n("u-shape-" + $props.shape),
    k: common_vendor.n("u-mode-" + $props.mode + "-" + $props.type),
    l: common_vendor.s($options.customStyle),
    m: common_vendor.o$1((...args) => $options.clickTag && $options.clickTag(...args))
  }) : {});
}
var Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-11ef6bd1"], ["__file", "/Users/xunan/Projects/wxfishball/uni_modules/vk-uview-ui/components/u-tag/u-tag.vue"]]);
wx.createComponent(Component);
