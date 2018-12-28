<template>
  <div class="wrapper">
    <div class="operation">
      <ButtonGroup>
        <Button type="success" icon="md-refresh" @click="Refresh" size="large" ghost>
          刷新
        </Button>
      </ButtonGroup>
    </div>
    <Table stripe border :loading="loading" :columns="columns" :data="data1" class="table" height="750"
           size="large"></Table>
    <Modal
      v-model="model1"
      title="填写评审结果"
      width="700"
      maxHeight="800"
      :mask-closable="false"
      ref="modal"
      @on-cancel="cancel">
      <!--弹出层-->
      <Form :model="formItem" :label-width="80">
        <div class="form_head">
          <p data-v-2526d47e="" style="font-size: 12px; font-weight: bold; color: rgb(70, 76, 91);">评审分数</p>
          <InputNumber :max="100" :min="1" v-model="value1"></InputNumber>
        </div>

        <div class="from_middle">
          <p data-v-2526d47e="" style="font-size: 12px; font-weight: bold; color: rgb(70, 76, 91);">评审内容填写</p>
          <Input v-model="formItem.textarea" type="textarea" :autosize="{minRows: 2,maxRows: 5}"
                 placeholder="在此填写评审内容"></Input>
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
        <Button type="primary" @click.native="finish" style="margin-top: 20px;margin-left: 20px;width:100px">
          完成
        </Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  import axios from 'axios'

  export default {
    name: "reqProject",
    data() {
      return {
        loading: false,
        model1: false,
        value1: 1,
        priority: '',
        formItem: {
          textarea: '在此填写评审内容'
        },
        columns: [
          {
            title: '项目类型',
            key: 'projectCategoryName',
            align: 'center'
          },
          {
            title: '项目名称',
            key: 'projectName',
            align: 'center'
          },
          {
            title: '项目简介',
            key: 'description',
            align: 'center'
          },
          {
            title: '负责人学/工号',
            key: 'userId',
            align: 'center'
          },
          {
            title: '负责人姓名',
            key: 'userName',
            align: 'center'
          },
          {
            title: '负责人单位',
            key: 'department',
            align: 'center'
          },
          {
            title: '下载申请书',
            key: 'download',
            align: 'center',
            render: (h, params) => {
              return h('div', [
                h('Button', {
                  prop: {
                    type: 'info'
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.download(params.index)
                    }
                  }
                }, '下载申请书')
              ])
            }
          },
          {
            title: '评审内容',
            key: 'content',
            align: 'center',
            render: (h, params) => {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'primary'
                  },
                  on: {
                    click: () => {
                      this.declare(params.index)
                    }
                  },
                }, '评审内容详情页')]);
            }
          }
        ],
        data1: []
      }
    },
    mounted() {
      this.initData();
    },
    methods: {
      Refresh() {
        this.initData();
        this.$Message.success("刷新成功！")
      },
      initData() {
        this.loading = true
        axios({
          url: apiRoot + '/expert/unJudgeProject',
          method: 'get'
        }).then((res) => {
          if (res.data.code === 'SUCCESS') {
            this.data1 = res.data.data
            this.loading = false
          } else {
            this.$Message.error(res.data.message)
            this.loading = false
          }
        }).catch(() => {
          this.$Message.error("请检查网络连接！")
          this.loading = false
        })
      },
      declare(index) {
        this.$Message.success("填写评审意见")
        this.model1 = true
        this.$nextTick(() => {
          this.$forceUpdate(this.$refs.modal)
        })
      },
      finish() {
        this.model1 = false
        this.$Message.success("评审意见填写成功！")
      },
      cancel() {
        this.model1 = false
      },
      download() {
        this.$Message.info('点击下载申请书')
      }
    }
  }
</script>

<style scoped lang="scss">
  @import "reqProject";
</style>

