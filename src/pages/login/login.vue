<template>
  <div class="login">
    <div :style="fixStyle" class="filter">
      <div class="SysTitle">
        项目管理系统欢迎您
        <div class="login-box">
          <Input v-model="UserId" style="margin-bottom: 10px" size="large" prefix='md-person' placeholder="学/工号"/>
          <Input v-model="Password" type="password" style="margin-bottom: 7px" prefix="md-lock" size="large"
                 placeholder="密码"/>
          <Select v-model="selectedIdentity" placeholder="请选择身份">
            <Option v-for="item in identityList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
          <ButtonGroup size="large">
            <div style="display: flex;">
              <Button size="large" type="primary" :loading="loading" @click="login" v-on:keyup.13="login">
                登录
              </Button>
            </div>
          </ButtonGroup>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import axios from 'axios'

  export default {
    name: "login",
    data() {
      return {
        vedioCanPlay: false,
        fixStyle: '',
        UserId: '',
        Password: '',
        loading: false,
        selectedIdentity: null,
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
            label: '超级管理员'
          },
        ]
      }
    },
    methods: {
      login() {
        this.loading = true
        if (this.UserId && this.Password) {
          axios({
            url: apiRoot + '/login',
            method: 'post',
            data: {
              uid: this.UserId,
              password: this.Password
            }
          }).then((res) => {
              if (res.data.code === 'SUCCESS') {
                this.$Message.success('登录成功！');
                console.log("res:", res.data)
                this.loading = false;
                if (res.data.data.identity.indexOf('1') != -1 && this.selectedIdentity === 1) { //普通用户
                  this.$router.push({
                    path: '/user'
                  });
                } else {
                  this.$Message.error('您没有该用户权限！');
                }
                if (res.data.data.identity.indexOf('2') != -1 && this.selectedIdentity === 2) { //业务员
                  this.$router.push({
                    path: '/principal'
                  });
                } else {
                  this.$Message.error('您没有该用户权限！');
                }
                if (res.data.data.identity.indexOf('3') != -1 && this.selectedIdentity === 3) {  //专家
                  this.$router.push({
                    path: '/expert'
                  });
                } else {
                  this.$Message.error('您没有该用户权限！');
                }
                if (res.data.data.identity.indexOf('4') != -1 && this.selectedIdentity === 4) {  //领导
                  this.$router.push({
                    path: '/leader'
                  });
                } else {
                  this.$Message.error('您没有该用户权限！');
                }
                if (res.data.data.identity.indexOf('5') != -1 && this.selectedIdentity === 5) { //系统管理员
                  this.$router.push({
                    path: '/admin'
                  });
                } else {
                  this.$Message.error('您没有该用户权限！');
                }
                localStorage.setItem('token', res.data.data.token);
                localStorage.setItem('userid', res.data.data.uid)
                localStorage.setItem('username', res.data.data.username)
              } else {
                this.$Message.error(res.data.message);
                this.loading = false
              }
            }
          ).catch((err) => {
            console.log(err)
            this.$Message.error("登录失败，请检查网络连接！");
            this.loading = false
          })
        }
        else {
          this.$Message.info("请完整填写有关字段！");
          this.loading = false
        }
      }
    },
    created: function () {
      window.onresize = () => {
        const windowWidth = document.body.clientWidth
        const windowHeight = document.body.clientHeight
        const windowAspectRatio = windowHeight / windowWidth
        let videoWidth
        let videoHeight
        if (windowAspectRatio < 0.5625) {
          videoWidth = windowWidth
          videoHeight = videoWidth * 0.5625
          this.fixStyle = {
            height: windowWidth * 0.5625 + 'px',
            width: windowWidth + 'px',
            'margin-bottom': (windowHeight - videoHeight) / 2 + 'px',
            'margin-left': 'initial'
          }
        } else {
          videoHeight = windowHeight
          videoWidth = videoHeight / 0.5625
          this.fixStyle = {
            height: windowHeight + 'px',
            width: windowHeight / 0.5625 + 'px',
            'margin-left': (windowWidth - videoWidth) / 2 + 'px',
            'margin-bottom': 'initial'
          }
        }
      }
      window.onresize()
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
