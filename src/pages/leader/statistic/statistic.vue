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
      this.initProjectData('更新项目信息成功!')
    },
    methods: {
      initProjectData: function (msg) {

        var myPieChart = echarts.init(document.getElementById('piechart'));
        var myBarChart = echarts.init(document.getElementById('barchart'));
        var statistic = [];
        var names = [];
        var nums = [];

        axios({
          url: apiRoot + '/leader/dataStatistics',
          method: 'get'
        }).then((res) => {
          if (res.data.code === 'SUCCESS') {

            for (let i = 0; i < res.data.data.projectStatistic.length; i++) {
              statistic.push(res.data.data.projectStatistic[i]);
            }
            for (let i = 0; i < res.data.data.projectTypeList.length; i++) {
              names.push(res.data.data.projectTypeList[i].type);
              nums.push(res.data.data.projectTypeList[i].num);
            }

            myPieChart.setOption({
              title: {
                text: '项目状态统计',
                x: 'center'
              },
              tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
              },
              series: [{
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
                data: statistic
              }]
            }),
              myBarChart.setOption({
                title: {
                  text: '项目数据统计结果',
                  x: 'center'
                },
                tooltip: {},
                xAxis: {
                  data: names
                },
                yAxis: {},
                series: [{
                  name: '项目个数',
                  type: 'bar',
                  data: nums
                }]
              })
            this.$Message.success(msg)
          } else {
            this.$Message.error('初始化图数据错误！')
          }
        }).catch(() => {
          this.$Message.error('请检查网络连接！')
        })
      }
    }
  }
</script>

<style scoped lang="scss">
  @import "statistic";
</style>
