<template>
  <div class="wrapper">
    <ButtonGroup class="operation">
      <Button type="success" :loading="loading" icon="md-refresh" @click="loading=!loading" size="large" ghost>
        刷新
      </Button>
    </ButtonGroup>
    <Table stripe border :columns="columns" :data="data1" class="table" height="750" size="large"></Table>
    <Modal
      v-model="model1"
      width="900"
      maxHeight="800"
      >
      <Steps :current="1" size="small">
        <Step title="已完成" content="阅读协议"></Step>
        <Step title="进行中" content="填写表单"></Step>
        <Step title="待进行" content="这里是该步骤的描述信息"></Step>
        <Step title="待进行" content="这里是该步骤的描述信息"></Step>
      </Steps>
      <Carousel
        ref="carousel"
        v-model="index"
        dots="none"
        :height="300"
        arrow="never">
        <CarouselItem>
          <div class="demo-carousel">这是第一页</div>
        </CarouselItem>
        <CarouselItem>
          <div class="demo-carousel">这是第二页</div>
        </CarouselItem>
        <CarouselItem>
          <div class="demo-carousel">这是第三页</div>
        </CarouselItem>
        <CarouselItem>
          <div class="demo-carousel">这是第四页</div>
        </CarouselItem>
      </Carousel>
    </Modal>
  </div>
</template>

<script>
  export default {
    name: "avaProject",
    data() {
      return {
        loading: false,
        model1: false,
        index:1,
        columns: [
          {
            title: '项目名称',
            key: 'projectName',
            align: 'center'
          },
          {
            title: '截止日期',
            key: 'deadLine',
            align: 'center'
          },
          {
            title: '项目简介',
            key: 'introduce',
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
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.download(params.index)
                    }
                  }
                }, '查看详细文档'),
                h('Button', {
                  props: {
                    type: 'primary',
                  },
                  on: {
                    click: () => {
                      this.declare(params.index)
                    }
                  }
                }, '申报')
              ])
            }
          }
        ],
        data1: [
          {
            projectName: '项目1',
            deadLine: '2019-01-01',
            introduce: '本项目为个人消费借款项目，对接的资产是由多笔个人借款组成的资产包。资产提供方：该项目由国内某知名消费金融科技公司提供，累计放款金额过百亿，公司信誉良好，出借人可安心出借。'
          },
          {
            projectName: '项目2',
            deadLine: '2019-01-01',
            introduce: '本项目为个人消费借款项目，对接的资产是由多笔个人借款组成的资产包。资产提供方：该项目由国内某知名消费金融科技公司提供，累计放款金额过百亿，公司信誉良好，出借人可安心出借。'
          },
          {
            projectName: '项目3',
            deadLine: '2019-01-01',
            introduce: '本项目为个人消费借款项目，对接的资产是由多笔个人借款组成的资产包。资产提供方：该项目由国内某知名消费金融科技公司提供，累计放款金额过百亿，公司信誉良好，出借人可安心出借。'
          },
          {
            projectName: '项目4',
            deadLine: '2019-01-01',
            introduce: '本项目为个人消费借款项目，对接的资产是由多笔个人借款组成的资产包。资产提供方：该项目由国内某知名消费金融科技公司提供，累计放款金额过百亿，公司信誉良好，出借人可安心出借。'
          },
          {
            projectName: '项目5',
            deadLine: '2019-01-01',
            introduce: '本项目为个人消费借款项目，对接的资产是由多笔个人借款组成的资产包。资产提供方：该项目由国内某知名消费金融科技公司提供，累计放款金额过百亿，公司信誉良好，出借人可安心出借。'
          },
        ]
      };
    },
    methods: {
      download(index) {
        this.$Message.info('点击下载文件')
      },
      declare(index) {
        this.$Message.info('点击申报')
        this.model1=true
      }
    },
    mounted(){
      this.$forceUpdate() //TODO
      // this.$nextTick(()=>{
      //   console.log(this.$refs.carousel)
      //   this.$refs.carousel.setAutoplay();
      //   // this.$forceUpdate()
      // })
    }
  }
</script>

<style scoped lang="scss">
  @import "avaProject";
</style>
