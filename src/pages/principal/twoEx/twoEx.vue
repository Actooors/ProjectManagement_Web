<template>
  <div class="wrapper">
    <ButtonGroup class="operation">
      <Button type="success" icon="md-refresh" @click="Refresh" size="large" ghost>
        刷新
      </Button>
    </ButtonGroup>
    <Table :columns="columns1" :data="data1" border class="table" size="large" stripe></Table>
  </div>
</template>


<script>
  import axios from 'axios'

  export default {
    name: "twoEx",

    data() {
      return {
        experts: [''],
        loading: false,
        modal1: false,
        modal2: false,
        modal3: false,
        value1: 1,
        priority: '',
        formItem: {
          textarea: '填写评审内容'
        },
        allSuccess: false,
        value: ['1'],
        show: false,

        columns1: [
          {
            title: '项目名称',
            key: 'projectName',
            align: 'center',
            width: 390
          },
          {
            title: '下载申请书',
            key: 'downloadReport',
            align: 'center',
            render: (h, params) => {
              return h('div', [h('Button', {
                props: {type: 'info'},
                on: {
                  click: () => {
                    this.downloadEndReport(params.index)
                  }
                },
              }, '中期报告')]);
            }
          },
          {
            title: '专家审核进度',
            key: 'content',
            align: 'center',
            width: 170,

            render: (h, params) => {
              return h('div', [h('Progress', {
                props: {
                  percent: 60,
                  successPercent:30,
                },
              }, '60%')])
            }
          },
          {
            title: '跳过专家审核',
            key: 'content',
            align: 'center',
            width: 200,
            render: (h, params) => {
              return h('div', [h('Button',{
                props: {type: 'warning'},
                on: {
                  click: () => {
                    this.confirm()
                  }
                },
              }, '跳过')])
            }
          }
        ],
        data1:
          [
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
    /*mounted() {
       this.initData()
        //this.initInfo()
      },*/
    methods: {
      /*initInfo() {
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
      },*/
      chooseExpert(index) {
        this.modal2 = true;
        this.$nextTick(() => {
          this.$forceUpdate(this.$refs.modal);
        })
      },
      setListCheck: function (idx) {
        var check = this.list[idx].check;
        this.list[idx].check = check === true ? false : true;
      },
      cancel() {
        this.modal1 = false
      },
      downloadEndReport() {
        this.$Message.info('点击下载结题报告')
      },
      Refresh() {
        this.initData();
        this.$Message.success('刷新成功!')
      },
      confirm() {
        this.$Modal.confirm({
          title: '请再次确认',
          content: '<p>请确认是否将该项目跳过专家审核</p>',
          onOk: () => {
            this.$Message.info('已经成功跳过');
          },
          onCancel: () => {
            this.$Message.info('已经取消操作');
          }
        });
      },
      initData() {
        this.loading = true
        axios({
          url: apiRoot + '/principal/AllProjectCategory',
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
    /*created() {
      this.initData()
    }*/
  }
</script>

<style scoped lang="scss">
  @import "twoEx";
</style>
