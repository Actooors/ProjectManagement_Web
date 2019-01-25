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
        name: "failProject",
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
                key: 'applicationDeadLine',
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
                title: '驳回详情',
                key: 'failMessage',
                align: 'center'
              }
            ],
            data1: [],
          }
        },
      mounted() {
        this.initData('初始化成功！');
      },
      methods: {
          Refresh() {
            this.initData('初始化数据')
          },
          initData(msg) {
            this.loading = true
            axios({
              url: apiRoot + '/user/inTheApplicationList',
              method: 'get'
            }).then((res) => {
              if (res.data.code === 'SUCCESS') {
                console.log(res.data)
                this.data1 = res.data.data;
                this.$Message.success(msg)
                this.loading = false
              }else {
                this.$Message.warning(res.data.message)
                this.loading = false
              }
            }).catch(()=>{
              this.$Message.error('请检查网络连接！')
              this.loading = false
            })
          }
      }
    }
</script>

<style scoped lang="scss">
  @import 'failProject';
</style>
