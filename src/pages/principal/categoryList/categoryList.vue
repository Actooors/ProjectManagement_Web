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
                  props: {
                    type: 'info'
                  },
                  style: {
                    marginRight: '10px'
                  },
                  on: {
                    click: () => {
                      this.$Modal.info({
                        width:'600px',
                        title:this.data1[params.index].projectName+'项目详情',
                        content:`<p>项目描述：${this.data1[params.index].projectDescription}</p><br><p>业务员手机：${this.data1[params.index].principalPhone}</p><br>
                                 <p>项目大类：${this.data1[params.index].projectType}</p><br><p>经费额度：${this.data1[params.index].maxMoney}元</p><br>
                                 <p>申报人类型：${this.data1[params.index].applicantType}</p><br><p>专家名单：<p v-for="this.data1[params.index].expertList">{{item.userName}}</p></p><br>`
                        //TODO
                      })
                    }
                  }
                }, '详情'),
                h('Button', {
                  props: {
                    type: 'error'
                  },
                  on: {
                    click: () => {
                      this.$Message.info('点击删除')

                    }
                  }
                }, '删除')
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
            console.log(typeof this.data1[0].applicationStartTime)
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
