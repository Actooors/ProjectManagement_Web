<template>
  <div class="wrapper">
    <ButtonGroup class="operation">
      <Button type="success" icon="md-refresh" @click="Refresh" size="large" ghost>
        刷新
      </Button>
    </ButtonGroup>
    <Tabs class="tabs">
      <TabPane label="已立项" name="1" size="large" icon="md-apps">
        <Table stripe border :columns="columns" :loading="loading" :data="data1" table="table" size="large"
               height="750"></Table>
      </TabPane>
      <TabPane label="未立项" name="2" size="large" icon="md-bookmarks">
        <Table stripe border :columns="columns" :loading="loading" :data="data2" table="table" size="large"
               height="750"></Table>
      </TabPane>
    </Tabs>

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
                key: 'time',
                align: 'center',
                width: 200,
              },
              {
                title: '项目简介',
                key: 'description',
                align: 'center',
                tooltip: true
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
            data2: []
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
              url: apiRoot + '/user/failProject',
              method: 'get'
            }).then((res) => {
              if (res.data.code === 'SUCCESS') {
                console.log(res.data)
                this.data1 = res.data.data.failProgressProjects;
                this.data2 = res.data.data.failApplicationProjects;
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
