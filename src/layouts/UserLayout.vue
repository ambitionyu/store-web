<template>
    <div class="container">
        <div class="content">
            <div class="top">
                <div class="header">
                    <router-link to="/">
                    <span class="title">食堂物料采购管理系统</span>
                    </router-link>
                </div>
            </div>
            <router-view />
        </div>
    </div>
</template>

<script>
import logo from "@/assets/logo.png";
import GlobalFooter from "@/components/GlobalFooter";
export default {
  name: "UserLayout",
  components: {
    GlobalFooter
  },
  data() {
    const links = [
      {
        key: "help",
        title: "帮助",
        href: ""
      },
      {
        key: "privacy",
        title: "隐私",
        href: ""
      },
      {
        key: "terms",
        title: "条款",
        href: ""
      }
    ];
    return {
      links,
      logo
    };
  }
};
</script>

<style lang="less" scoped>
@import "./UserLayout.less";
</style>
