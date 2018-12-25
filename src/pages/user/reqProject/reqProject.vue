<template>
  <div class="wrapper">
    <ButtonGroup class="operation">
      <Button type="success" icon="md-refresh" @click="Refresh" size="large" ghost>
        刷新
      </Button>
    </ButtonGroup>
    <!--<Table stripe border :columns="columns" :data="data1" class="table" height="750" size="large"></Table>-->
    <Table stripe border :columns="columns" :loading="loading" :data="data1" class="table" size="large"
           height="750"></Table>
  </div>
</template>

<script>
  import axios from 'axios'

  export default {
    name: "reqProject",
    data() {
      return {
        loading: false,
        columns: [
          {
            title: '项目名称',
            key: 'projectName',
            align: 'center',
            width: 250,
          },
          {
            title: '项目申报日期',
            key: 'time',
            align: 'center',
            width: 200,
          },
          {
            title: '项目简介',
            key: 'description',
            align: 'center'
          },
          {
            title: '项目状态',
            key: 'reviewPhase',
            width: 200,
            align: 'center'
          },
          {
            title: '操作',
            key: 'operation',
            align: 'center',
            width: 250,
            render: (h, params) => {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'error'
                  },
                  on: {
                    click: () => {
                      this.projectCancel(params.index);
                    }
                  }
                }, '取消')
              ])
            }
          }
        ],
        data1: []
      }
    },
    created() {
      this.initData();
    },
    methods: {
      Refresh() {
        this.initData();
        this.$Message.success('刷新成功!')
      },
      initData() {
        this.loading = true
        axios({
          url: apiRoot + '/user/inTheApplicationList',
          method: 'get'
        }).then((res) => {
          if (res.data.code === 'SUCCESS') {
            console.log(res.data)
            this.data1 = res.data.data;
            this.loading = false
          }
        })
      },
      projectCancel(index) {
        axios({
          url: apiRoot + '/user/deleteApplication',
          method: 'post',
          data: {
            applicationId: this.data1[index].projectApplicationId,
            applicationName: this.data1[index].projectName
          }
        }).then((res) => {
          if (res.data.code === 'SUCCESS') {
            this.$Message.success('取消成功!');
            this.data1.splice(index, 1);
          } else {
            this.$Message.error('取消失败!');
          }
        }).catch(() => {
          this.$Message.error('取消失败,请检查网络连接!');
        })
      }
    }
  }
</script>

<style scoped lang="scss">
  @import "reqProject";
</style>
