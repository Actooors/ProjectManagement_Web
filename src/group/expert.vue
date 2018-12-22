<template>
  <div class="layout">
    <Layout style="height: 100%;">
      <!-- 侧边导航栏 -->
      <Sider
        ref="side1"
        breakpoint="lg"
        collapsible
        :collapsed-width="78"
        v-model="isCollapsed"
        :width="250"
      >
        <div class="layout-logo-left">
          <img src="../assets/img/title.png" style="width: 200px;">
        </div>
        <div class="menu-list">
          <CustomMenu
            :active-name="MenuActiveName"
            theme="custom"
            width="auto"
            :class="menuitemClasses"
            @on-select="handleSelectItem"
          >
            <MenuItem
              name="reqProject"
            >
              <Icon type="ios-browsers-outline" />
              项目申请
            </MenuItem>
            <MenuItem
              name="endProject"
            >
              <Icon type="ios-browsers" />
              项目结题
            </MenuItem>
          </CustomMenu>
        </div>
      </Sider>
      <Layout>
        <!-- 页头 -->
        <Header class="layout-header-bar">
          <div
            class="layout-header-title"
            id="layout-header-title"
          ></div>
          <div
            class="select"
            trigger="custom"
          >
            <Avatar icon="ios-person" style="margin-bottom: 5px;margin-right: 5px;"/>
            <Dropdown :visible="visible">
              <a @click="handleOpen">
                {{this.UserName}}
                <Icon type="ios-arrow-down"></Icon>
              </a>
              <DropdownMenu slot="list">
                <DropdownItem @click.native="Logout">
                  <i class="iconfont icon icon-dengchu"></i>
                  登出
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        </Header>
        <!-- 内容 -->
        <Content :style="{margin: '20px', background: '#fff', minHeight: '220px'}">
          <router-view></router-view>
        </Content>
      </Layout>
    </Layout>
  </div>
</template>

<script>
  import CustomMenu from 'components/customMenu/customMenu'

  export default {
    name: "expert",
    components: {CustomMenu},
    data(){
      return {
        MenuActiveName: null,
        visible: false,
        isCollapsed: false,
        UserName: '审核专家'
      }
    },
    watch: {
      $route() {
        this.$nextTick(() => {
          this.initMenuActive();
        });
      }
    },
    mounted() {
      this.initMenuActive();
    },
    methods: {
      handleOpen() {
        this.visible = true
      },
      handleSelectItem(name) {
        const that = this
        this.$nextTick(() => {
          that.$router.push(name)
        })
      },
      initMenuActive(activeName) {
        this.MenuActiveName =
          activeName ||
          this.$route.matched[this.$route.matched.length - 1].components.default
            .name;
        this.$nextTick(() => {
          document.querySelector(
            "#layout-header-title"
          ).innerHTML = document.querySelector(
            ".ivu-menu-item-selected"
          ).innerHTML;
        });
      },
    },
    computed: {
      menuitemClasses() {
        return ["menu-item", this.isCollapsed ? "collapsed-menu" : ""];
      }
    }
  }
</script>

<style scoped lang="scss">
@import "group";
</style>
<style lang="scss">
  .ivu-layout-content {
    min-height: auto !important;
  }

  .menu-icon {
    transition: all 0.3s;
  }

  .rotate-icon {
    transform: rotate(-90deg);
  }

  .menu-item span {
    display: inline-block;
    overflow: hidden;
    width: 69px;
    text-overflow: ellipsis;
    white-space: nowrap;
    vertical-align: bottom;
    transition: width 0.2s ease 0.2s;
  }

  .menu-item i {
    transform: translateX(0px);
    transition: font-size 0.2s ease, transform 0.2s ease;
    vertical-align: middle;
    font-size: 16px;
  }

  .collapsed-menu span {
    width: 0px;
    transition: width 0.2s ease;
  }

  .collapsed-menu i {
    transform: translateX(5px);
    transition: font-size 0.2s ease 0.2s, transform 0.2s ease 0.2s;
    vertical-align: middle;
    font-size: 22px;
  }

  .menu-list {
    overflow-y: auto;
    height: calc(100% - 60px + 3px); //layout-logo-height+margin=70px
    &::-webkit-scrollbar {
      display: none;
    }
  }

  .ivu-menu-submenu-title:hover {
    color: #ebf3ff !important;
  }

  .ivu-layout-sider-zero-width-trigger {
    opacity: 0.5 !important;
  }

  .ivu-layout-sider-trigger {
    background: none !important;
  }

  .ivu-layout-sider {
    z-index: 1000;
  }

  .ivu-dropdown-rel :first-child {
    color: #515a6e !important;
  }

  @media screen and (min-width: 1200px) {
    .ivu-layout-sider-trigger {
      display: none !important;
    }
  }

  // 布局
  .ivu-layout-sider {
    //  width:200px
  }

  .ivu-layout-header, .ivu-layout-content {
    width: calc(100 vw-200px);
  }

  .ivu-layout-header {
    height: 64px;
    z-index: 999;
  }

  .ivu-layout-content {
    height: calc(100 vh-64px);
    overflow: scroll;
  }
</style>
