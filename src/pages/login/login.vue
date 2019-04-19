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
        selectedIdentity: "",
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
          // {
          //   value: '5',
          //   label: '超级管理员'
          // },
        ]
      }
    },
    methods: {
      login() {
        this.loading = true
        if (this.UserId && this.Password && this.selectedIdentity) {
          axios({
            url: apiRoot + '/login',
            method: 'post',
            data: {
              uid: this.UserId,
              password: this.Password
            }
          }).then((res) => {
              if (res.data.code === 'SUCCESS') {
                console.log("res:", res.data)
                this.loading = false;
                if (res.data.data.identity.indexOf(this.selectedIdentity) != -1) { //普通用户
                  this.$Message.success('登录成功！');
                  switch (this.selectedIdentity) {
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
                    // case "5":
                    //   this.$router.push('/admin');
                    //   break;
                  }
                } else {
                  this.$Message.error('您没有该用户权限！');
                  return
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
            console.error(err)
            this.$Message.error("登录失败，请检查网络连接！");
            this.loading = false
          })
        } else {
          if (this.selectedIdentity === null) {
            this.$Message.warning('请选择用户身份！');
            this.loading = false
            return
          }
          this.$Message.info("请完整填写有关字段！");
          this.loading = false
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
