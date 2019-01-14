<template>
  <div class="wrapper">
    <ButtonGroup class="operation">
      <Button @click="Refresh" ghost icon="md-refresh" size="large" type="success">
        刷新
      </Button>
    </ButtonGroup>
    <Table :columns="columns1" :data="data1" border class="table" size="large" :loading="loading" stripe></Table>
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
        <Button @click="confirm" style="margin-top: 20px;margin-left: 20px;width:100px"
                type="primary">
          完成
        </Button>
      </div>
    </Modal>
    <Modal
      :mask-closable="false"
      @on-cancel="cancel"
      maxHeight="800"
      ref="model"
      title="进行会评"
      v-model="modal2"
      width="700">
      <Form :label-width="180" :model="formItem" style="margin-right: 25px">
        <div class="from_middle">
          <p data-v-2526d47e="" style="font-size: 12px; font-weight: bold; color: rgb(70, 76, 91);">评审内容填写</p>
          <Input :autosize="{minRows: 4,maxRows: 10}" placeholder="请填写会评（申请者可以重新修改）" type="textarea"
                 v-model="formItem.textarea"></Input>
        </div>
      </Form>
      <div slot="footer">
        <Button @click="confirm" style="margin-top: 20px;margin-left: 20px;width:100px"
                type="primary">
          完成
        </Button>
      </div>
    </Modal>
    <Modal
      @on-cancel="cancel"
      maxHeight="1700"
      ref="modal"
      title="查看专家评审结果"
      v-model="modal3"
      width="650">
      <Collapse accordion v-model="value3">
        <Panel name="1">
          专家1
          <div slot="content">
            很有创意
            <Collapse accordion v-model="value4">
              <Panel name="1-1">
                评审分数
                <p slot="content">99</p>
              </Panel>
              <Panel name="1-2">
                优先级
                <p slot="content">支持</p>
              </Panel>
            </Collapse>
          </div>
        </Panel>
        <Panel name="2">
          专家2
          <p slot="content">未进行评审</p>
        </Panel>
        <Panel name="3">
          专家3
          <div slot="content">很糟糕

            <Collapse accordion v-model="value4">
              <Panel name="1-1">
                评审分数
                <p slot="content">10</p>
              </Panel>
              <Panel name="1-2">
                优先级
                <p slot="content">反对</p>
              </Panel>
            </Collapse>
          </div>
        </Panel>
      </Collapse>
      <div slot="footer">
        <Button @click="confirm" style="margin-top: 20px;margin-left: 20px;width:100px"
                type="primary">
          返回
        </Button>
      </div>
    </Modal>
  </div>
</template>


<script>
  import axios from 'axios'

  export default {
    name: "threeEx",

    data() {
      return {
        experts: [''],
        loading: false,
        modal1: false,
        modal2: false,
        modal3: false,
        value1: 1,
        value3: '1',
        value4: '1-1',
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
          },
          {
            title: '项目类别',
            key: 'projectCategoryName',
            align: 'center',
          },
          {
            title: '申请截止日期',
            key: 'applicationDeadLine',
            align: 'center'
          },
          {
            title: '项目描述',
            key: 'description',
            align: 'center',
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
              }, '项目申请书')]);
            }
          },
          {
            title: '其他专家评审结果',
            key: 'chooseExpert',
            align: 'center',
            render: (h, params) => {
              return h('div', [
                h('Button', {
                    props: {
                      type: 'success',//还需加判断函数
                      //type:'error',
                      size: 'large'
                    },
                    style: {
                      marginRight: '5px'
                    },
                    on: {
                      click: () => {
                        this.result()
                      }
                    },
                  },
                  '点击查看'
                )])
            }
          },
          {
            title: '操作',
            key: 'content',
            align: 'center',
            width: 250,
            render: (h, params) => {
              return h('div', [
                  h('Button', {
                    props: {type: 'info'},
                    style: {marginRight: '10px'},
                    on: {
                      click: () => {
                        this.details(params.index)
                      }
                    }
                  }, '详情'),
                  h('Button', {
                    props: {type: 'success'},
                    style: {marginRight: '10px'},
                    on: {
                      click: () => {
                        this.declare(params.index)
                      }
                    },
                  }, '同意'), h('Button', {
                    props: {type: 'error'},
                    on: {
                      click: () => {
                        this.declare1(params.index)
                      }
                    },
                  }, '驳回')
                ]
              );
            }
          }
        ],
        data1: [],
      }
    },
    mounted() {
      this.initData('初始化成功！')
    },
    methods: {
      result(index) {
        this.modal3 = true;
      },
      declare(index) {
        this.modal2 = true;
        this.$nextTick(() => {
          this.$forceUpdate(this.$refs.modal);
        })
      },
      declare1(index) {
        this.modal1 = true;
        this.$nextTick(() => {
          this.$forceUpdate(this.$refs.modal);
        })
      },
      cancel() {
        this.modal1 = false
      },
      async details(index) {

      },
      downloadEndReport() {
        this.$Message.info('点击下载结题报告')
      },
      Refresh() {
        this.initData('刷新成功！');
      },
      confirm() {
        this.$Modal.confirm({
          title: '请再次确认',
          content: '<p>请确认是否发送</p>',
          onOk: () => {
            this.$Message.info('已经成功发送');
          },
          onCancel: () => {
            this.$Message.info('已经取消发送');
          }
        });
      },
      initData(msg) {
        this.loading = true
        axios({
          url: apiRoot + '/admin/reviewPhase/3',
          method: 'get'
        }).then((res) => {
          if (res.data.code === 'SUCCESS') {
            this.data1 = res.data.data;
            this.$Message.success(msg)
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
  }
</script>

<style scoped lang="scss">
  @import "threeEx";
</style>
