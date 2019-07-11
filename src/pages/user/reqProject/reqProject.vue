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
      <p v-if="data2.projectIndex===null">项目指标模板：未上传</p>
      <p v-if="data2.projectIndex!==null">项目结题报告：<a
        @click="downloadProjectMaterial(data2.projectIndex)">点击下载</a></p>
      <br>
      <Form ref="targetValidate" :label-width="90" :model="targetValidate" :rules="targetRules">
        <FormItem label="项目指标" prop="target">
          <Tooltip max-width="300" style="width: 100%" placement="top" content="项目指标是指此项目最终预期的完成情况，或是此项目的目标，亦或是项目愿景。">
            <!--            <Input v-model="targetValidate.target" type="textarea" :autosize="{minRows: 2,maxRows: 5}"-->
            <!--                   placeholder="请输入项目指标"></Input>-->
            <Upload
              type="drag"
              :headers="uploadHeaders"
              :on-success="uploadSuccess"
              ref="upload"
              action="http://itproject.shu.edu.cn/api/file/upload">
              <div style="padding: 20px 0">
                <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
                <p>点击或将文件拖拽到这里上传</p>
              </div>
            </Upload>
          </Tooltip>
        </FormItem>
      </Form>
<!--      <p style="font-size: 14px;margin-bottom: 15px;font-weight: bold">-->
<!--        经审核，业务员将您申请的项目经费修改为：{{data2.projectMoney}}&nbsp;元</p>-->
<!--      <p style="font-size: 14px;margin-bottom: 15px">请问您对项目经费有修改意见吗？(修改可能会被业务员驳回)&nbsp;-->
<!--        <Switch v-model="isModify" @on-change="changeSwitch">-->
<!--          <span slot="open">有</span>-->
<!--          <span slot="close">无</span>-->
<!--        </Switch>-->
<!--      </p>-->
<!--      <p v-show="isModify" style="font-size: 14px">请输入修改后的经费：-->
<!--        <InputNumber :min="0" v-model="modifiedMoney"></InputNumber>-->
<!--        元-->
<!--      </p>-->
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
        uploadHeaders: {
          Authorization: localStorage.getItem('token')
        },
        columns: [
          {
            title: '项目名称',
            key: 'projectName',
            align: 'center',
          },
          {
            title: '项目类别',
            key: 'type',
            align: 'center'
          },
          {
            title: '项目申报日期',
            key: 'time',
            align: 'center',
          },
          {
            title: '项目简介',
            key: 'description',
            align: 'center',
            tooltip: true
          },
          {
            title: '项目状态',
            key: 'reviewPhase',
            align: 'center',
            filters: [
              {
                label: '业务员审核阶段',
                value: 1
              },
              {
                label: '评审专家审核阶段',
                value: 2
              },
              {
                label: '待会评阶段',
                value: 3
              },
              {
                label: '领导审核阶段',
                value: 4
              },
              {
                label: '待提交任务书阶段',
                value: 5
              },
              {
                label: '任务书审核阶段',
                value: 6
              }
            ],
            filterMultiple: true,
            filterMethod(value, row) {
              switch (value) {
                case 1:
                  return row.reviewPhase === '业务员审核阶段';
                  break;
                case 2:
                  return row.reviewPhase === '评审专家审核阶段';
                  break;
                case 3:
                  return row.reviewPhase === '会评阶段';
                  break;
                case 4:
                  return row.reviewPhase === '领导审核阶段';
                  break;
                case 5:
                  return row.reviewPhase === '待提交任务书阶段';
                  break;
                case 6:
                  return row.reviewPhase === '任务书审核阶段'
              }
            }
          },
          {
            title: '操作',
            key: 'operation',
            align: 'center',
            width: 250,
            render: (h, params) => {
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
            {required: true, message: '请上传项目指标', trigger: 'blur'}
          ],
        }
      };
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
          url: apiRoot + '/admin/category/' + this.data1[index].projectCategoryId.toString(),
          method: 'get'
        }).then((res) => {
          if (res.data.code === 'SUCCESS') {
            this.data3 = res.data.data
          }
        })
        const b = axios({
          url: apiRoot + '/user/projectMoreInfo?applicationId=' + this.data1[index].projectApplicationId.toString(),
          method: 'get'
        }).then((res) => {
          if (res.data.code === 'SUCCESS') {
            this.data2 = res.data.data
          }
        })
        await Promise.all([a, b]);
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
            axios({
              url: apiRoot + '/user/commitTaskManual',
              method: 'post',
              data: {
                projectApplicationId: this.data1[index].projectApplicationId,
                projectIndex: this.targetValidate.target,
              }
            }).then((res) => {
              if (res.data.code === 'SUCCESS') {
                this.data1.splice(index, 1);
                this.targetValidate.target = null
                this.modifiedMoney = null
                this.modal1 = false;
                this.$Message.success("任务书提交成功！");
              } else {
                this.$Message.error(res.data.message)
              }
            }).catch(() => {
              this.$Message.error("提交失败，请检查网络连接！")
            })
          } else {
            this.$Message.warning("请输入项目指标")
          }
        })
      },
      cancelCommit() {
        this.$ref["targetValidate"].resetFields();
      },
      changeSwitch(flag) {
        if (flag === false) {
          this.modifiedMoney = null
        }
      },
      uploadSuccess(response) {
        this.targetValidate.target = response.data
        this.$Message.success("上传成功！");
      }
    }
  }
</script>

<style scoped lang="scss">
  @import "reqProject";
</style>
