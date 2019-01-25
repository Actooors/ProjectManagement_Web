<template>
  <div class="wrapper">
    <ButtonGroup class="operation">
      <Button type="success" icon="md-refresh" @click="Refresh" size="large" ghost>
        刷新
      </Button>
    </ButtonGroup>
    <Table stripe border :columns="columns" :loading="loading" :data="data1" class="table" size="large"
           height="750"></Table>
    <Modal v-model="modal1" title="项目任务书" @on-ok="commitTask(index)"
           @on-cancel="cancelCommit" width="900">
      <p>项目描述：{{data3.projectDescription}}</p>
      <br>
      <p>业务员手机：{{data3.principalPhone}}</p>
      <br>
      <p>项目大类：{{data3.projectType}}</p>
      <br>
      <p>经费额度：{{data3.maxMoney}}元</p>
      <br>
      申报人类型：<p style="display: inline-flex;" v-for="item in data3.applicantType">{{item}}&nbsp;</p>
      <br>
      <br>
      专家名单：<p style="display: inline-flex;" v-for="item in data2.expertList">{{item.userName}}&nbsp;</p>
      <br>
      <br>
      <p>项目成员(默认第一个为项目负责人)：</p>
      <Table :columns="columns2" :data="data2.members" size="small" stripe></Table>
      <br>
      <p>项目申请书：<a @click="downloadProjectMaterial(data2.applicationAddress)">点击下载</a></p>
      <br>
      <p v-if="data2.interimAddress===null">项目中期报告：未提交</p>
      <p v-if="data2.interimAddress!==null">项目中期报告：<a @click="downloadProjectMaterial(data2.interimAddress)">点击下载</a>
      </p>
      <br>
      <p v-if="data2.concludingAddress===null">项目结题报告：未提交</p>
      <p v-if="data2.concludingAddress!==null">项目结题报告：<a
        @click="downloadProjectMaterial(data2.concludingAddress)">点击下载</a></p>
      <br>
      <Form ref="targetValidate" :label-width="70" :model="targetValidate" :rules="targetRules">
        <FormItem label="项目指标" prop="target">
          <Tooltip max-width="300" style="width: 100%" placement="top" content="项目指标是指此项目最终预期的完成情况，或是此项目的目标，亦或是项目愿景。">
            <Input v-model="targetValidate.target" type="textarea" :autosize="{minRows: 2,maxRows: 5}"
                   placeholder="请输入项目指标"></Input>
          </Tooltip>
        </FormItem>
      </Form>
      <p style="font-size: 14px;margin-bottom: 15px">请问您对项目经费有修改意见吗？(修改可能会被业务员驳回)&nbsp;
        <Switch v-model="isModify">
          <span slot="open">有</span>
          <span slot="close">无</span>
        </Switch>
      </p>
      <p v-show="isModify" style="font-size: 14px">请输入修改后的经费：
        <InputNumber v-model="modifiedMoney"></InputNumber>
        元
      </p>
    </Modal>
  </div>
</template>

