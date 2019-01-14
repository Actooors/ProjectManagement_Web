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
            :open-names="openNames"
            theme="custom"
            width="auto"
            :class="menuitemClasses"
            @on-select="handleSelectItem"
            ref="menu"
            :key="activeKey"
          >
            <Submenu name="exProject">
              <template slot="title">
                <Icon type="ios-stopwatch-outline"/>
                待审核的
              </template>
              <!--<MenuItem name="exProject-projectCategory">-->
                <!--项目大类-->
              <!--</MenuItem>-->
              <MenuItem
                name="exProject-reqProject"
              >项目申请
              </MenuItem>
              <MenuItem
                name="exProject-endProject"
              >项目结题
              </MenuItem>
            </Submenu>
            <Submenu name="Project">
              <template slot="title">
                <Icon type="ios-archive-outline"/>
                我管理的
              </template>
              <MenuItem
                name="Project-projectList"
              >项目列表
              </MenuItem>
              <MenuItem
                name="Project-statistic"
              >数据统计
              </MenuItem>
            </Submenu>
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
            <Avatar icon="ios-person" style="margin-bottom: 5px;margin-right: 5px;"/>
            <Dropdown :visible="visible">
              <a @click="handleOpen">
                {{this.UserName}}
                <Icon type="ios-arrow-down"></Icon>
              </a>
              <DropdownMenu slot="list">
                <DropdownItem @click.native="$router.push('myInfo')">
                  <Icon type="ios-person" style="margin-bottom: 3px" size="17"/>
                  我的信息
                </DropdownItem>
                <DropdownItem divided @click.native="Logout">
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
    name: "leader",
    components: {CustomMenu},
    data() {
      return {
        activeKey: 0,
        openNames: [],
        MenuActiveName: '',
        visible: false,
        isCollapsed: false,
        UserName: localStorage.getItem('username')
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
      this.initOpenNames();
    },
    methods: {
      handleOpen() {
        this.visible = true
      },
      prehandleName(name) {
        if (name.lastIndexOf('-') != -1) {
          var index = name.lastIndexOf('-')
          console.log(index)
          name = name.substr(index + 1)
        }
        return name;
      },
      handleSelectItem(name) {
        const that = this
        this.$nextTick(() => {
          name = this.prehandleName(name);
          that.$router.push(name)
        })
      },
      initOpenNames() {
        //将‘payment-1-2’转化为['payment','payment-1','payment-1-2']形式，便于侧边栏展开
        let splitArr = this.MenuActiveName.split('-')
        splitArr.length && splitArr.length--;
        let openNames = []
        let openName = ''
        for (let i = 0; i < splitArr.length; i++) {
          openName = openName + (!i ? '' : '-') + splitArr[i]
          openNames.push(openName)
        }
//        //payment必定展开
//        openNames[0] !== 'payment' && openNames.push('payment')
        this.openNames = openNames
        this.activeKey++;
        console.log("openNames", this.openNames)
      },
      initMenuActive(activeName) {
        activeName =
          activeName ||
          this.$route.matched[this.$route.matched.length - 1].components.default
            .name;
        console.log(this.$refs.menu)
        const that = this;

        function dfs(component, name) {
          if (!component.$children.length) {
            console.log("??", component.name, that.prehandleName(component.name) === name, that.prehandleName(component.name), name)
            return that.prehandleName(component.name) === name ? component.name : '';
          }
          for (let x of component.$children) {
            if (!('name' in x)) {
              continue;
            }
            let realname = dfs(x, name);
            if (realname) {
              return realname;
            }
          }
          return that.prehandleName(component.name) === name ? component.name : '';
        };
        this.MenuActiveName = dfs(this.$refs.menu, activeName);
        console.log('!@', this.MenuActiveName)
        this.$nextTick(() => {
          document.querySelector(
            "#layout-header-title"
          ).innerHTML = document.querySelector(
            ".ivu-menu-item-selected"
          ).innerHTML;
        });
      },
      Logout() {
        localStorage.clear()
        this.$router.push('/login')
      }
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
