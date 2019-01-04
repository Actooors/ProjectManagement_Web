<template>
  <div class="wrapper">
    <ButtonGroup class="operation">
      <Button type="success" icon="md-refresh" @click="Refresh" size="large" ghost>
        刷新
      </Button>
    </ButtonGroup>
    <Table stripe border :columns="columns" :loading="loading" :data="data1" class="table" size="large"
           height="750"></Table>
  </div>
</template>

<script>
  import axios from 'axios'

  export default {
    name: "categoryList",
    data() {
      return {
        loading: false,
        data1: [],
        columns: [
          {
            title: '项目名称',
            key: 'projectName',
            align: 'center'
          },
          {
            title: '项目简介',
            key: 'projectDescription',
            align: 'center'
          },
          {
            title: '项目类别',
            key: 'projectType',
            align: 'center'
          },
          {
            title: '申报开始时间',
            key: 'applicationStartTime',
            align: 'center'
          },
          {
            title: '申报截止时间',
            key: 'applicationEndTime',
            align: 'center'
          },
          {
            title: '项目开始时间',
            key: 'projectStartTime',
            align: 'center'
          },
          {
            title: '项目截止时间',
            key: 'projectEndTime',
            align: 'center'
          },
          {
            title: '操作',
            key: 'operation',
            align: 'center',
            render: (h, params) => {
              return h('div', [
                h('Button', {
                  style: {
                    marginRight: '10px'
                  },
                  on: {
                    click: () => {
                      this.$Message.info('点击详情')
                    }
                  }
                }, '详情'),
                h('Button', {
                  props: {
                    type: 'info'
                  },
                  on: {
                    click: () => {
                      this.$Message.info('点击修改')
                    }
                  }
                }, '修改')
              ])
            }
          }
        ]
      }
    },
    mounted() {
      this.initData('初始化成功！')
    },
    methods: {
      Refresh(){
        this.initData("刷新成功！")
      },
      initData(msg) {
        this.loading = true
        axios({
          url: apiRoot + '/admin/findMyProjectCategory',
          method: 'get'
        }).then((res) => {
          if (res.data.code === 'SUCCESS') {
            this.data1 = res.data.data
            this.$Message.success(msg)
            this.loading=false
          }else {
            this.$Message.error(res.data.message)
            this.loading=false
          }
        }).catch(()=>{
          this.$Message.error("请检查网络连接！")
          this.loading=false

        })
      }
    }
  }
</script>

<style scoped lang="scss">
  @import "categoryList";
</style>
