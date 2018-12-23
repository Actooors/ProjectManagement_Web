<template>
  <div class="wrapper">
    <ButtonGroup class="operation">
      <Button type="success" :loading="loading" icon="md-refresh" @click="loading=!loading" size="large" ghost>
        刷新
      </Button>
    </ButtonGroup>
    <!--<Table stripe border :columns="columns" :data="data1" class="table" height="750" size="large"></Table>-->
    <Table stripe border :columns="columns" :data="data1" class="table" size="large"  height="750"></Table>
  </div>
</template>

<script>
  export default {
    name: "reqProject",
    data() {
      return {
        loading:false,
        columns: [
          {
            title: '项目名称',
            key: 'projectName',
            align: 'center',
            width: 250,
          },
          {
            title: '截止日期',
            key: 'deadLine',
            align: 'center',
            width: 200,
          },
          {
            title: '项目简介',
            key: 'introduce',
            align: 'center'
          },
          {
            title: '项目状态',
            key: 'status',
            width: 100,
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
                    type: 'info'
                  },
                  on: {
                    click: () => {
                      this.$Message.info('点击查看详情')
                    }
                  }
                }, '详情')
              ])
            }
          }
        ],
        data1: [
          {
            projectName: '项目1',
            deadLine: '2019-01-01',
            introduce: '本项目为个人消费借款项目，对接的资产是由多笔个人借款组成的资产包。资产提供方：该项目由国内某知名消费金融科技公司提供，累计放款金额过百亿，公司信誉良好，出借人可安心出借。',
            status: '审核中'
          },
          {
            projectName: '项目2',
            deadLine: '2019-01-01',
            introduce: '本项目为个人消费借款项目，对接的资产是由多笔个人借款组成的资产包。资产提供方：该项目由国内某知名消费金融科技公司提供，累计放款金额过百亿，公司信誉良好，出借人可安心出借。',
            status: '审核中'
          },
          {
            projectName: '项目3',
            deadLine: '2019-01-01',
            introduce: '本项目为个人消费借款项目，对接的资产是由多笔个人借款组成的资产包。资产提供方：该项目由国内某知名消费金融科技公司提供，累计放款金额过百亿，公司信誉良好，出借人可安心出借。',
            status: '审核失败'
          },
          {
            projectName: '项目4',
            deadLine: '2019-01-01',
            introduce: '本项目为个人消费借款项目，对接的资产是由多笔个人借款组成的资产包。资产提供方：该项目由国内某知名消费金融科技公司提供，累计放款金额过百亿，公司信誉良好，出借人可安心出借。',
            status: '审核中'
          },
          {
            projectName: '项目5',
            deadLine: '2019-01-01',
            introduce: '本项目为个人消费借款项目，对接的资产是由多笔个人借款组成的资产包。资产提供方：该项目由国内某知名消费金融科技公司提供，累计放款金额过百亿，公司信誉良好，出借人可安心出借。',
            status: '审核中'
          },
        ]
      }
    }
  }
</script>

<style scoped lang="scss">
  @import "reqProject";
</style>
