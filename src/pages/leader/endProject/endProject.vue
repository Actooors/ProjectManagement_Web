<template>
  <div class="wrapper">
    <div class="operation">
      <ButtonGroup>
        <Button type="success" :loading="loading" icon="md-refresh" @click="loading=!loading" size="large" ghost>
          刷新
        </Button>
      </ButtonGroup>
    </div>
    <Table stripe border :columns="columns1" :data="data1" class="table" size="large"></Table>
    <Modal
      v-model="model1"
      title="填写最终评审结果"
      width="650"
      maxHeight="700"
      ref="modal"
      @on-cancel="cancel"
    >
      <div>
        <div class="button">
          选择是否通过最终审核：
          <Button @click.native="showAccept">
            通过审核
          </Button>
          <Button @click.native="showRefuse">
            不通过
          </Button>
        </div>

        <div v-if="accept" class="accept">
          该项目已通过审核！
        </div>
        <div v-if="refuse" class="refuse">
          <p data-v-2526d47e="" style="font-size: 15px; font-weight: bold; color: rgb(70, 76, 91);">
            驳回理由如下：
          </p>
          <Input type="textarea" :autosize="{minRows: 2,maxRows: 5}"
                 placeholder="填写驳回理由" style="margin-top:20px"></Input>
        </div>
      </div>
      <div slot="footer">
        <Button type="primary" @click.native="finish" style="margin-top: 20px;margin-left: 20px;width:100px">
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
        accept: false,
        refuse: false,
        columns1: [
          {
            title: '项目名称',
            key: 'projectName',
            align: 'center'
          },
          {
            title: '项目类别',
            key: 'type',
            align: 'center'
          },
          {
            title: '项目状态',
            key: 'status',
            align: 'center'
          },
          {
            title: '项目结题报告',
            key: 'ProjectFinalReport',
            align: 'center',
            render: (h, params) => {
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
                }, '下载')
              ])
            }
          },
          {
            title: '评审内容',
            key: 'content',
            align: 'center',
            width: 300,
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
            status: '未终审',
            type: '理工'
          },
          {
            projectName: '项目2',
            status: '未终审',
            type: '理工'
          },
          {
            projectName: '项目3',
            status: '未终审',
            type: '人文'
          },
          {
            projectName: '项目4',
            status: '已通过',
            type: 'CES'
          }
        ]

      };
    },
    methods: {
      declare(index) {
        this.$Message.success('填写最终评审意见')
        this.model1 = true
        this.$nextTick(() => {
          this.$forceUpdate(this.$refs.modal)
        })
      },
      download(index) {
        this.$Message.info('点击下载项目结题报告')
      },
      finish() {
        this.$Message.success('填写成功！')
        this.model1 = false
      },
      showAccept() {
        this.accept = !this.accept
        this.refuse = false
      },
      showRefuse() {
        this.refuse = !this.refuse
        this.accept = false
      },
    }
  }
</script>

<style scoped lang="scss">
  @import "endProject";
</style>
