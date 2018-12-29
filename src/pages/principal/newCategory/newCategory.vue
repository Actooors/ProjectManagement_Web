<template>
  <div class="wrapper">
    <div class="content">
      <Form ref="projectMes" :model="projectMes" :label-width="110" >
        <FormItem label="项目名称">
          <Input v-model="projectMes.projectName" />
        </FormItem>
        <FormItem label="项目类型">
          <i-select  readonly size="large" >
            <i-option  v-model="projectMes.projectType" v-for="(item,index) in projectMes.projectTypeList" :key="index" >{{ item.label }}</i-option>
          </i-select>
        </FormItem>
        <FormItem label="申请人类型">
          <CheckboxGroup v-model="projectMes.userType">
            <Checkbox label="undergraduate">
              <span style="font-size: 15px">本科生</span>
            </Checkbox>
            <Checkbox label="graduateStudent">
              <span style="font-size: 15px">研究生</span>
            </Checkbox>
            <Checkbox label="masterStudent">
              <span style="font-size: 15px">博士生</span>
            </Checkbox>
            <Checkbox label="cesStudent">
              <span style="font-size: 15px">计算机学生</span>
            </Checkbox>
          </CheckboxGroup>
        </FormItem>
        <FormItem label="负责专家">
          <i-select  readonly size="large" >
            <i-option  v-model="projectMes.expertName"  v-for="(item,index) in projectMes.expertList" :key="index" >{{ item.label }}</i-option>
          </i-select>
        </FormItem>
        <FormItem label="项目描述">
          <i-input type="textarea" v-model="projectMes.description" :rows="4" placeholder="请输入项目描述..."></i-input>
        </FormItem>
        <FormItem label="申报时间">
          <i-col span="12">
            <Date-picker :value="value1" format="yyyy/MM/dd" type="daterange" placement="bottom-end" placeholder="选择日期" style="width: 200px"></Date-picker>
          </i-col>
        </FormItem>
        <FormItem label="截止时间">
            <DatePicker type="date" :value="value2" style="width: 200px"></DatePicker>
        </FormItem>
        <FormItem label="经费额度">
          <Input-number :max="100000" :min="100" :value="500"></Input-number>
        </FormItem>
        <FormItem label="上传模板">
          <Upload
            multiple
            type="drag"
            action="//jsonplaceholder.typicode.com/posts/">
            <div style="padding: 20px 0">
              <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
              <p>点击或将文件拖拽到这里上传</p>
            </div>
          </Upload>
        </FormItem>
      </Form>
      <Button class="button" :type="btnType" size="large" @click.native="handleButton">{{this.text}}</Button>
    </div>
  </div>
</template>

<script>
  export default {
    name: "newCategory",
    data() {
      return {
        disable: true,
        btnType: 'primary',
        text: 'submit',
        value2: '2019-12-31',
        value1: [ '2019-01-01', '2019-12-31' ],
        projectMes: {
          projectName: '',
          projectType: '',
          userType: [''],
          expertName: '',
          expertList: [
            {
              index: 1,
              label: '李老师'
            },
            {
              index: 2,
              label: '六老师'
            },
            {
              index: 3,
              label: '张老师'
            },
            {
              index: 4,
              label: '王老师'
            },
            {
              index: 5,
              label: '陈教授'
            }
          ],
          description: '',
          projectTypeList: [
            {
              index: 1,
              label: '理工'
            },
            {
              index: 2,
              label: '人文'
            },
            {
              index: 3,
              label: '经管'
            },
            {
              index: 4,
              label: '通信'
            },
            {
              index: 5,
              label: '机自'
            },
            {
              index: 6,
              label: '计算机'
            }
          ]
        }
      }
    },
    methods: {
      handleButton() {
        if (this.btnType === 'primary') {
          this.disable = false
          this.btnType = 'success'
          this.text = '保存'
          this.$Message.success('点击保存确认提交结果！');
        }
        else if (this.btnType === 'success'){
          this.$Message.success('保存成功');
        }
        else {
          this.$Message.error('请正确填写有关字段！');
        }
      }
    }
  }
</script>

<style scoped lang="scss">
  @import "newCategory";
</style>
<style lang="scss">
  .ivu-form .ivu-form-item-label {
    font-size:15px;
  }
</style>
