<template>
  <div class="wrapper">
    <ButtonGroup class="operation">
      <Button type="success" icon="md-refresh" @click="Refresh" size="large" ghost>
        刷新
      </Button>
    </ButtonGroup>
    <Table :columns="columns1" :data="data1" border class="table" size="large" :loading="loading" stripe></Table>
  </div>
</template>


<script>
  import axios from 'axios'
  import download from '../../../assets/js/download'
  export default {
    name: "twoEx",

    data() {
      return {
        loading: false,
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
                    this.download(params.index)
                  }
                },
              }, '项目申请书')]);
            }
          },
          {
            title: '专家审核进度',
            key: 'content',
            align: 'center',
            render: (h, params) => {
              return h('div', [h('Progress', {
                props: {
                  percent: 60,
                  successPercent: 30,
                },
              }, '60%')])
            }
          },
          {
            title: '操作',
            key: 'content',
            align: 'center',
            render: (h, params) => {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'info'
                  },
                  style: {
                    marginRight: '10px'
                  },
                  on: {
                    click: () => {

                    }
                  }
                }, '详情'),
                h('Button', {
                  props: {type: 'warning'},
                  on: {
                    click: () => {
                      this.confirm()
                    }
                  },
                }, '跳过专家审核')])
            }
          }
        ],
        data1: [],
      }
    },
    mounted() {
      this.initData("初始化成功！");
    },
    methods: {
      download(index){
        const that = this
        var filename = this.data1[index].projectApplicationDownloadAddress.split('---')[1]
        axios({
          url: apiRoot + '/file/download?fileAddress=' + that.data1[index].projectApplicationDownloadAddress,
          method: 'get',
          headers: {Authorization: localStorage.getItem('token')},
          responseType: 'blob'
        }).then((res) => {
          if (res.status === 200) {
            download(res.data, filename, 'text/plain')
            this.$Message.success("下载成功！")
          } else {
            this.$Message.error("下载失败！")
          }
        }).catch(() => {
          this.$Message.error("下载失败，请检查网络连接！")
        })
      },
      Refresh() {
        this.initData('刷新成功!');
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
      initData(msg) {
        this.loading = true
        axios({
          url: apiRoot + '/admin/reviewPhase/2',
          method: 'get'
        }).then((res) => {
          if (res.data.code === 'SUCCESS') {
            console.log(res.datai)
            this.data1 = res.data.data;
            this.$Message.success(msg);
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
  @import "twoEx";
</style>
