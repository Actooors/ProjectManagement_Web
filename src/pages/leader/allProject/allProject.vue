<!--<template lang="pug">
  div(class="abc")
    a(href="http://www.baidu.com") 这是链接
    div 这是另一个div
    Button(
    @click="hhh"
    ) 这是Button
</template>-->
<template>
  <div class="wrapper">
    <div class="operation">
      <ButtonGroup>
        <Button type="success" :loading="loading" icon="md-refresh" @click="loading=!loading" size="large" ghost>
          刷新
        </Button>
      </ButtonGroup>
    </div>
    <Table stripe border :columns="columns1" :data="data1" size="large" class="table"></Table>
  </div>
</template>

<script>
  export default {
    name: "allProject",
    data() {
      return {
        loading: false,
        columns1: [
          {
            title: '项目名称',
            key: 'projectName',
            align: 'center',
          },
          {
            title: '项目类别',
            key: 'type',
            align: 'center',
          },
          {
            title: '项目状态',
            key: 'status',
            align: 'center',
          },
          {
            title: '截止日期',
            key: 'deadLine',
            align: 'center',
            width: 200,
          },
          {
            title: '项目负责人',
            key: 'projectLeader',
            align:'center'
          }
        ],
        data1: [
          {
            projectName: '项目1',
            type: '人文',
            status: '已驳回',
            deadLine: '2019-1-1',
            projectLeader: '张老师'
          },
          {
            projectName: '项目2',
            type: '人文',
            status: '已驳回',
            deadLine: '2019-1-1',
            projectLeader: '刘老师'
          },
          {
            projectName: '项目3',
            type: '经管',
            status: '已驳回',
            deadLine: '2018-12-25',
            projectLeader: '领导丙'
          },
          {
            projectName: '项目4',
            type: '人文',
            status: '已驳回',
            deadLine: '2019-3-1',
            projectLeader: '领导乙'
          },
          {
            projectName: '项目5',
            type: 'CES',
            status: '已通过',
            deadLine: '2019-1-1',
            projectLeader: '领导甲'
          }
        ]
      }
    }
  }
</script>

<style scoped lang="scss">
  @import 'allProject';
</style>
