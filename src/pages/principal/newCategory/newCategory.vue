<template>
  <div class="wrapper">
    <div class="content">
      <Form ref="projectMes" :rules="ruleProjectMes" :model="projectMes" :label-width="150">
        <FormItem label="项目名称" prop="projectName">
          <Input v-model="projectMes.projectName" size="large" placeholder="填写项目名称"/>
        </FormItem>
        <FormItem label="项目类型" prop="projectType">
          <Select v-model="projectMes.projectType" size="large" placeholder="选择项目类型">
            <Option v-for="(item,index) in projectTypeList"
                    :key="index" :value="item.index">{{ item.label }}
            </Option>
          </Select>
        </FormItem>
        <FormItem label="是否参加上会" prop="isMeeting">
          <Switch v-model="projectMes.isMeeting" :value="projectMes.isMeeting">
            <span slot="open">是</span>
            <span slot="close">否</span>
          </Switch>
        </FormItem>
        <FormItem label="项目联系方式" prop="telephone">
          <Tooltip content="项目联系方式可以是手机或者邮箱" style="width: 100%;" placement="right-start">
            <AutoComplete v-model="projectMes.telephone" :data="phone"></AutoComplete>
          </Tooltip>
        </FormItem>
        <!--        <FormItem label="申请人类型" prop="userType">-->
        <!--          <CheckboxGroup v-model="projectMes.userType" :value="projectMes.userType">-->
        <!--            <Checkbox label="1">-->
        <!--              <span style="font-size: 15px">本科生</span>-->
        <!--            </Checkbox>-->
        <!--            <Checkbox label="2">-->
        <!--              <span style="font-size: 15px">研究生</span>-->
        <!--            </Checkbox>-->
        <!--            <Checkbox label="3">-->
        <!--              <span style="font-size: 15px">博士生</span>-->
        <!--            </Checkbox>-->
        <!--            <Checkbox label="4">-->
        <!--              <span style="font-size: 15px">计算机学生</span>-->
        <!--            </Checkbox>-->
        <!--          </CheckboxGroup>-->
        <!--        </FormItem>-->
        <FormItem label="项目描述" prop="description">
          <i-input type="textarea" v-model="projectMes.description" :rows="4" placeholder="请输入项目描述..."></i-input>
        </FormItem>
        <FormItem label="申报时间" prop="applicationTime">
          <Date-picker :value="projectMes.applicationTime" format="yyyy年MM月dd日 HH:mm" type="datetimerange"
                       v-model="projectMes.applicationTime"
                       @on-change="onChange"
                       placement="bottom-end" placeholder="选择申报时间段"
                       style="width: 300px"></Date-picker>
        </FormItem>
        <FormItem label="截止时间" prop="projectEndTime">
          <DatePicker type="datetime" :value="projectMes.projectEndTime" v-model="projectMes.projectEndTime"
                      format="yyyy年MM月dd日 HH:mm" style="width: 300px"
                      placeholder="选择项目截止时间"></DatePicker>
        </FormItem>
        <FormItem label="经费额度" prop="maxMoney">
          <Input-number v-model="projectMes.maxMoney"
                        :value="projectMes.maxMoney"></Input-number>
        </FormItem>
        <FormItem label="添加项目说明(包含申报书、模板等)" prop="uploadAddress">
          <Upload
            type="drag"
            :headers="uploadHeaders"
            :on-success="uploadSuccess1"
            ref="upload1"
            action="http://10.10.0.29/api/file/upload">
            <div style="padding: 20px 0">
              <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
              <p>点击或将文件拖拽到这里上传</p>
            </div>
          </Upload>
        </FormItem>
        <FormItem label="添加任务书模板" prop="missionAddress">
          <Upload
            type="drag"
            :headers="uploadHeaders"
            :on-success="uploadSuccess2"
            ref="upload2"
            action="http://10.10.0.29/api/file/upload">
            <div style="padding: 20px 0">
              <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
              <p>点击或将文件拖拽到这里上传</p>
            </div>
          </Upload>
        </FormItem>
      </Form>
      <Button class="button" type="primary" size="large" @click.native="handleButton">提交</Button>
    </div>
  </div>
</template>

