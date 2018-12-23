<template>
  <div class="wrapper">
    <div class="operation">
      <ButtonGroup>
        <Button type="success" :loading="loading" icon="md-refresh" @click="loading=!loading" size="large" ghost>
          刷新
        </Button>
      </ButtonGroup>
    </div>
    <Table stripe border class="table" :columns="columns1" :data="data1" size="large"></Table>
    <Modal
      v-model="model1"
      title="填写评审结果"
      width="700"
      maxHeight="800"
      :mask-closable="false"
      ref="modal"
      @on-cancel="cancel">
      <Form :model="formItem" :label-width="80">
        <div class="form_head">
          <p data-v-2526d47e="" style="font-size: 12px; font-weight: bold; color: rgb(70, 76, 91);">评审分数</p>

          <InputNumber :max="100" :min="1" v-model="value1"></InputNumber>
        </div>
        <div class="from_middle">
          <p data-v-2526d47e="" style="font-size: 12px; font-weight: bold; color: rgb(70, 76, 91);">评审内容填写</p>
          <Input v-model="formItem.textarea" type="textarea" :autosize="{minRows: 2,maxRows: 5}"
                 placeholder="填写评审内容"></Input>
        </div>
        <div class="form_bottom">
          <p data-v-2526d47e="" style="font-size: 12px; font-weight: bold; color: rgb(70, 76, 91);">选择优先级</p>
          <RadioGroup v-model="priority" type="button">
            <Radio label="优先支持"></Radio>
            <Radio label="支持"></Radio>
            <Radio label="反对"></Radio>
          </RadioGroup>
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
  export default {
    name: 'endProject',
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
                on: {
                  click: () => {
                    this.downloadMidReport(params.index)
                  }
                },
              }, '中期报告'), h('Button', {
                props: {type: 'info'},
                style: {marginLeft: '8px'},
                on: {
                  click: () => {
                    this.downloadEndReport(params.index)
                  }
                },
              }, '结题报告')]);
            }
          },
          {
            title: '评审内容',
            key: 'content',
            align: 'center',
            render: (h, params) => {
              return h('div', [h('Button', {
                props: {type: 'primary'},
                on: {
                  click: () => {
                    this.declare(params.index)
                  }
                },
              }, '评审内容详情页')]);
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
    methods: {
      declare(index) {
        this.$Message.success("填写评审意见");
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
      downloadMidReport() {
        this.$Message.info('点击下载中期报告')
      },
      downloadEndReport() {
        this.$Message.info('点击下载结题报告')
      },
    }
  }
</script>

<style scoped lang="scss">
  @import 'endProject';
</style>
