<template>
  <div class="wrapper">
    <div class="inwrapper">
      <div id="piechart"></div>
      <div id="barchart"></div>
    </div>
  </div>
</template>

<script >
  let echarts = require('echarts')
  export default {
    name: 'statistic',
    data() {
      return {
        //theme2: 'dark',
      };
    },
    mounted() {
      this.drawLine();
    },
    methods: {
      drawLine()
      {
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
              data: [
                { value: 20, name: '已审核' },
                { value: 10, name: '未审核' },
                { value: 4, name: '待初审' },
                { value: 13, name: '已驳回' },
                { value: 8, name: '已通过' }
              ]
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
            data: ['人文', '经管', '理工', '计算机', '数学系', '通信']
          },
          yAxis: {},
          series: [{
            name: '项目个数',
            type: 'bar',
            data: [5, 20, 36, 10, 10, 20]
          }]
        });
      }
    }
  }
</script>

<style scoped lang="scss">
  @import "statistic";
</style>
