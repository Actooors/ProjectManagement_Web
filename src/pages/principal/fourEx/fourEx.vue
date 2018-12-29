<template>
  <div class="wrapper">
    <ButtonGroup class="operation">
      <Button @click="Refresh" ghost icon="md-refresh" size="large" type="success">
        刷新
      </Button>
    </ButtonGroup>
    <Table :columns="columns1" :data="data1" border class="table" size="large" stripe></Table>
    <Modal
      :mask-closable="false"
      @on-cancel="cancel"
      maxHeight="800"
      ref="model"
      title="驳回理由"
      v-model="modal1"
      width="700">
      <Form :label-width="180" :model="formItem" style="margin-right: 25px">
        <div class="from_middle">
          <p data-v-2526d47e="" style="font-size: 12px; font-weight: bold; color: rgb(70, 76, 91);">评审内容填写</p>
          <Input :autosize="{minRows: 4,maxRows: 10}" placeholder="请填写驳回理由（申请者可以重新修改）" type="textarea"
                 v-model="formItem.textarea"></Input>
        </div>
      </Form>
      <div slot="footer">
        <Button  @click="confirm" style="margin-top: 20px;margin-left: 20px;width:100px"
                type="primary">
          完成
        </Button>
      </div>
    </Modal>

    <Modal
      @on-cancel="cancel"
      maxHeight="700"
      ref="modal"
      title="选择专家"
      v-model="modal2"
      width="650"
    >
      <CheckboxGroup v-model="experts" >
        <Checkbox label="专家1"></Checkbox>
        <Checkbox label="专家2"></Checkbox>
        <Checkbox label="专家3"></Checkbox>
      </CheckboxGroup>
      <div slot="footer">
        <Button  @click="confirm" style="margin-top: 20px;margin-left: 20px;width:100px" type="primary">
          发送报告
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
        experts: [''],
        loading: false,
        modal1: false,
        modal2: false,
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
            width: 290
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
              }, '结题报告')]);
            }
          },
          {
            title: '审核结果',
            key: 'content',
            align: 'center',
            width: 450,
            render: (h, params) => {
              return h('div', [h('Button',{
                props: {type: 'primary'},
                on: {
                  click: () => {
                    this.confirm()
                  }
                },
              }, '同意并提交给领导审核'), h('Button', {
                props: {type: 'primary'},
                style: {marginLeft: '28px'},
                on: {
                  click: () => {
                    this.declare(params.index)
                  }
                },
              }, '驳回申请')]);
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
        this.initInfo()
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

      declare(index) {
        this.modal1 = true;
        this.$nextTick(() => {
          this.$forceUpdate(this.$refs.modal);
        })
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
          content: '<p>请确认是否发送结题报告与专家评审结果</p>',
          onOk: () => {
            this.$Message.info('已经成功发送');
          },
          onCancel: () => {
            this.$Message.info('已经取消发送');
          }
        });
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
    }
    /*created() {
      this.initData()
    }*/
  }
</script>

<style scoped lang="scss">
  @import "fourEx";
</style>
