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
      <Form ref="formItem" :model="formItem" :rules="formItemRules" :label-width="120">
        <FormItem label="评审分数" prop="score">
          <InputNumber :max="100" :min="0" v-model="formItem.score"></InputNumber>
        </FormItem>
        <FormItem label="评审内容填写" prop="reviewOpinion">
          <Input v-model="formItem.reviewOpinion" type="textarea" :autosize="{minRows: 2,maxRows: 5}"
                 placeholder="在此填写评审内容"></Input>
        </FormItem>
        <FormItem label="选择优先级" prop="priority">
          <RadioGroup v-model="formItem.priority" type="button">
            <Radio label="1">优先支持</Radio>
            <Radio label="2">支持</Radio>
            <Radio label="3">反对</Radio>
          </RadioGroup>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="primary" @click.native="finish('formItem')"
                style="margin-top: 20px;margin-left: 20px;width:100px">
          完成
        </Button>
      </div>
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
        model1: false,
        projectIndex: 0,
        formItem: {
          score: 0,                         //评审打分
          reviewOpinion: '',                //评审内容
          priority: 0                   //评审优先级
        },
        formItemRules: {
          score: [
            {required: true, type: 'number', message: '评审分数不能为空', trigger: 'blur'}
          ],
          reviewOpinion: [
            {required: true, message: '评审内容不能为空', trigger: 'blur'}
          ],
          priority: [
            {required: true, message: '请选择优先级', trigger: 'blur'}
          ]
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
            align: 'center',
            tooltip: true
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
                      this.projectIndex = params.index
                      this.model1 = true
                    }
                  },
                }, '详情页')]);
            }
          }
        ],
        data1: []
      }
    },
    mounted() {
      this.initData('初始化成功！');
    },
    methods: {
      Refresh() {
        this.initData("刷新成功！");
      },
      initData(msg) {
        this.loading = true
        axios({
          url: apiRoot + '/expert/unJudgeProject',
          method: 'get'
        }).then((res) => {
          if (res.data.code === 'SUCCESS') {
            console.log(res.data)
            this.data1 = res.data.data
            this.$Message.success(msg)
            this.loading = false
          } else {
            this.$Message.warning(res.data.message)
            this.loading = false
          }
        }).catch(() => {
          this.$Message.error("请检查网络连接！")
          this.loading = false
        })
      },

      finish(name) {
        console.log('1')
        this.$refs[name].validate((valid) => {
          if (valid) {
            axios({
              url: apiRoot + '/expert/judgeProject',
              method: 'post',
              data: {
                applicationId: this.data1[this.projectIndex].projectApplicationId,
                score: this.formItem.score,
                reviewOpinion: this.formItem.reviewOpinion,
                finalOPinion: this.formItem.priority
              }
            }).then((res) => {
              console.log('2', res.data.code)
              if (res.data.code === 'SUCCESS') {
                this.model1 = false;
                this.$Message.success("评审意见填写成功！");
                //删除一个项目
                this.data1.splice(this.projectIndex, 1);
                //对对话框中的内容进行重置
                this.$refs['formItem'].resetFields();
              } else {
                this.model1 = false;
                this.$Message.error(res.data.message);
                //对对话框中的内容进行重置
                this.$refs['formItem'].resetFields();
              }
            })
          } else {
            this.$Message.error('请将字段填写完整！');
          }
        })
      },
      cancel() {
        this.model1 = false
        //对对话框中的内容进行重置
        this.$refs['formItem'].resetFields();
      },
      download(index) {
        console.log('downLoadAddress:', this.data1[index])
        const that = this
        var filename = this.data1[index].uploadAddress.split('---')[1]  //---后为文件名
        axios({
          url: apiRoot + '/file/download?fileAddress=' + that.data1[index].uploadAddress,
          method: 'get',
          headers: {Authorization: localStorage.getItem('token')},
          responseType: 'blob'
        }).then((res) => {
          if (res.status === 200) {
            console.log("！", res)
            download(res.data, filename, "text/plain")
            this.$Message.success("下载成功！")
          } else {
            this.$Message.error("下载失败！")
          }
        }).catch(() => {
          this.$Message.error("下载失败，请检查网络连接！")
        })
      }
    }
  }
</script>

<style scoped lang="scss">
  @import "reqProject";
</style>

