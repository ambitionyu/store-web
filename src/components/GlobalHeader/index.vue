<template>
    <div class="header">
        <a-icon
            class="trigger"
            :type="collapsed ? 'menu-unfold' : 'menu-fold'"
            @click="toggle"
        />
    </div>
</template>

<script>
import HeaderSearch from "../HeaderSearch";
import NoticeIcon from "../NoticeIcon";
export default {
  name: "GlobalHeader",
  components: {
    HeaderSearch,
    NoticeIcon
  },
  props: {
    currentUser: {
      type: Object
    },
    collapsed: {
      type: Boolean
    },
    onCollapse: {
      type: Function
    },
    onNoticeVisibleChange: {
      type: Function
    },
    onNoticeClear: {
      type: Function
    },
    fetchingNotices: {
      type: Boolean
    },
    notices: {
      type: Array
    },
    onMenuClick: {
      type: Function,
      default: () => {}
    }
  },
  data() {
    return {};
  },
  methods: {
    toggle() {
      this.onCollapse(!this.collapsed);
    },
    onSearch(value) {
      console.log("input", value);
    },
    onPressEnter(value) {
      console.log("enter", value);
    },
    onItemClick(item, tabProps) {
      console.log(item, tabProps);
    }
  }
};
</script>

<style lang="less" scoped>
@import "./index.less";
</style>
<style lang="less">
.ant-layout {
  min-height: 100vh;
  overflow-x: hidden;
}
.menu {
  .anticon {
    margin-right: 8px;
  }
  .ant-dropdown-menu-item {
    width: 160px;
  }
}
</style>

