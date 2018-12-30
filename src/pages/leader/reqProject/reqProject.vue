<template>
  <div class="wrapper">
    <div class="operation">
      <ButtonGroup>
        <Button type="success" icon="md-refresh" @click="Refresh" size="large" ghost>
          刷新
        </Button>
      </ButtonGroup>
    </div>
    <Table stripe border :columns="columns" :loading="loading" :data="data1" class="table" size="large"></Table>
    <Modal
      v-model="model1"
      title="填写最终审核结果"
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
          该项目已通过最终审核！
        </div>
        <div v-if="refuse" class="refuse">
          <p data-v-2526d47e="" style="font-size: 15px; font-weight: bold; color: rgb(70, 76, 91);">
            驳回理由如下：
          </p>
          <Input type="textarea" v-model="refuseComment" :autosize="{minRows: 2,maxRows: 5}"
                 placeholder="填写驳回理由" style="margin-top:20px"></Input>
        </div>
      </div>
      <div slot="footer">
        <Button type="primary" @click.native="finish(projectIndex)"
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
    name: 'reqProject',
    data() {
      return {
        loading: false,
        model1: false,
        accept: false,
        refuse: false,
        judge: false,
        projectIndex: 0,
        refuseComment: '',
        columns: [
          {
            title: '项目名称',
            align: 'center',
            key: 'projectName'
          },
          {
            title: '项目类别',
            key: 'projectCategoryName',
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
            title: '负责人部门',
            key: 'department',
            align: 'center'
          },
          {
            title: '项目申请书',
            key: 'ProjectFinalApply',
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
              ]);
            }
          },
          {
            title: '操作',
            key: 'operation',
            align: 'center',
            render: (h, params) => {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'primary'
                  },
                  on: {
                    click: () => {
                      this.declare()
                      this.projectIndex = params.index
                    }
                  }
                }, '审核')
              ])
            }
          }
        ],
        data1: []
      };
    },
    mounted() {
      this.initData('初始化成功！')
    },
    methods: {
      Refresh() {
        this.initData('刷新成功！');
      },
      initData(str) {
        this.loading = true
        axios({
          url: apiRoot + '/leader/unjudgeApplicatetion',
          mothod: 'get'
        }).then((res) => {
          console.log(res.data)
          if (res.data.code === 'SUCCESS') {
            this.data1 = res.data.data
            this.loading = false
            this.$Message.success(str)
          } else {
            this.$Message.error(res.data.message)
            this.loading = false
          }
        }).catch(() => {
          this.$Message.error("初始化失败，请检查网络连接！")
          this.loading = false
        })
      },
      declare() {
        this.$Message.success('填写会评意见!');
        this.model1 = true;
      },
      download(index) {
        this.$Message.info('点击下载终审项目申请书')
        const that = this
        var filename = this.data1[index].uploadAddress.split('---')[1]  //---后为文件名
        axios({
          url: apiRoot+'/file/download?fileAddress='+this.data1[index].uploadAddress,
          method: 'get',
          headers:{Authorization: localStorage.getItem('token')},
          responseType:'blob'
        }).then((res)=>{
          if(res.status === 200) {
            download(res.data, filename, "text/plain")
            this.$Message.success("下载成功！")
          }else {
            this.$Message.error("下载失败！")
          }
        }).catch(() => {
          this.$Message.error("下载失败，请检查网络连接！")
        })
      },
      finish(index) {
        console.log(index)
        if (this.accept === true && this.refuse === false) {
          this.judge = true;
        } else if (this.accept === false && this.refuse === true) {
          this.judge = false;
        }
        axios({
          url: apiRoot + '/leader/JudgeApplication',
          method: 'post',
          data: {
            projectApplicationId: this.data1[index].projectApplicationId,
            judge: this.judge,
            msg: this.refuseComment
          }
        }).then((res)=>{
          if(res.data.code==='SUCCESS') {
            this.$Message.success("审核成功！");
            this.model1 = false;
            this.cancel();
            this.data1.splice(index, 1);
          }else {
            this.$Message.error(res.data.message);
          }
        }).catch(()=>{
          this.$Message.error('审核失败，请检查网络连接！');
        })
      },
      cancel() {
        this.accept = false
        this.refuse = false
      },
      showAccept() {
        this.accept = !this.accept
        this.refuse = false
      },
      showRefuse() {
        this.refuse = !this.refuse
        this.accept = false
      }
    }
  }
</script>

<style scoped lang="scss">
  @import "reqProject";
</style>

