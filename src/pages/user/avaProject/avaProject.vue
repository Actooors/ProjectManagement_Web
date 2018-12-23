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
      title="申报项目"
      width="700"
      maxHeight="800"
      :mask-closable="false"
      ref="modal"
      @on-cancel="cancel"
    >
      <!--对话框中内容-->
      <Steps :current="stepIndex" size="small" style="padding-left: 80px">
        <Step :title="title1" content="阅读协议"></Step>
        <Step :title="title2" content="填写团队成员信息"></Step>
        <Step :title="title3" content="上传申报书"></Step>
      </Steps>
      <Carousel
        ref="carousel"
        v-model="stepIndex"
        dots="none"
        :height="600"
        arrow="never"
        v-if="model1"
      >
        <CarouselItem>
          <div class="step1">
            <div class="title">请阅读以下协议</div>
            <div class="content">
              协议书有广义和狭义之分。广义的协议书是指社会集团或个人处理各种社会关系、事务时常用的“契约”类文书，包括合同、议定书、条约、公约、联合宣言、联合声明、条据等。狭义的协议书指国家、政党、企业、团体或个人就某个问题经过谈判或共同协商，取得一致意见后，订立的一种具有经济或其它关系的契约性文书。协议书是应用写作的重要组成部分。
              协议书是社会生活中，协作的双方或数方，为保障各自的合法权益，经双方或数方共同协商达成一致意见后，签订的书面材料。协议书是契约文书的一种。是当事人双方（或多方）为了解决或预防纠纷，或确立某种法律关系，实现一定的共同利益、愿望，经过协商而达成一致后，签署的具有法律效力的记录性应用文。
              第四条 广告和展览会
              为促进产品在该地区的销售，代理人应刊登一切必要的广告并支付广告费用。凡参加展销会需经双方事先商议后办理。
              第五条 代理人对用户的财务责任
              代理人应采取适当方式了解当地订货人的支付能力并协助制造商收回应付货款。通常的索款及协助收回应付货款的开支应由制造商负担。
              未经同意，代理人无权也无义务以制造商的名义接受付款。
              第六条 用户的意见、代理人的作用
              代理人有权接受用户对产品的意见和申诉，及时通知制造商并关注制造商的切身利益为宜。
              第七条 向制造商不断提供信息
              代理人应尽力向制造商提供商品的市场和竞争等方面的信息，每4个月需向制造商寄送工作报告。
              第八条 保证不竞争
              代理人不应与制造商或帮助他人与制造商竞争，代理人更不应制造代理产品或类似于代销的产品，也不应从与制造商竞争的任何企业中获利。同时，代理人不应代理或销售与代理产品相同或类似的（不论是新的或旧的）任何产品。
              此合约一经生效，代理人应将与其他企业签订有约束性的协议告知制造商。不论是作为代理的或经销的，此后再签订的任何协议均应告知制造商，代理人在进行其他活动时，决不能忽视其对制造商承担的义务而影响任务的完成。
              本协议规定在此协议终止后的5年内，代理人不能生产和销售同类产品予以竞争，本协议终止后的1年内，代理人也不能代理其他类似产品，予以竞争。
              所有产品设计和说明均属制造商所有，代理人应在协议终止时归还给制造商。
              第九条 保密
              代理人在协议有效期内或协议终止后，不得泄露制造商的商业机密，也不得将该机密超越协议范围使用。　第十条 分包代理人
              代理人事先经制造商同意后可聘用分包代理人，代理人应对该分包代理人的活动负全部责任。
              第十一条 工业产权的侵犯
              代理人应视察市场，如发现第三方侵犯制造商的工业产权或有损于制造商利益的任何非法行为，代理人应据实向制造商报告。代理人应尽最大努力并按照制造商的指示，帮助制造商使其不受这类行为的侵害，制造商将承担正常代理活动以外的此类费用。
              第十二条 代理人独家销售权的范围
              制造商不得同意他人在该地区取得代理或销售协议产品的权力。制造商应把其收到的直接来自该地区用户的订单通知代理人。代理人有权按第十五条规定获得该订单的佣金。
              第十三条 向代理人不断提供信息
              为促进代理活动，制造商应向代理人提供包括销售情况、价目表、技术文件和广告资料等一切必要的信息。制造商应将产品价格、销售情况或付款方式的任何变化及时通知代理人。
              第十四条 技术帮助
              制造商应帮助代理人的雇员获得代理产品的技术知识。代理人应支付其雇员往返交通费及工资，制造商应提供食宿。
              第十五条 佣金额
              代理人的佣金以每次售出并签字的协议产品为基础，其收佣百分比如下：　___________美元按____%收佣　___________美元按____%收佣
              第十六条 平分佣金
              两个不同地区的两个代理人为争取订单都作出极大努力，当订单于某一代理人所在地，而供货之制造厂位于另一代理人所在地时，则佣金由两个代理人平均分配。
              第十七条 商事失败、合约终止
              代理人所介绍的询价或订单，如制造商不予接受则无佣金。若代理人所介绍的订单合约已中止，代理人无权索取佣金，若该合约的中止是由于制造商的责任，则不在此限。
              第十八条 计算佣金的方法
              佣金以发票金额计算，任何附加费用如包装费、运输费、保险费、海关税或由进口国家征收的关税等应另开发票。
              第十九条 佣金的索取权
              代理人有权根据每次用户购货所支付的货款按比例收取佣金。如用户没有支付全部货款，则根据制造商实收货款按比例收取佣金，若由于制造商的原因用户拒付货款，则不在此限。
              第二十条 支付佣金的时间
              制造商每季度应向代理人说明佣金数额和支付佣金的有关商务，制造商在收到货款后，应在30天内支付佣金。
              第二十一条 支付佣金的货币
              佣金按成交的货币来计算和支付。
              第二十二条 排除其他报酬
              代理人在完成本协议之义务时所发生的全部费用，除非另有允诺，应按第十九条之规定支付佣金。　第二十三条 协议期限
              本协议在双方签字后生效，协议执行1年后，一方提前3个月通知可终止协议。如协议不在该日终止，可提前3个月通知，于下1年的12月30日终止。
              第二十四条 提前终止
              如第二十三条规定，任何一方都无权提前终止本协议。除非遵照适用的________法律具有充分说服力的理由方能终止本协议。
              第二十五条 文件的归还
              协议期满时，代理人应将第十三条中所述及的由制造商提供的全部广告资料及所有文件归还给制造商。　第二十六条 存货的退回
              协议期满时，代理人若储有代理产品和备件，应按制造商指示退回，费用由制造商负担。
              第二十七条 未完之商务
              协议到期时，由代理人提出终止但在协议期满后又执行协议，应按第十五款支付代理人佣金。代理人届时仍应承担履行协议义务之职责。
              第二十八条 赔偿　协议因一方违约而终止外，由于协议终止或未能重新签约，则不予赔偿。
              第二十九条 适用法律　本协议适用于制造商总部____________所在国之现行法律。　第三十条
              仲裁　因执行本协议而发生的任何争执应根据______的法律_________仲裁解决。投诉方和被投诉方应各指定一名仲裁员，双方应提名一位公证人。　如两名仲裁员在30天内未能就提名一位主席达成协议，仲裁应有权提名第三名仲裁员为主席。仲裁所作出的裁决是终局的，对双方均有约束力。
              第三十一条 变更　本协议的变更或附加条款，应以书面形式为准。　第三十二条 禁止转让　本协议未经事先协商不得转让。
              第三十三条 留置权　代理人对制造商的财产无留置权。　第三十四条 无效条款　如协议中的一条或一条以上的条款无效，协议其余条款仍然有效。　本协议一式二份，双方各执一份。
              注：　生产单位或生产企业委托中间商在任何地区或市场销售其全部产品，称销售代理商。在销售代理协议中应明确规定委托方和代理销售商的权利和义务。委托方授予代理销售商全权经营权利，在执行协议的期间内，不得再委托另外代理商销售同类产品。代理销售商在推销其商品时在一定时期内有一定的售价决定权并且在规定的时间内必须完成一定的销售额或销售量。除此之外，代理销售商还负责刊登商品广告、举办陈列展销，促进销售业务，其中按比例收取佣金。对于生产单位规模较小，资金有限而产品又有竞争能力的产品但又无销售渠道的生产企业宜采用这种方式将产品打入国际市场。
              <div>
                <div class="radio">
                  <Radio v-model="read" @on-change="agreed">我已经阅读此协议，并且同意上述协议</Radio>
                </div>
                <div class="step1button">
                  <Button type="primary" :disabled="step1disable" @click.native="nextStep">
                    下一步
                    <Icon type="ios-arrow-forward"/>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CarouselItem>
        <CarouselItem>
          <div class="step2">
            <div class="content">
              <Card v-for="(item,index) in items" :key="index" style="width: 70%;margin: 20px auto 0 auto">
                <p slot="title">
                  <Icon type="ios-people"/>
                  合作者{{index + 1}}
                </p>
                <div slot="extra">
                  <Button type="error" size="small" @click="delPartner(index)">删除</Button>
                </div>
                <Form :label-width="80" style="width: 100%">
                  <FormItem label="合作者姓名" prop="item.name">
                    <Input v-model="item.name" placeholder="输入合作者姓名"></Input>
                  </FormItem>
                  <FormItem label="合作者性别" prop="item.gender">
                    <RadioGroup v-model="item.gender">
                      <Radio label="男"></Radio>
                      <Radio label="女"></Radio>
                    </RadioGroup>
                  </FormItem>
                  <FormItem label="合作者手机" prop="item.telphone">
                    <Input v-model="item.telphone"></Input>
                  </FormItem>
                </Form>
              </Card>
              <div class="addPartner">
                <Button type="dashed" @click="handleAdd" icon="md-add" style="margin-top: 20px;text-align: center;">
                  添加合作者
                </Button>
                <Button type="primary" @click.native="nextStep" style="margin-top: 20px;margin-left: 20px">
                  下一步
                  <Icon type="ios-arrow-forward"/>
                </Button>
              </div>
            </div>
          </div>
        </CarouselItem>
        <CarouselItem>
          <div class="step3">
            <div class="content">
              <div class="upload">
                <Upload
                  class="upload"
                  multiple
                  type="drag"
                  @on-success="uploadSuccess"
                  action="//jsonplaceholder.typicode.com/posts/">
                  <div style="padding: 20px 0">
                    <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
                    <p>点击或将项目申报书拖拽到此处即可上传</p>
                  </div>
                </Upload>
              </div>
              <div class="allSuccess">
                <Button type="primary" long :disabled="allSuccess" @click.native="finish"
                        style="margin-top: 20px;margin-left: 20px">
                  完成
                </Button>
              </div>
            </div>
          </div>
        </CarouselItem>
      </Carousel>
      <!--对话框底部自定义插槽-->
      <div slot="footer">
      </div>
    </Modal>
  </div>
