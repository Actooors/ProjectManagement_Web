<template>
  <div class="wrapper">
    <div class="operation">
      <ButtonGroup>
        <Button type="success" :loading="loading" icon="md-refresh" @click="loading=!loading" size="large" ghost>
          刷新
        </Button>
      </ButtonGroup>
    </div>
    <div class="inwrapper">
      <div id="piechart"></div>
      <div id="barchart"></div>
    </div>
  </div>
</template>

<script>
  import axios from 'axios'
  let echarts = require('echarts')

  export default {
    name: 'statistic',
    data() {
      return {
        loading: false
      };
    },
    mounted() {
      this.drawLine()
      this.initProjectData('更新项目信息成功!')
    },
    methods: {
      drawLine() {
        var myPieChart = echarts.init(document.getElementById('piechart'));
        var myBarChart = echarts.init(document.getElementById('barchart'));
        myPieChart.setOption({
          title: {
            text: '项目状态统计',
            x: 'center'
          },
          tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
          },
          series: [
            {
              name: '项目状态',
              type: 'pie',
              radius: ['30%', '50%'],
              avoidLabelOverlap: false,
              label: {
                normal: {
                  show: false,
                  position: 'center'
                },
                emphasis: {
                  show: true,
                  textStyle: {
                    fontSize: '25',
                    fontWeight: 'bold'
                  }
                }
              },
              data: []
            }
          ]
        }),
        myBarChart.setOption({
          title: {
            text: '项目数据统计结果',
            x: 'center'
          },
          tooltip: {},
          xAxis: {
            data: []
          },
          yAxis: {},
          series: [{
            name: '项目个数',
            type: 'bar',
            data: []
          }]
        });
      },
      initProjectData(msg) {
        var myPieChart = echarts.init(document.getElementById('piechart'));
        var myBarChart = echarts.init(document.getElementById('barchart'));
//        axios({
//          url: apiRoot + '/leader/statisic',
//          method: 'get'
//        }).then((res) => {
//          if (res.data.code === 'SUCCESS') {
//            myPieChart.setOption({
//              series: [{
//                data: res.data.data.ProjectStatus
//                /*data: [
//                  { value: 2, name: '已审核' },
//                  { value: 10, name: '未审核' },
//                  { value: 4, name: '待初审' },
//                  { value: 13, name: '已驳回' },
//                  { value: 8, name: '已通过' }]*/
//              }]
//            }),
//            myBarChart.setOption({
//              xAxis: {
//                data: res.data.data.ProjectCategory
//                //data: ['人文', 'test', '理工', '计算机', '数学系', '通信']
//              },
//              series: [{
//                data: res.data.data.ProjectNums
//                //data: [5, 20, 36, 10, 10, 20]
//              }]
//            })
//            this.$Message.success(msg)
//          } else {
//            this.$Message.error('初始化图数据错误！')
//          }
//        }).catch(() => {
//          this.$Message.error('请检查网络连接！')
//        })
      }
    }
  }
</script>

<style scoped lang="scss">
  @import "statistic";
</style>
