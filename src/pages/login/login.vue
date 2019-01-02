<template>
  <div class="login">
    <div :style="fixStyle" class="filter">
      <div class="SysTitle">
        项目管理系统欢迎您
        <div class="login-box">
          <Input v-model="UserId" style="margin-bottom: 10px" size="large" prefix='md-person' placeholder="学/工号"/>
          <Input v-model="Password" type="password" style="margin-bottom: 10px" prefix="md-lock" size="large"
                 placeholder="密码"/>
          <ButtonGroup size="large">
            <div style="display: flex;">
              <Button size="large"  type="primary" :loading="loading" @click="login">
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
                console.log("res:" , res.data)
                this.loading = false;
                if (res.data.data.identity === 1) { //普通用户
                  this.$router.push({
                    path: '/user'
                  });
                } else if (res.data.data.identity === 2) { //业务员
                  this.$router.push({
                    path: '/principal'
                  });
                } else if (res.data.data.identity === 3) {  //专家
                  this.$router.push({
                    path: '/expert'
                  });
                } else if (res.data.data.identity === 4) {  //领导
                  this.$router.push({
                    path: '/leader'
                  });
                } else if (res.data.data.identity === 5) { //系统管理员
                  this.$router.push({
                    path: '/admin'
                  });
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
    mounted: function () {
      // document.onkeyup = (event) => {
      //   if (event.code === 'Enter') {
      //     this.login()
      //   }
      // }
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
</style>
