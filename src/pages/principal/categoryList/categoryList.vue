<template>
  <div class="wrapper">
    <ButtonGroup class="operation">
      <Button type="success" icon="md-refresh" @click="Refresh" size="large" ghost>
        刷新
      </Button>

    </ButtonGroup>
    <Table stripe border :columns="columns" :loading="loading" :data="data1" class="table" size="large"
           height="750"></Table>
    <Modal v-if="modal1_delay" v-model="modal1" :title="infoTitle" width="600px">
      <p>项目描述：{{data1[index].projectDescription}}</p>
      <br>
      <p>业务员手机：{{data1[index].principalPhone}}</p>
      <br>
      <p>项目大类：{{data1[index].projectType}}</p>
      <br>
      <p>经费额度：{{data1[index].maxMoney}}元</p>
      <br>
      申报人类型：<p style="display: inline-flex;" v-for="item in data1[index].applicantType">{{item}}&nbsp;</p>
      <br>
      <br>
      <p>是否上会：{{(data1[index].isExistMeetingReview===1?'是':'否')}}</p>
      <br>
      <p>是否可提交中期报告：{{(data1[index].interimReport.isReportActivated===true)?'是':'否 '}}<a
        v-if="!data1[index].interimReport.isReportActivated" @click="openInterimReport(index)">点击开通</a></p>
      <br v-if="data1[index].interimReport.isReportActivated">
      <p v-if="data1[index].interimReport.isReportActivated">中期报告开始时间：{{data1[index].interimReport.startTime}}</p>
      <br v-if="data1[index].interimReport.isReportActivated">
      <p v-if="data1[index].interimReport.isReportActivated">中期报告截止时间：{{data1[index].interimReport.deadline}}</p>
      <br>
      <p>是否可提交结题报告：{{(data1[index].concludingReport.isReportActivated===true)?'是':'否 '}}<a
        v-if="!data1[index].concludingReport.isReportActivated" @click="openConcludingReport(index)">点击开通</a></p>
      <br v-if="data1[index].concludingReport.isReportActivated">
      <p v-if="data1[index].concludingReport.isReportActivated">结题报告开始时间：{{data1[index].concludingReport.startTime}}</p>
      <br v-if="data1[index].concludingReport.isReportActivated">
      <p v-if="data1[index].concludingReport.isReportActivated">结题报告截止时间：{{data1[index].concludingReport.deadline}}</p>
    </Modal>
    <Modal v-model="modal3" title="开通提交中期报告" @on-ok="ok1(index)" @on-cancel="cancel1(index)" :z-index="1000">
      <Form ref="interimReport" :model="interimReport" :rules="interimReportRule">
        <FormItem label="中期报告开始时间" prop="startTime">
          <DatePicker type="datetime" :value="interimReport.startTime" v-model="interimReport.startTime"
                      format="yyyy年MM月dd日 HH:mm" style="width: 300px"
                      :options="options1"
                      @on-change="setInterimReportStartTime(index,...arguments)"
                      placeholder="选择开始时间"></DatePicker>
        </FormItem>
        <FormItem label="中期报告截止时间" prop="startTime">
          <DatePicker type="datetime" :value="interimReport.endTime" v-model="interimReport.endTime"
                      format="yyyy年MM月dd日 HH:mm" style="width: 300px"
                      :options="options2"
                      @on-change="setInterimReportEndTime(index,...arguments)"
                      placeholder="选择截止时间"></DatePicker>
        </FormItem>
        <FormItem label="上传模板" prop="uploadAddress">
          <Upload
            type="drag"
            :headers="uploadHeaders"
            :on-success="uploadSuccess1"
            ref="upload"
            action="https://pm.alphalrx.cn/api/file/upload">
            <div style="padding: 20px 0">
              <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
              <p>点击或将文件拖拽到这里上传</p>
            </div>
          </Upload>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="text" @click.native="cancel1(index)"
                style="">
          取消
        </Button>
        <Button type="primary" @click.native="ok1(index)"
                style="">
          确定
        </Button>
      </div>
    </Modal>
    <Modal v-model="modal4" title="开通提交结题报告" @on-ok="ok2(index)" @on-cancel="cancel2(index)" :z-index="1000">
      <Form ref="concludingReport" :model="concludingReport" :rules="concludingReportRule">
        <FormItem label="结题报告开始时间" prop="startTime">
          <DatePicker type="datetime" :value="concludingReport.startTime" v-model="concludingReport.startTime"
                      format="yyyy年MM月dd日 HH:mm" style="width: 300px"
                      :options="options3"
                      @on-change="setConcludingReportStartTime(index,...arguments)"
                      placeholder="选择开始时间"></DatePicker>
        </FormItem>
        <FormItem label="结题报告截止时间" prop="startTime">
          <DatePicker type="datetime" :value="concludingReport.endTime" v-model="concludingReport.endTime"
                      format="yyyy年MM月dd日 HH:mm" style="width: 300px"
                      :options="options4"
                      placeholder="选择截止时间"></DatePicker>
        </FormItem>
        <FormItem label="上传模板" prop="uploadAddress">
          <Upload
            type="drag"
            :headers="uploadHeaders"
            :on-success="uploadSuccess2"
            ref="upload"
            action="https://pm.alphalrx.cn/api/file/upload">
            <div style="padding: 20px 0">
              <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
              <p>点击或将文件拖拽到这里上传</p>
            </div>
          </Upload>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="text" @click.native="cancel2(index)"
                style="">
          取消
        </Button>
        <Button type="primary" @click.native="ok2(index)"
                style="">
          确定
        </Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  import axios from 'axios'


  export default {
    name: "categoryList",
    watch: {
      modal1(val) {
        if (val) {
          this.modal1_delay = true;
        }
      }
    },
    data() {
      return {
        modal1_delay: false,
        loading: false,
        modal1: false,
        modal3: false,
        modal4: false,
        infoTitle: null,
        index: 0,
        applicationEndTime: [],
        interimReportStartTime: [],
        interimReportEndTime: [],
        concludingReportStartTime: [],
        projectEndTime: [],
        options1: {
          disabledDate: date => {         //这里使用箭头函数是因为这样才能指向vue对象，也就是说使用this.applicationEndTime才不会报错
            if ((date.valueOf() < this.applicationEndTime[this.index]) || (date.valueOf() > this.projectEndTime[this.index])) {
              return true;
            } else {
              return false;
            }
          }
        },
        options2: {
          disabledDate: date => {
            if ((date.valueOf() <= this.interimReportStartTime[this.index]) || (date.valueOf() > this.projectEndTime[this.index])) {
              return true;
            } else {
              return false;
            }
          }
        },
        options3: {
          disabledDate: date => {
            if ((date.valueOf() < this.interimReportEndTime[this.index]) || (date.valueOf() > this.projectEndTime[this.index])) {
              return true;
            } else {
              return false;
            }
          }
        },
        options4: {
          disabledDate: date => {
            if ((date.valueOf() <= this.concludingReportStartTime[this.index]) || (date.valueOf() > this.projectEndTime[this.index])) {
              return true;
            } else {
              return false;
            }
          }
        },
        interimReport: {
          startTime: '',
          endTime: '',
          uploadAddress: ''
        },
        concludingReport: {
          startTime: '',
          endTime: '',
          uploadAddress: ''
        },
        interimReportRule: {
          startTime: [
            {required: true, type: 'date', message: '请选择开始时间', trigger: 'blur'}
          ],
          endTime: [
            {required: true, type: 'date', message: '请选择截止时间', trigger: 'blur'}
          ],
          uploadAddress: [
            {required: true, message: '请上传模板', trigger: 'blur'}
          ]
        },
        concludingReportRule: {
          startTime: [
            {required: true, type: 'date', message: '请选择开始时间', trigger: 'blur'}
          ],
          endTime: [
            {required: true, type: 'date', message: '请选择截止时间', trigger: 'blur'}
          ],
          uploadAddress: [
            {required: true, message: '请上传模板', trigger: 'blur'}
          ]
        },
        uploadHeaders: {
          Authorization: localStorage.getItem('token')
        },
        data1: [],
        columns: [
          {
            title: '项目名称',
            key: 'projectName',
            align: 'center'
          },
          {
            title: '项目简介',
            key: 'projectDescription',
            align: 'center',
            tooltip: true
          },
          {
            title: '项目类别',
            key: 'projectType',
            align: 'center'
          },
          {
            title: '申报开始时间',
            key: 'applicationStartTime',
            align: 'center'
          },
          {
            title: '申报截止时间',
            key: 'applicationEndTime',
            align: 'center'
          },
          {
            title: '项目开始时间',
            key: 'projectStartTime',
            align: 'center'
          },
          {
            title: '项目截止时间',
            key: 'projectEndTime',
            align: 'center'
          },
          {
            title: '操作',
            key: 'operation',
            width: 300,
            align: 'center',
            render: (h, params) => {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'success'
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.$Message.info("点击修改")
                    }
                  }
                }, '修改'),
                h('Button', {
                  props: {
                    type: 'info'
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.infoTitle = this.data1[params.index].projectName + ' 详情'
                      this.index = params.index
                      console.log(this.index)
                      this.modal1 = true
                    }
                  }
                }, '详情'),
                h('Button', {
                  props: {
                    type: 'error'
                  },
                  on: {
                    click: () => {
                      this.$Modal.confirm({
                        title: '请再次确认',
                        content: '确认删除 ' + this.data1[params.index].projectName + ' 吗?',
                        okText: '确定',
                        cancelText: '点错了',
                        onOk: () => {
                          axios({
                            url: apiRoot + '/admin/deleteProjectCategory',
                            method: 'post',
                            data: {
                              projectCategoryId: this.data1[params.index].projectCategoryId
                            }
                          }).then((res) => {
                            if (res.data.code === 'SUCCESS') {
                              this.data1.splice(params.index, 1);
                              this.$Message.success("删除成功！")
                            } else {
                              this.$Message.error(res.data.message)
                            }
                          })
                        }
                      })
                    }
                  }
                }, '删除')
              ])
            }
          }
        ]
      }
    },
    mounted() {
      this.initData('初始化成功！');
    },
    methods: {
      Refresh() {
        this.initData("刷新成功！")
      },
      initData(msg) {
        this.loading = true
        axios({
          url: apiRoot + '/admin/findMyProjectCategory',
          method: 'get'
        }).then((res) => {
          if (res.data.code === 'SUCCESS') {
            console.log(res.data)
            this.data1 = res.data.data
            for (let i = 0; i < res.data.data.length; i++) {       //将申请截止时间由string变成date
              if (res.data.data[i].applicationEndTime) {
                var arr1 = res.data.data[i].applicationEndTime.split(" ");
                var sdate = arr1[0].split('-');
                var date = new Date(sdate[0], sdate[1] - 1, sdate[2]);
                this.applicationEndTime[i] = date
              }
            }
            for (let i = 0; i < res.data.data.length; i++) {      //将项目截止时间由string变成date
              if (res.data.data[i].projectEndTime) {
                var arr1 = res.data.data[i].projectEndTime.split(" ");
                var sdate = arr1[0].split('-');
                var date = new Date(sdate[0], sdate[1] - 1, sdate[2]);
                this.projectEndTime[i] = date
              }
            }
            console.log(this.applicationEndTime)
            this.$Message.success(msg)
            this.loading = false
          } else {
            this.$Message.warnings(res.data.message)
            this.loading = false
          }
        }).catch((err) => {
          console.error(err)
          this.$Message.error("请检查网络连接！")
          this.loading = false
        })
      },
      openInterimReport(index) {
        this.modal3 = true
        this.index = index
      },
      openConcludingReport(index) {
        console.log(this.interimReportEndTime)
        if (this.data1[index].interimReport.deadline || this.interimReportEndTime[index]) { //判断中期报告是否已经开通，否则不准开通结题报告
          this.modal4 = true;
          this.index = index;
        } else {
          this.$Message.warning("请先开通中期报告！")
        }
      },
      uploadSuccess1(response) {
        this.interimReport.uploadAddress = response.data
        this.$Message.success("上传成功！");
        console.log('uploadAddress:', this.interimReport.uploadAddress)
      },
      uploadSuccess2(response) {
        this.concludingReport.uploadAddress = response.data
        this.$Message.success("上传成功！");
        console.log('uploadAddress:', this.concludingReport.uploadAddress)
      },
      ok1(index) {
        this.$refs['interimReport'].validate((valid) => {
          if (valid) {
            axios({
              url: apiRoot + '/admin/createReport',
              method: 'post',
              data: {
                projectCategoryId: this.data1[index].projectCategoryId,
                type: 1,
                reportAddress: this.interimReport.uploadAddress,
                startTime: this.interimReport.startTime.Format("yyyy-MM-dd hh:mm"),
                deadline: this.interimReport.endTime.Format("yyyy-MM-dd hh:mm")
              }
            }).then((res) => {
              if (res.data.code === 'SUCCESS') {
                this.data1[index].interimReport.isReportActivated = true;
                //TODO startTime deadline undifined??
                this.data1[index].interimReport.startTime = res.data.startTime;
                this.data1[index].interimReport.deadline = res.data.endTime;
                this.$forceUpdate()
                this.$Message.success('开通中期报告成功！');
                console.log(this.data1[index].interimReport)
                this.$refs['interimReport'].resetFields()
                this.modal3 = false;
              } else {
                this.$Message.error('开通失败！')
              }
            })
          } else {
            this.$Message.error('请将有关字段补充完整！');
          }
        })
      },
      cancel1() {
        this.modal3 = false
        this.$refs['interimReport'].resetFields()
      },
      ok2(index) {
        this.$refs['concludingReport'].validate((valid) => {
          if (valid) {
            axios({
              url: apiRoot + '/admin/createReport',
              method: 'post',
              data: {
                projectCategoryId: this.data1[index].projectCategoryId,
                type: 2,
                reportAddress: this.concludingReport.uploadAddress,
                startTime: this.concludingReport.startTime.Format("yyyy-MM-dd hh:mm"),
                deadline: this.concludingReport.endTime.Format("yyyy-MM-dd hh:mm")
              }
            }).then((res) => {
              if (res.data.code === 'SUCCESS') {
                this.data1[index].concludingReport.isReportActivated = true;
                //TODO startTime deadline undifined??
                this.data1[index].concludingReport.startTime = res.data.startTime;
                this.data1[index].concludingReport.deadline = res.data.endTime;
                this.$Message.success('开通结题报告成功！');
                this.$refs['concludingReport'].resetFields()
                this.modal4 = false;
                // setTimeout(() => {
                //   window.location.reload()
                // }, 1000)
              } else {
                this.$Message.error('开通失败！')
              }
            })
          } else {
            this.$Message.error('请将有关字段补充完整！');
          }
        })
      },
      cancel2() {
        this.modal4 = false
        this.$refs['concludingReport'].resetFields()
      },
      setInterimReportStartTime(index, date, type) {
        if (date) {       //将格式化的时间变成标准date格式
          date = date.replace('年', '-');
          date = date.replace('月', '-');
          date = date.replace('日', '');
          var arr1 = date.split(" ");
          var sdate = arr1[0].split('-');
          var newdate = new Date(sdate[0], sdate[1] - 1, sdate[2]);
        }
        this.interimReportStartTime[index] = newdate
        console.log('1', newdate)
      },
      setInterimReportEndTime(index, date, type) {
        if (date) {       //将格式化的时间变成标准date格式
          date = date.replace('年', '-');
          date = date.replace('月', '-');
          date = date.replace('日', '');
          var arr1 = date.split(" ");
          var sdate = arr1[0].split('-');
          var newdate1 = new Date(sdate[0], sdate[1] - 1, sdate[2]);
        }
        this.interimReportEndTime[index] = newdate1;
      },
      setConcludingReportStartTime(index, date, type) {
        if (date) {       //将格式化的时间变成标准date格式
          date = date.replace('年', '-');
          date = date.replace('月', '-');
          date = date.replace('日', '');
          var arr1 = date.split(" ");
          var sdate = arr1[0].split('-');
          var newdate = new Date(sdate[0], sdate[1] - 1, sdate[2]);
        }
        this.concludingReportStartTime[index] = newdate
      }
    }
  }
</script>

<style scoped lang="scss">
  @import "categoryList";
</style>
