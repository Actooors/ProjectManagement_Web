<template>
  <div class="wrapper">
    <ButtonGroup class="operation">
      <Button type="success" icon="md-refresh" @click="Refresh" size="large" ghost>
        刷新
      </Button>
    </ButtonGroup>
    <Table stripe border class="table" :columns="columns1" :data="data1" size="large"></Table>
    <Modal
      v-model="model1"
      title="驳回理由"
      width="700"
      maxHeight="800"
      :mask-closable="false"
      ref="modal"
      @on-cancel="cancel">
      <Form :model="formItem" :label-width="180" style="margin-right: 25px">
        <div class="from_middle">
          <p data-v-2526d47e="" style="font-size: 12px; font-weight: bold; color: rgb(70, 76, 91);">评审内容填写</p>
          <Input v-model="formItem.textarea" type="textarea" :autosize="{minRows: 4,maxRows: 10}"
                 placeholder="请填写驳回理由（申请者可以重新修改）"></Input>
        </div>
      </Form>
      <div slot="footer">
        <Button type="primary" @click.native="finish"
                style="margin-top: 20px;margin-left: 20px;width:100px">
          完成
        </Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  import axios from 'axios'
    export default {
        name: "fourEx",

    data() {
      return {
        loading: false,
        model1: false,
        value1: 1,
        priority:'',
        formItem: {
          textarea: '填写评审内容'
        },
        allSuccess: false,
        columns1: [
          {
            title: '项目名称',
            key: 'projectName',
            align: 'center',
          },
          {
            title: '下载报告',
            key: 'downloadReport',
            align: 'center',
            render: (h, params) => {
              return h('div', [h('Button', {
                props: {type: 'info'},
                style: {marginLeft: '16px'},
                on: {
                  click: () => {
                    this.downloadEndReport(params.index)
                  }
                },
              }, '结题报告')]);
            }
          },
          {
            title: '审核结果',
            key: 'content',
            align: 'center',
            width: 450,
            render: (h, params) => {
              return h('div', [h('Button', {
                props: {type: 'primary'},
                on: {
                  click: () => {
                    this.submit(params.index)
                  }
                },
              }, '同意并提交给领导审核'),h('Button', {
                props:{type:'primary'},
                style: {marginLeft: '28px'},
                on:{
                  click:() => {
                    this.declare(params.index)
                  }
                },
              },'驳回申请')]);
            }
          }
        ],
        data1: [
          {
            projectName: '项目1',
            deadLine: '2019-01-01',
            introduce: '本项目为个人消费借款项目，对接的资产是由多笔个人借款组成的资产包。资产提供方：该项目由国内某知名消费金融科技公司提供，累计放款金额过百亿，公司信誉良好，出借人可安心出借。'
          },
          {
            projectName: '项目2',
            deadLine: '2019-01-01',
            introduce: '本项目为个人消费借款项目，对接的资产是由多笔个人借款组成的资产包。资产提供方：该项目由国内某知名消费金融科技公司提供，累计放款金额过百亿，公司信誉良好，出借人可安心出借。'
          }
        ],
      }
    },
    mounted() {
        this.initData()
        this.initInfo()
      },
    methods: {
      initInfo() {
        axios({
          url: apiRoot + '/user/userInfo/1',
          method: 'get',
        }).then((res) => {
          if (res.data.code === 'SUCCESS') {
            this.official.department = res.data.data.department;
            this.official.phone = res.data.data.phone;
            this.official.mail = res.data.data.mail;
          }
        }).catch(() => {
          this.$Message.error("请检查网络!")
        })
        console.log('localStorage', localStorage)
        this.official.userId = localStorage.getItem('userid');
        this.official.userName = localStorage.getItem('username');
        console.log('official:', this.official)
      },
      submit(){
        this.model1= false;
        this.$Message.success("项目成功提交");
      },
      declare(index) {
        this.model1 = true;
        this.$nextTick(() => {
          this.$forceUpdate(this.$refs.modal);
        })
      },
      finish() {
        this.model1 = false;
        this.$Message.success("评审意见填写成功！");
      },
      cancel() {
        this.model1 = false
      },
      downloadEndReport() {
        this.$Message.info('点击下载结题报告')
      },
      Refresh() {
        this.initData();
        this.$Message.success('刷新成功!')
      },
      initData() {
        this.loading = true
        axios({
          url: apiRoot + '/principal/AllAviProjectCategory',
          method: 'get'
        }).then((res) => {
          if (res.data.code === 'SUCCESS') {
            this.data1 = res.data.data;
            this.loading = false;
          } else {
            this.$Message.error('初始化失败！')
            this.loading = false;
          }
        }).catch(() => {
          this.$Message.error('初始化失败,请检查网络！')
          this.loading = false;
        })
      },
    },
      created() {
        this.initData()
      }
    }
</script>

<style scoped lang="scss">
  @import "fourEx";
</style>
