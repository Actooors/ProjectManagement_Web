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
              name="avaProject"
            >
              <Icon type="ios-add-circle-outline"/>
              &nbsp;可申请项目
            </MenuItem>
            <MenuItem
              name="reqProject"
            >
              <Icon type="ios-fastforward-outline"/>
              &nbsp;申请中项目
            </MenuItem>
            <MenuItem name="failProject">
              <Icon type="ios-close-circle-outline"/>
              被驳回项目
            </MenuItem>
            <MenuItem
              name="myProject"
            >
              <Icon type="ios-archive-outline"/>
              &nbsp;我的项目
            </MenuItem>
            <MenuItem
              name="myInfo"
            >
              <Icon type="ios-person-outline"/>
              &nbsp;个人信息
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
            用户身份：
            <Dropdown style="margin-right: 10px">
              <a>
                {{this.identify_name}}
                <Icon type="ios-arrow-down"></Icon>
              </a>
              <DropdownMenu slot="list">
                <DropdownItem v-for="item in user_identity" :key="item.index"
                              @click.native="$router.push('/'+`${item.router}`)">
                  {{item.name}}
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
            <Avatar style="margin-bottom: 3px;margin-right: 5px;color: #f56a00;background-color: #fde3cf">user</Avatar>
            <Dropdown :visible="visible" trigger="click">
              <a @click="handleOpen">
                {{this.userName}}
                <Icon type="ios-arrow-down"></Icon>
              </a>
              <DropdownMenu slot="list">
                <DropdownItem @click.native="$router.push('myInfo')">
                  <Icon type="ios-person" style="margin-bottom: 3px" size="17"/>
                  我的信息
                </DropdownItem>
                <DropdownItem @click.native="Logout" divided>
                  <Icon type="ios-log-out" style="margin-bottom: 3px" size="17"/>
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
    name: "user",
    components: {CustomMenu},
    data() {
      return {
        MenuActiveName: null,
        visible: false,
        isCollapsed: false,
        user_identity: [
          {
            router: 'user',
            name: '用户'
          },
          {
            router: 'principal',
            name: '业务员'
          },

        ],
        userName: localStorage.getItem('username'),
        identify_name: null,
      };
    },
    mounted() {
      this.initMenuActive();
      this.initIdentify_name();
    },
    watch: {
      $route() {
        this.$nextTick(() => {
          this.initMenuActive();
        });
      }
    },
    methods: {
      initIdentify_name() {
        this.identify_name = this.user_identity[0].name
        this.$router.push('/' + this.user_identity[0].router)
      },
      Logout() {
        this.$router.push('/login')
        localStorage.clear()
      },
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

  .ivu-select-dropdown {
    width: 100px;
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

  /*.ivu-layout-content {*/
  /*height: calc(100 vh-64px);*/
  /*overflow: scroll;*/
  /*}*/
</style>