</template>

<script>
  import axios from 'axios'

  export default {
    name: "avaProject",
    data() {
      return {
        loading: false,
        model1: false,
        stepIndex: 0,
        read: false,
        step1disable: true,
        allSuccess: true,
        title1: '进行中',
        title2: '待进行',
        title3: '待进行',
        name: '',
        gender: '',
        telphone: '',
        items: [
          {
            name: '李瑞轩',
            gender: '男',
            telphone: '18101971575'
          }
        ],
        columns: [
          {
            title: '项目类别',
            key: 'type',
            align: 'center',
            width: 250,
          },
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
            deadLine:"2019-12-31",
            introduce:"有关生物化学方面的研究课题",
            projectName:"生物化学类",
            type:"生物化学类"
          }
        ]
      };
    },
    methods: {
      initData() {
        axios({
          url: apiRoot + '/user/AllAviProjectCategory',
          method: 'get'
        }).then((res) => {
          console.log(res.data)
          for (var i = 0; i < res.data.data.length; i++) {
            this.data1[i].type = res.data.data[i].type;
            this.data1[i].introduce = res.data.data[i].introduce;
            this.data1[i].projectName = res.data.data[i].projectName;
            this.data1[i].deadLine = res.data.data[i].deadLine;
          }
        })
      },
      uploadSuccess() {
        this.$Message.success("上传成功！");
        this.allSuccess = false
      },
      cancel() {
        this.model1 = false
      },
      download(index) {
        this.$Message.info('点击下载文件')
      },
      declare(index) {
        this.$Message.info('点击申报')
        this.model1 = true
        this.$nextTick(() => {
          this.$forceUpdate(this.$refs.modal);
        })
      },
      agreed() {
        this.step1disable = false
      },
      handleAdd() {
        this.items.push({
          name: '',
          gender: '',
          telphone: ''
        })
      },
      delPartner(index) {
        this.items.splice(index, 1)
      },
      finish() {
//        请求后端
        this.model1 = false;
        this.$Message.success("申报成功！请耐心等待审核！")
      },
      nextStep() {
        this.stepIndex = this.stepIndex + 1
        if (this.stepIndex === 0) {
          this.title1 = '进行中'
          this.title2 = '待进行'
          this.title3 = '待进行'
        } else if (this.stepIndex === 1) {
          this.title1 = '已完成'
          this.title2 = '进行中'
          this.title3 = '待进行'
        } else if (this.stepIndex === 2) {
          this.title1 = '已完成'
          this.title2 = '已完成'
          this.title3 = '进行中'
        }
      }
    },
    created() {
      this.initData()
    }
  }
</script>

<style scoped lang="scss">
  @import "avaProject";
</style>
