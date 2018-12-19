<template>
  <div class="wrapper">
    <div class="content">
      <Form ref="userInfo" :model="userInfo" :label-width="80" :rules="userValidate">
        <FormItem label="姓名">
          <Input v-model="userInfo.username" readonly size="large"></Input>
        </FormItem>
        <FormItem label="学/工号">
          <Input v-model="userInfo.userid" readonly size="large"></Input>
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
        <FormItem label="手机" prop="telphone">
          <Input v-model="userInfo.telphone" :disabled="disable" size="large"></Input>
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
  export default {
    name: "myInfo",
    data() {
      return {
        disable: true,
        btnType: 'primary',
        text: '修改',
        userInfo: {
          username: '',
          userid: '',
          sex: '',
          department: '',
          telphone: '',
          mail: '',
          position: '',
          major: '',
          identitiy: '',
          is_able_login: 1,
          leader_id: ''
        },
        userValidate: {
          telphone: [
            {required: true, message: '手机号不能为空', trigger: 'blur'}
          ],
          mail: [
            {required: true, message: '邮箱不能为空', trigger: 'blur'},
            {type: 'email', message: 'Incorrect email format', trigger: 'blur'}
          ]
        }
      }
    },
    methods: {

      handleButton(name) {
        if (this.btnType === 'primary') {
          this.disable = false
          this.btnType = 'success'
          this.text = '保存'
        } else if (this.btnType === 'success') {
          // 保存并请求后端
          this.$refs[name].validate((valid) => {
            if (valid) {
              this.$Message.success('Success!');
              this.disable = true
              this.btnType = 'primary'
              this.text = '修改'
            } else {
              this.$Message.error('Fail!');
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
  .ivu-form ivu-form-label-right {
    .ivu-form-item-label {
      font-size: 1.3em !important;
    }
  }
</style>
