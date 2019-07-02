<template>
  <!--  <div class="login">-->
  <!--    <div :style="fixStyle" class="filter">-->
  <!--      <div class="SysTitle">-->
  <!--        项目管理系统欢迎您-->
  <!--        <div class="login-box">-->
  <!--          <Input v-model="UserId" style="margin-bottom: 10px" size="large" prefix='md-person' placeholder="学/工号"/>-->
  <!--          <Input v-model="Password" type="password" style="margin-bottom: 7px" prefix="md-lock" size="large"-->
  <!--                 placeholder="密码"/>-->
  <!--          <Select v-model="selectedIdentity" placeholder="请选择身份">-->
  <!--            <Option v-for="item in identityList" :value="item.value" :key="item.value">{{ item.label }}</Option>-->
  <!--          </Select>-->
  <!--          <ButtonGroup size="large">-->
  <!--            <div style="display: flex;">-->
  <!--              <Button size="large" type="primary" :loading="loading" @click="login" v-on:keyup.13="login">-->
  <!--                登录-->
  <!--              </Button>-->
  <!--            </div>-->
  <!--          </ButtonGroup>-->
  <!--        </div>-->
  <!--      </div>-->
  <!--    </div>-->
  <!--  </div>-->
  <div class="body">
    <div class="bg1"></div>
    <div class="gyl">
      项目管理系统
      <div class="gy2">打造国内最具规模的、最专业的校园项目管理平台</div>
    </div>
    <div class="bg">
      <div class="wel">用户登录</div>
      <div class="user">
        <div class="yonghu" style="">用户名</div>
        <input type="text" name="用户" value="" ref="userid"/>
      </div>
      <div class="password">
        <div class="yonghu">密&nbsp;&nbsp;&nbsp;码</div>
        <input class="" type="password" name="密码" value="" ref="password"/>
      </div>
      <div class="rem">
        <input type="checkbox" name="" id="" value=""/>
        <div id="reb">
          记住密码
        </div>
      </div>
      <div class="fg">
        <div style="font-size: 11px;margin-top: 11px;">
          <a style="font-size: 11px;" href="http://services.shu.edu.cn/">忘记密码？</a>
        </div>
      </div>
      <input class="btn" type="submit" name="登录" value="登录" @click="login()" />
    </div>
  </div>
</template>

<script>
  import axios from 'axios'

  export default {
    name: "login",
    data() {
      return {
        fixStyle: '',
        identityList: [
          {
            value: '1',
            label: '普通用户'
          },
          {
            value: '2',
            label: '业务员'
          },
          {
            value: '3',
            label: '审核专家'
          },
          {
            value: '4',
            label: '领导'
          },
          {
            value: '5',
            label: '管理员'
          },
        ]
      }
    },
    methods: {
      login() {
        this.$Spin.show({
          render: (h) => {
            return h('div', [
              h('Icon', {
                'class': 'demo-spin-icon-load',
                props: {
                  type: 'ios-loading',
                  size: 18
                }
              }),
              h('div', '登录中...')
            ])
          }
        });
        if (this.$refs.userid.value && this.$refs.password.value) {
          axios({
            url: apiRoot + '/login',
            method: 'post',
            data: {
              uid: this.$refs.userid.value,
              password: this.$refs.password.value
            }
          }).then((res) => {
              if (res.data.code === 'SUCCESS') {
                console.log("res:", res.data)
                let identity = res.data.data.identity.split('|')[0]
                console.log(identity)
                this.$Spin.hide();
                this.$Message.success('登录成功！');
                switch (identity) {
                  case "1":
                    this.$router.push('/user');
                    break;
                  case "2":
                    this.$router.push('/principal');
                    break;
                  case "3":
                    this.$router.push('/expert');
                    break;
                  case "4":
                    this.$router.push('/leader');
                    break;
                  case "5":
                    this.$router.push('/admin');
                    break;
                }
                localStorage.setItem('token', res.data.data.token);
                localStorage.setItem('userid', res.data.data.uid)
                localStorage.setItem('username', res.data.data.username)
                localStorage.setItem('authority',res.data.data.identity.split('|'))
              } else {
                this.$Message.error(res.data.message);
                this.loading = false
              }
            }
          ).catch((err) => {
            console.error(err)
            this.$Message.error("登录失败，请检查网络连接！");
            this.$Spin.hide();
          })
        } else {
          this.$Message.info("请完整填写有关字段！");
          this.$Spin.hide();
        }
      }
    },
    created() {
      this.selectedIdentity = null;
    }
  }
</script>

<style scoped lang="scss">
  @import "login";
</style>

<style lang="scss">
  .login-box {
    .ivu-input {
      background-color: transparent;
      color: #f8f8f9ab;
    }
  }

  .ivu-select-selection {
    background-color: #fff0 !important;
  }

  .ivu-select-selected-value {
    background-color: transparent;
    color: #f8f8f9ab;
  }

  .ivu-select-arrow {
    color: #f8f8f9ab;
  }
</style>