<script>
  import axios from 'axios'

  export default {
    name: "newCategory",
    data() {
      return {
        phone: [],
        ruleProjectMes: {
          projectName: [
            {required: true, message: '项目名称不能为空', trigger: 'blur'}
          ],
          projectType: [
            {required: true, type: 'number', message: '项目类型不能为空', trigger: 'blur'}
          ],
          isMeeting: [
            {required: true, type: 'boolean', message: '请选择是否上会', trigger: 'blur'}
          ],
          telephone: [
            {required: true, message: '联系方式不能为空', trigger: 'blur'}
          ],
          userType: [
            {required: true, type: 'array', message: '请选择申请人类型', trigger: 'blur'}
          ],
          description: [
            {required: true, message: '请填写项目描述', trigger: 'blur'}
          ],
          applicationTime: [
            {
              required: true,
              type: 'array',
              message: '请选择申报时间',
              trigger: 'blur',
              validator(rule, value, callback, source, options) {
                if (!Array.isArray(value)) {                      //自定义验证：首先验证applicationTime是否是一个数组，如果不是输入则返回错误
                  callback(new Error('请选择申报时间'));
                }
                if (value.length !== 2 || !value.every((x) => x instanceof Date)) { //经历上面判断是否为数组后，接下来判断数组的长度是否为2，或者它其中每个元素的是否为Date的一个实例，这里用instanceof来判断
                  callback(new Error('请选择申报时间'));
                }
                callback();
              }
            }
          ],
          projectEndTime: [
            {required: true, type: 'date', message: '请选择截止时间', trigger: 'blur'}
          ],
          maxMoney: [
            {required: true, type: 'number', message: '请填写经费额度', trigger: 'blur'}
          ],
          uploadAddress: [
            {required: true, message: '请上传申请书模板', trigger: 'blur'}
          ],
          missionAddress: [
            {required: true, message: '请上传任务书模板', trigger: 'blur'}
          ]
        },
        uploadHeaders: {
          Authorization: localStorage.getItem('token')
        },
        projectMes: {
          projectName: '',
          projectType: null,
          isMeeting: false,
          telephone: '',
          userType: [],
          description: '',
          applicationTime: null,
          projectEndTime: null,
          maxMoney: null,
          uploadAddress: '',
          missionAddress: ''
        },
        projectTypeList: [
          {
            index: 1,
            label: '信息化开放课题(仅老师)'
          },
          {
            index: 2,
            label: '信息技术研究项目(仅学生)'
          }
        ],
      }
    },
    mounted() {
      this.getPhone()
    },
    methods: {
      getPhone() {
        axios({
          url: apiRoot + '/user/userInfo/1',
          method: 'get'
        }).then((res) => {
          if (res.data.code === 'SUCCESS') {
            this.phone.push(res.data.data.phone)
            this.phone.push(res.data.data.mail)
          }
        })
      },
      onChange() {
        console.log(this.projectMes.applicationTime[0], this.projectMes.applicationTime[1])
      },
      handleButton() {
        this.$refs['projectMes'].validate((valid) => {
          if (valid) {
            this.$Modal.confirm({
              title: '确认提交吗？',
              content: '请在提交前再次检查表单内容的正确性',
              okText: '确认提交',
              cancelText: '再看看',
              onOk: () => {
                this.newCategory()
              },
              onCancel: () => {
              }
            });
          } else {
            this.$Message.error('请将有关字段补充完整！');
          }
        })
      },
      uploadSuccess1(response) {
        this.projectMes.uploadAddress = response.data;
        this.$Message.success("上传成功！");
      },
      uploadSuccess2(response) {
        this.projectMes.missionAddress = response.data;
        this.$Message.success("上传成功！");
      },
      newCategory() {
        this.projectMes.userType.push(this.projectMes.projectType)
        axios({
          url: apiRoot + '/admin/createProjectCategory',
          method: 'post',
          data: {
            projectName: this.projectMes.projectName,
            projectDescription: this.projectMes.description,
            projectType: this.projectMes.projectType,
            principalPhone: this.projectMes.telephone,
            applicantType: this.projectMes.userType,  //这里申请人类型和项目类型相同,只不过申请人类型是一个数组
            maxMoney: this.projectMes.maxMoney,
            projectApplicationDownloadAddress: apiRoot + '/file/download?fileAddress=' + this.projectMes.uploadAddress,
            projectIndex: apiRoot + '/file/download?fileAddress=' + this.projectMes.missionAddress,
            isExistMeetingReview: this.projectMes.isMeeting,
            applicationStartTime: this.projectMes.applicationTime[0].Format("yyyy-MM-dd hh:mm"),
            applicationEndTime: this.projectMes.applicationTime[1].Format("yyyy-MM-dd hh:mm"),
            projectStartTime: this.projectMes.applicationTime[1].Format("yyyy-MM-dd hh:mm"),
            projectEndTime: this.projectMes.projectEndTime.Format("yyyy-MM-dd hh:mm"),
          }
        }).then((res) => {
          if (res.data.code === 'SUCCESS') {
            this.$Notice.success({
              title: '新增成功',
              desc: '您已成功新增一个项目类别，现在您可以在“项目类别管理-已开通类别”中查看已有项目，并且可对其进行修改和删除。',
              duration: 7
            });
            this.$refs['projectMes'].resetFields();
            this.$refs.upload1.clearFiles();
            this.$refs.upload2.clearFiles();
          } else {
            this.$Message.error(res.data.message)
          }
        }).catch(() => {
          this.$Message.error('请检查网络连接！')
        })
      }
    }
  }
</script>

<style scoped lang="scss">
  @import "newCategory";
</style>
<style lang="scss">
  .ivu-form .ivu-form-item-label {
    font-size: 15px;
  }

  .ivu-select-selection {
    .ivu-select-selected-value {
      color: #515a6e !important
    }
  }
</style>
