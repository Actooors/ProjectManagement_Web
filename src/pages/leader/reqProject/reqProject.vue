<template>
  <div class="wrapper">
    <Table stripe border :columns="columns" :data="data1" class="table" size="large"></Table>
    <Modal
      v-model="model1"
      title="填写会评意见"
      width="700"
      maxHeight="800"
      :mask-closable="false"
      ref="modal"
      @on-cancel="cancel" >
      <Form :model="formItem" :label-width="80">
        <div>
          <p data-v-2526d47e="" style="font-size: 16px; font-weight: bold; color: rgb(70, 76, 91);">填写会评意见</p>
          <Input v-model="formItem.textarea" type="textarea" :autosize="{minRows: 2,maxRows: 5}"
                 placeholder="在此填写会评意见"></Input>
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
  export default{
    name: 'reqProject',
    data() {
      return {
        model1: false,
        formItem: {
          textarea: '在此填写会评意见'
        },
        columns: [
          {
            title: '项目名称',
            align: 'center',
            key: 'projectName'
          },
          {
            title: '项目类别',
            key: 'type',
            align: 'center'
          },
          {
            title: '终审状态',
            key: 'status',
            align: 'center'
          },
          {
            title: '截止日期',
            key: 'deadLine',
            align: 'center'
          },
          {
            title: '终审项目申请书',
            key: 'ProjectFinalApply',
            align: 'center',
            width: 250,
            render: (h,params) => {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'info'
                  },
                  on: {
                    click: () => {
                      this.download(params.index)
                    }
                  }
                }, '下载'),
                h('Button', {
                  prop: {
                    type:'primary'
                  },
                  style: {
                    marginLeft:'10px'
                  },
                  on: {
                    click:() => {
                      this.declare(params.index)
                    }
                  }
                }, '填写会评意见')
              ]);
            }
          }
        ],
        data1:[
          {
            type: '人文',
            projectId: 2,
            status: '已通过',
            projectName: '项目1',
            deadLine: '2019-01-01',
            introduce: '本项目为个人消费借款项目，对接的资产是由多笔个人借款组成的资产包。资产提供方：该项目由国内某知名消费金融科技公司提供，累计放款金额过百亿，公司信誉良好，出借人可安心出借。'
          },
          {
            type: '理工',
            projectId: 2,
            status: '已通过',
            projectName: '项目2',
            deadLine: '2019-01-01',
            introduce: '本项目为个人消费借款项目，对接的资产是由多笔个人借款组成的资产包。资产提供方：该项目由国内某知名消费金融科技公司提供，累计放款金额过百亿，公司信誉良好，出借人可安心出借。'
          },
          {
            type: '经管',
            projectId: 2,
            status: '待终审',
            projectName: '项目3',
            deadLine: '2019-01-01',
            introduce: '本项目为个人消费借款项目，对接的资产是由多笔个人借款组成的资产包。资产提供方：该项目由国内某知名消费金融科技公司提供，累计放款金额过百亿，公司信誉良好，出借人可安心出借。'
          },
          {
            type: '计算机',
            projectId: 2,
            status: '已通过',
            projectName: '项目4',
            deadLine: '2019-01-01',
            introduce: '本项目为个人消费借款项目，对接的资产是由多笔个人借款组成的资产包。资产提供方：该项目由国内某知名消费金融科技公司提供，累计放款金额过百亿，公司信誉良好，出借人可安心出借。'
          }
        ]
      };
    },
    methods: {
      declare(index) {
        this.$Message.success('填写会评意见!');
        this.model1 = true;
        this.$nextTick(() => {
          this.$forceUpdate(this.$refs.modal)
        });
      },
      download() {
        this.$Message.info('点击下载终审项目申请书')
      },
      finish() {
        this.model1 = false;
      },
      cancel() {
        this.model1 = false;
      }
    }
  }
</script>

<style scoped lang = "scss">
  @import "reqProject";
</style>