<script>
  import axios from 'axios'
  import download from '../../../assets/js/download'

  export default {
    name: "reqProject",
    data() {
      return {
        loading: false,
        modal1: false,
        isModify: false,
        index: null,
        modifiedMoney: null,
        columns: [
          {
            title: '项目名称',
            key: 'projectName',
            align: 'center',
            width: 250,
          },
          {
            title: '项目申报日期',
            key: 'time',
            align: 'center',
            width: 200,
          },
          {
            title: '项目简介',
            key: 'description',
            align: 'center'
          },
          {
            title: '项目状态',
            key: 'reviewPhase',
            width: 200,
            align: 'center'
          },
          {
            title: '操作',
            key: 'operation',
            align: 'center',
            width: 250,
            render: (h, params) => {
              // return (
              //   <div>
              //   {(params.row.reviewPhase==='任务书阶段')?<div style="display:inline"><Button type="error" style="margin-right:5px" onClick={()=>{this.cancelConfirm(params.index)}}>取消</Button><Button onClick={()=>{this.fillInTask(params.index)}}>填写任务书</Button></div>:<Button onClick={()=>{this.cancelConfirm(params.index)}}>取消</Button>}
              //   </div>
              // )
              return h('div', [
                h('Button', {
                  props: {
                    type: 'primary'
                  },
                  style: {
                    display: (params.row.reviewPhase === "待提交任务书阶段") ? "" : "none",
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.fillInTask(params.index)
                    }
                  }
                }, '任务书'),
                h('Button', {
                  props: {
                    type: 'error'
                  },
                  on: {
                    click: () => {
                      this.cancelConfirm(params.index);
                    }
                  }
                }, '取消')
              ])
            }
          }
        ],
        columns2: [
          {
            title: '姓名',
            key: 'userName',
            align: 'center'
          },
          {
            title: '学号',
            key: 'userId',
            align: 'center'
          },
          {
            title: '学院',
            key: 'department',
            align: 'center'
          },
          {
            title: '电话',
            key: 'phone',
            align: 'center'
          },
          {
            title: '邮箱',
            key: 'mail',
            align: 'center'
          }
        ],
        data1: [],
        data2: [],
        data3: [],
        targetValidate: {
          target: ''
        },
        targetRules: {
          target: [
            {required: true, message: '项目指标不能为空', trigger: 'blur'}
          ],
        }
      }
    },
    mounted() {
      this.initData('初始化成功！');
    },
    methods: {
      Refresh() {
        this.initData('刷新成功!');
      },
      initData(msg) {
        this.loading = true
        axios({
          url: apiRoot + '/user/inTheApplicationList',
          method: 'get'
        }).then((res) => {
          if (res.data.code === 'SUCCESS') {
            console.log(res.data)
            this.data1 = res.data.data;
            this.$Message.success(msg)
            this.loading = false
          } else {
            this.$Message.warning(res.data.message)
            this.loading = false
          }
        }).catch(() => {
          this.$Message.error('请检查网络连接！')
          this.loading = false
        })
      },
      cancelConfirm(index) {
        this.$Modal.confirm({
          title: '确认取消该项目吗？',
          content: '<p>若撤销该项目后，则需要重新申报。</p>',
          okText: '确认',
          cancelText: '点错了',
          onOk: () => {
            this.projectCancel(index)
          },
          onCancel: () => {
          }
        });
      },
      projectCancel(index) {
        axios({
          url: apiRoot + '/user/deleteApplication',
          method: 'post',
          data: {
            applicationId: this.data1[index].projectApplicationId,
            applicationName: this.data1[index].projectName
          }
        }).then((res) => {
          if (res.data.code === 'SUCCESS') {
            this.$Message.success('取消成功!');
            this.data1.splice(index, 1);
          } else {
            this.$Message.error('取消失败!');
          }
        }).catch(() => {
          this.$Message.error('取消失败,请检查网络连接!');
        })
      },
      async fillInTask(index) {
        const a = axios({
          url: apiRoot + '/admin/category/' + this.data1[index].projectCategoryId,
          method: 'get'
        }).then((res) => {
          if (res.data.code === 'SUCCESS') {
            this.data3 = res.data.data
          }
        })
        const b = axios({
          url: apiRoot + '/user/projectMoreInfo?applicationId=' + this.data1[index].projectApplicationId,
          method: 'get'
        }).then((res) => {
          if (res.data.code === 'SUCCESS') {
            this.data2 = res.data.data
          }
        })
        // await Promise.all([a, b]);
        this.modal1 = true
        this.index = index
      },
      downloadProjectMaterial(address) {
        console.log(address, '!')
        const that = this
        var filename = address.split('---')[1]
        axios({
          url: address,
          method: 'get',
          headers: {Authorization: localStorage.getItem('token')},
          responseType: 'blob'
        }).then((res) => {
          if (res.status === 200) {
            download(res.data, filename, 'text/plain');
            this.$Message.success('下载成功！');
          } else {
            this.$Message.error('下载失败！');
          }
        }).catch(() => {
          this.$Message.error('下载失败，请检查网络连接！')
        })
      },
      commitTask(index) {
        this.$refs["targetValidate"].validate((valid) => {
          if (valid) {
            //TODO
          } else {
            this.$Message.warning("请输入项目指标")
          }
        })
      },
      cancelCommit() {
        this.$ref["targetValidate"].resetFields();
      }
    }
  }
</script>

<style scoped lang="scss">
  @import "reqProject";
</style>
