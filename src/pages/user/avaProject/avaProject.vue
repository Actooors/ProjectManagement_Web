<template>
  <div class="wrapper">
    <ButtonGroup class="operation">
      <Button type="success" icon="md-refresh" @click="Refresh" size="large" ghost>
        刷新
      </Button>
    </ButtonGroup>
    <Table stripe border :loading="loading" :columns="columns" :data="data1" class="table" height="750"
           size="large"></Table>
    <Modal
      v-model="model1"
      title="申报项目"
      width="700"
      maxHeight="800"
      :mask-closable="false"
      ref="modal"
      @on-cancel="projectCancel"
      fullscreen
    >
      <!--对话框中内容-->
      <Steps :current="stepIndex" size="small" class="steps">
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
              为了在全校范围内营造激励创造、激发创新的氛围，让全校师生不断提高科学研究和技术开发的创新能力，同时为了加强学校知识产权的保护和管理，防止学校无形资产的流失，按照国家知识产权法律法规和上海大学保护知识产权的相关规定，学生应在参与学校的科学研究和技术开发项目之前签署知识产权保护承诺书。如不签署，导师可以代表学校拒绝其参加有关涉及知识产权保密要求的科学研究和技术开发项目。以下内容请认真阅读并承诺遵守。
              一、知识产权归属
              学生在校期间完成上海大学的任务或者主要利用上海大学的物质技术条件所产生的学术成果和科技成果，是职务成果，其知识产权归上海大学所有。利用上海大学的物质技术条件是指利用上海大学的资金、各种以上海大学名义申请获准的项目经费、设备、原材料、无形资产及尚未对外公开的技术或商业秘密等资源。
              二、学生的主要权利
              上海大学依法保护学生在校期间应享有的相关权益。学生参与学校的科学研究和技术开发项目，可以获得科技成果发明人、设计人署名权，以及各类学术成果的署名权。学生在学或毕业后利用在校所获职务成果创业, 按照上海大学知识产权管理办法执行。
              三、学生的主要责任
              学生在校期间参与学校及协作单位的科学研究和技术开发项目，对接触到的相关技术或商业秘密将承担知识产权全面保护与保密责任。保密的范围，包括但不限于学生在参加上海大学科学研究和技术开发工作中接触到的各种未对外公开的资料、数据、图表及其电子文档。
              学生在校期间发表论文如果采用参与学校科学研究和技术开发项目中接触到的相关技术或涉及商业秘密的，须征得导师同意，并以上海大学的名称发表成果。申请专利的，必须经过导师的审查，且其专利拥有人为上海大学。
              其他参与的科学研究和技术开发项目属于涉密情形的，学生将严格遵守《中华人民共和国保守国家秘密法》、科学技术部《科学技术保密规定》等保密法律法规以及上海大学已经公布实施的相关保密规定。保密的期限至相应的秘密信息被公开为止（涉密文件另有规定的除外）。
              学生因毕业、出国、退学等原因离开上海大学，在离校前应当返还全部技术资料及实验器材，包括：计算机软件、实验材料、实验仪器设备、实验报告、实验记录、图纸、声像资料、参考文献等。研究生不得擅自发表、泄漏、使用或转让上述资料与器材。
              四、其他事项
              该文本将作为档案文件，提交学校相应管理部门备查。
              其他未尽事项，应当遵守知识产权法等法律法规规定。
              以上各项内容，本人已经阅读并同意承诺：如果发生违反上述告知的行为，将自愿承担相应的纪律处分直至法律责任。
              <div style="margin-top: 10px">
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
              <div class="isMeeting">
                <span>该项目是否参加上会&nbsp;&nbsp;&nbsp;</span>
                <RadioGroup v-model="isMeeting">
                  <Radio label="true" disabled>是</Radio>
                  <Radio label="false" disabled>否</Radio>
                </RadioGroup>
              </div>
              <Card style="width: 50%;margin: 20px auto 0 auto">
                <p slot="title">
                  <Icon type="ios-people"/>
                  项目负责人
                </p>
                <Form :label-width="120" style="width: 100%">
                  <FormItem label="负责人学/工号">
                    <Input readonly :value="official.userId" placeholder="暂无合作者学/工号"></Input>
                  </FormItem>
                  <FormItem label="负责人姓名">
                    <Input readonly :value="official.userName" placeholder="暂无合作者姓名"></Input>
                  </FormItem>
                  <FormItem label="负责人单位">
                    <Input readonly :value="official.department" placeholder="暂无合作者单位"></Input>
                  </FormItem>
                  <FormItem label="负责人手机">
                    <Input readonly :value="official.phone" placeholder="暂无合作者手机"></Input>
                  </FormItem>
                  <FormItem label="负责人邮箱">
                    <Input readonly :value="official.mail" placeholder="暂无合作者邮箱"></Input>
                  </FormItem>
                </Form>
              </Card>
              <Card v-for="(item,index) in items" :key="index" style="width: 50%;margin: 20px auto 0 auto">
                <p slot="title">
                  <Icon type="ios-people"/>
                  合作者{{index + 1}}
                </p>
                <div slot="extra">
                  <Button type="error" size="small" @click="delPartner(index)">删除</Button>
                </div>
                <Form :label-width="120" style="width: 100%">
                  <FormItem label="合作者学/工号" prop="item.userId">
                    <AutoComplete v-model="item.userId" @on-search='searchUserInfo'
                                  @on-select="selectUserInfo(index,data2[0])"
                                  :data="data2"
                                  clearable
                                  placeholder="输入合作者学/工号"></AutoComplete>
                  </FormItem>
                  <FormItem label="合作者姓名" prop="item.userName">
                    <Input v-model="item.userName" clearable placeholder="输入合作者姓名"></Input>
                  </FormItem>
                  <FormItem label="合作者单位" prop="item.department">
                    <Input v-model="item.department" clearable placeholder="输入合作者单位"></Input>
                  </FormItem>
                  <FormItem label="合作者手机" prop="item.phone">
                    <Input v-model="item.phone" clearable :maxlength='11' placeholder="输入合作者手机"></Input>
                  </FormItem>
                  <FormItem label="合作者邮箱" prop="item.mail">
                    <Input v-model="item.mail" clearable placeholder="输入合作者邮箱" type="email"></Input>
                  </FormItem>
                </Form>
              </Card>
              <div class="addPartner">
                <Button type="primary" @click.native="previousStep" style="margin-top: 20px;margin-right: 20px">
                  <Icon type="ios-arrow-back"/>
                  上一步
                </Button>
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
              <div class="projectTitle">
                项目名称：
                <Input v-model="projectName" :rows="1" placeholder="请输入项目名称"/>
              </div>
              <div class="description">
                对该项目进行简单描述(200字以内):
                <Input v-model="description" type="textarea" :rows="4" placeholder="对该项目进行简单描述(200字以内)"
                       :maxlength="200"/>
              </div>
              <div class="projectMoney">
                该项目的经费额度为<span style="font-weight: bold">{{this.projectMaxMoney}}元</span>，请预算后申报项目需要经费：
                <InputNumber :max="this.projectMaxMoney" :min="0" v-model="declaredAmount"></InputNumber>&nbsp;元
              </div>
              <div class="upload">
                上传项目申报书:
                <Upload
                  type="drag"
                  :headers="uploadHeaders"
                  :on-success="uploadSuccess"
                  action="http://itproject.shu.edu.cn/api/file/upload">
                  <div style="padding: 20px 0">
                    <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
                    <p>点击或将项目申报书拖拽到此处即可上传(注意只能是单文件)</p>
                  </div>
                </Upload>
              </div>
              <div class="allSuccess">
                <Button type="primary" @click.native="previousStep" style="margin-top: 20px;margin-right: 20px">
                  <Icon type="ios-arrow-back"/>
                  上一步
                </Button>
                <Button type="success" long :disabled="allSuccess" @click.native="finish"
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
  import download from '../../../assets/js/download'

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
        uploadHeaders: {
          Authorization: localStorage.getItem('token')
        },
        official: {
          userId: '',           //负责人学工号
          userName: '',         //负责人姓名
          department: '',   //负责人单位
          phone: '',        //负责人手机
          mail: '',         //负责人邮箱
        },

        projectId: '',       //项目id
        projectName: '',     //项目名称
        description: '',    //项目简介
        uploadAddress: '',  //申报书上传之后的地址
        isMeeting: 'false', //是否上会
        projectMaxMoney: null,  //项目经费额度
        declaredAmount: null, //项目申报的经费
        items: [],
        columns: [
          {
            title: '项目类别',
            key: 'type',
            align: 'center',
          },
          {
            title: '项目名称',
            key: 'projectName',
            align: 'center',
          },
          {
            title: '截止日期',
            key: 'deadLine',
            align: 'center',
          },
          {
            title: '项目简介',
            key: 'introduce',
            align: 'center',
            tooltip: true
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
                }, '申报书模板'),
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
        data1: [],
        data2: []
      };
    },
    mounted() {
      this.initData("初始化成功！")
      this.initInfo()
    },
    methods: {
      initInfo(msg) {
        axios({
          url: apiRoot + '/user/userInfo/1',
          method: 'get',
        }).then((res) => {
          if (res.data.code === 'SUCCESS') {
            this.official.department = res.data.data.department;
            this.official.phone = res.data.data.phone;
            this.official.mail = res.data.data.mail;
          }
        }).catch((err) => {
          console.log("!!!!!")
          console.error(err)
          this.$Message.error("请检查网络!")
        })
        console.log('localStorage', localStorage)
        this.official.userId = localStorage.getItem('userid');
        this.official.userName = localStorage.getItem('username');
        console.log('official:', this.official)
      },
      Refresh() {
        this.initData('刷新成功!');
      },
      initData(msg) {
        this.loading = true
        axios({
          url: apiRoot + '/user/AllAviProjectCategory',
          method: 'get'
        }).then((res) => {
          if (res.data.code === 'SUCCESS') {
            console.log(res.data)
            this.$Message.success(msg)
            this.data1 = res.data.data;
            this.loading = false;
          } else {
            this.$Message.error(res.data.message)
            this.loading = false;
          }
        }).catch(() => {
          this.$Message.error('初始化失败,请检查网络！')
          this.loading = false;
        })
      },
      uploadSuccess(response) {
        console.log("success", response)
        this.uploadAddress = response.data
        this.$Message.success("上传成功！");
        console.log('uploadAddress:', this.uploadAddress)
        this.allSuccess = false
      },
      projectCancel() {
        this.stepIndex = 0
        this.projectName = null
        this.declaredAmount = null
        this.description = null
        this.read = false
        this.step1disable=true
        this.items.splice(0, this.items.length)
        this.model1 = false
        this.title1 = '进行中'
        this.title2 = '待进行'
        this.title3 = '待进行'
      },
      download(index) {
        const that = this
        var filename = this.data1[index].downLoadAddress.split('---')[1]  //---后为文件名
        console.log(that.data1[index].downloadAddress)
        axios({
          url: that.data1[index].downLoadAddress,
          method: 'get',
          headers: {Authorization: localStorage.getItem('token')},
          responseType: 'blob'
        }).then((res) => {
          if (res.status === 200) {
            download(res.data, filename, "text/plain")
            this.$Message.success("下载成功！")
          } else {
            this.$Message.error("下载失败！")
          }
        }).catch(() => {
          this.$Message.error("下载失败，请检查网络连接！")
        })
      },
      declare(index) {
        this.projectId = this.data1[index].projectId
        this.projectMaxMoney = parseInt(this.data1[index].projectMaxMoney)
        this.isMeeting = this.data1[index].isMeeting
        this.model1 = true
      },
      agreed() {
        this.step1disable = false
      },
      handleAdd() {
        this.items.push({
          userId: '',
          userName: '',
          department: '',
          phone: '',
          mail: ''
        })
      },
      delPartner(index) {
        this.items.splice(index, 1)
      },
      finish() {
        this.items.unshift(this.official)
        console.log("members:", this.items)
        axios({
          url: apiRoot + '/user/applyProject',
          method: 'post',
          data: {
            projectCategoryId: this.projectId,
            projectName: this.projectName,
            members: this.items,
            description: this.description,
            uploadAddress: this.uploadAddress,
            projectMoney: this.declaredAmount,   //用户自己申报的经费
            isMeeting: this.isMeeting,
          }
        }).then((res) => {
          if (res.data.code === 'SUCCESS') {
            console.log(res.data)
            this.model1 = false;
            this.$Message.success("申报成功！请耐心等待审核！")
            this.projectCancel()
          } else {
            this.$Message.error(res.data.message);
          }
        })
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
      },
      previousStep() {
        this.stepIndex = this.stepIndex - 1
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
      },
      searchUserInfo(value) {
        this.data2 = ['查询中...']
        if (value.length === 8) {
          axios({
            url: apiRoot + '/user/userInfoFromId/' + value,
            method: 'get'
          }).then((res) => {
            if (res.data.code === 'SUCCESS') {
              this.data2 = !value ? [] : [
                res.data.data.userId + '-' + res.data.data.username + '-' + res.data.data.department
              ];
            } else {
              this.data2 = ['暂无此人']
            }
          }).catch(() => {
            this.data2 = ['查询失败']
          })
        } else {
          this.data2 = ['请输入正确的学号']
        }
      },
      selectUserInfo(index, value) {
        if (value === '请输入正确的学号' || value === '查询失败' || value === '暂无此人' || value === '查询中...') {
          this.items[index].userId = ''
          this.items[index].userName = ''
          this.items[index].department = ''
        } else {
          var id = value.split("-")[0]   //用户学/工号
          var name = value.split("-")[1] //用户姓名
          var dep = value.split("-")[2]  //用户部门
          console.log(value, id, name, dep)
          setTimeout(() => {
            this.items[index].userId = id
            this.items[index].userName = name
            this.items[index].department = dep
          })
        }
      }
    }
  }
</script>

<style scoped lang="scss">
  @import "avaProject";
</style>
