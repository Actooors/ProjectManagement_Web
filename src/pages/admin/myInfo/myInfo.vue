<template>
  <div class="wrapper">
    <div class="content">
      <Form ref="userInfo" :model="userInfo" :label-width="80" :rules="userValidate">
        <FormItem label="姓名">
          <Input v-model="userInfo.userName" readonly size="large"></Input>
        </FormItem>
        <FormItem label="学/工号">
          <Input v-model="userInfo.userId" readonly size="large"></Input>
        </FormItem>
        <FormItem label="性别">
          <RadioGroup v-model="userInfo.sex" size="large">
            <Radio label="男" :disabled="disable">男</Radio>
            <Radio label="女" :disabled="disable">女</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="部门/学院">
          <Input v-model="userInfo.department" readonly size="large"></Input>
        </FormItem>
        <FormItem label="手机" prop="phone">
          <Input v-model="userInfo.phone" :disabled="disable" size="large"></Input>
        </FormItem>
        <FormItem label="邮箱" prop="mail">
          <Input v-model="userInfo.mail" :disabled="disable" size="large" type="email"></Input>
        </FormItem>
        <FormItem label="职称">
          <Input v-model="userInfo.position" :disabled="disable" size="large"></Input>
        </FormItem>
        <FormItem label="专业">
          <Input v-model="userInfo.major" :disabled="disable" size="large"></Input>
        </FormItem>
      </Form>
      <Button class="button" :type="btnType" size="large" @click="handleButton('userInfo')">{{this.text}}</Button>
    </div>
  </div>
</template>

<script>
  import axios from 'axios'

  export default {
    name: "myInfo",
    data() {
      return {
        disable: true,
        btnType: 'primary',
        text: '修改',
        userInfo: {
          userName: '',
          userId: '',
          sex: '',
          department: '',
          phone: '',
          mail: '',
          position: '',
          major: '',
          identitiy: '',
          isAbleLogin: 1,
          leaderId: ''
        },
        userValidate: {
          phone: [
            {required: true, message: '手机号不能为空', trigger: 'blur'}
          ],
          mail: [
            {required: true, message: '邮箱不能为空', trigger: 'blur'},
            {type: 'email', message: '邮箱格式有误', trigger: 'blur'}
          ]
        }
      }
    },
    mounted() {
      // this.initData('更新个人信息成功！')
    },
    methods: {
      initData(msg) {
        axios({
          url: apiRoot + '/user/userInfo/1',
          method: 'get',
        }).then((res) => {
          if (res.data.code === 'SUCCESS') {
            this.userInfo = res.data.data
            this.$Message.success(msg)
          } else {
            this.$Message.error("初始化错误!")
          }
        }).catch(() => {
          this.$Message.error('请检查网络连接!')
        })
      },
      modifyInfo() {
        axios({
          url: apiRoot + '/user/userInfo/2',
          method: 'post',
          data: {
            userId: this.userInfo.userId,
            userName: this.userInfo.userName,
            sex: this.userInfo.sex,
            department: this.userInfo.department,
            phone: this.userInfo.phone,
            mail: this.userInfo.mail,
            position: this.userInfo.position,
            major: this.userInfo.major,
            identity: this.userInfo.identity,
            isAbleLogin: this.userInfo.isAbleLogin,
            leaderId: this.userInfo.leaderId,
          }
        }).then((res) => {
          if (res.data.code === 'SUCCESS') {
            this.$Message.success("成功啦！")
          } else {
            this.$Message.error(res.data.message)
          }
        }).catch((err) => {
          this.$Message.error("保存失败！")
        })
      },
      handleButton(name) {
        if (this.btnType === 'primary') {
          this.disable = false
          this.btnType = 'success'
          this.text = '保存'
        } else if (this.btnType === 'success') {
          // 保存并请求后端
          this.$refs[name].validate((valid) => {
            if (valid) {
              this.modifyInfo()
              this.disable = true
              this.btnType = 'primary'
              this.text = '修改'
            } else {
              this.$Message.error('请正确填写有关字段！');
            }
          })
        }
      }
    }
  }
</script>

<style scoped lang="scss">
  @import "myInfo";
</style>
<style lang="scss">
  .ivu-form .ivu-form-item-label {
    font-size: 15px;
  }
</style>
