<template>
  <div class="wrapper">
    <div class="header">
      <ButtonGroup class="operation" shape="circle">
        <Button type="success" icon="md-refresh" @click.native="Refresh" size="large">
          刷新
        </Button>
        <!--        <Button type="primary" icon="md-add" @click.native="Add" size="large">-->
        <!--          添加-->
        <!--        </Button>-->
        <Button type="error" icon="md-close" @click.native="Delete" size="large">
          删除
        </Button>
      </ButtonGroup>
    </div>
    <Table stripe border :loading="loading" :columns="columns" :data="data1" class="table" height="520"
           size="large" @on-selection-change="updateSelectedList"></Table>
    <div style="margin: 10px 30px 20px 0px;overflow: hidden">
      <div style="float: right;">
        <Page :total="totalPage" :current="currentPage" @on-change="changePage"></Page>
      </div>
    </div>
    <Modal title="新增用户" v-model="modal_visible" v-if="modal_delay"
           :closable="false"
           width="450"
           :mask-closable="false">
      <Form :model="formItem" ref="formItem" :label-width="60" :rules="ruleValidate">
        <FormItem label="用户名" prop="userName">
          <Input v-model="formItem.userName" placeholder="输入用户名" clearable></Input>
        </FormItem>
        <FormItem label="账号" prop="userId">
          <Input v-model="formItem.userId" placeholder="输入用户账号" clearable></Input>
        </FormItem>
        <FormItem label="密码" prop="password">
          <Tooltip content="点击按钮生成随机8位密码" placement="bottom-end" style="width:100%">
            <div style="display: flex;">
              <Input v-model="formItem.password" placeholder="输入用户密码" clearable></Input>
              <Button @click.native="genPassword" type="primary" style="margin-left: 10px">生成</Button>
            </div>
          </Tooltip>
        </FormItem>
        <FormItem label="身份" prop="identity">
          <CheckboxGroup v-model="formItem.identity" @on-change="selectedArr">
            <Checkbox label="user">用户</Checkbox>
            <Checkbox label="principal">业务员</Checkbox>
            <Checkbox label="leader">领导</Checkbox>
            <Checkbox label="expert">审核专家</Checkbox>
            <Checkbox label="admin">管理员</Checkbox>
          </CheckboxGroup>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button @click="cancel_add">取消</Button>
        <Button type='primary' @click="ok_add">确定</Button>
      </div>
    </Modal>
    <Modal title="请选择业务员所对应的领导" v-model="select_leader" v-if="select_leader_delay" class="select_leader"
           :closable="false" :mask-closable="false">
      <Select v-model="leaderId">
        <Option v-for="item in leader_list" :value="item.userId" :key="item.userId">
          {{item.userName}} — {{item.department}}
        </Option>
      </Select>
      <div slot="footer">
        <Button @click="cancel_select">取消</Button>
        <Button type='primary' @click="ok_select">确定</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  import axios from 'axios'

  export default {
    name: "userManage",
    data() {
      return {
        loading: false,
        totalPage: 0,
        currentPage: 1,
        newpwd: null,
        modal_visible: false,
        identity_arr: [],
        selected_list: [],
        tmp_arr: [],
        modal_delay: false,
        select_leader: false,
        select_leader_delay: false,
        leaderId: null,
        leader_list: [],
        formItem: {
          userId: '',
          userName: '',
          identity: [],
          password: ''
        },
        ruleValidate: {
          userName: [
            {required: true, message: '用户名不能为空', trigger: 'blur'}
          ],
          userId: [
            {required: true, message: '用户账号不能为空', trigger: 'blur'}
          ],
          identity: [
            {required: true, type: 'array', message: '至少选择一个用户身份', trigger: 'blur'}
          ],
          password: [
            {required: true, message: '密码不能为空', trigger: 'blur'}
          ]
        },
        columns: [
          {
            type: 'selection',
            width: 60,
            align: 'center'
          },
          {
            title: "用户身份",
            key: 'identity',
            align: 'center',
            filters: [
              {
                label: '用户',
                value: 1
              },
              {
                label: '业务员',
                value: 2
              },
              {
                label: '领导',
                value: 3
              }, {
                label: '审核专家',
                value: 4
              },
              {
                label: '管理员',
                value: 5
              }
            ],
            filterMultiple: true,
            filterMethod(value, row) {
              if (value === 1) {
                return row.identity.indexOf('用户') != -1;
              } else if (value === 2) {
                return row.identity.indexOf('业务员') != -1;
              } else if (value === 3) {
                return row.identity.indexOf('领导') != -1;
              } else if (value === 4) {
                return row.identity.indexOf('专家') != -1;
              } else if (value === 5) {
                return row.identity.indexOf('管理员') != -1;
              }
            },
            render: (h, params) => {
              const row = params.row;
              return h('Tooltip', {
                props: {
                  content: "所属领导：" + row.leaderName,
                  disabled: row.leaderName === null ? true : false
                }
              }, row.identity)
            }
          },
          {
            title: "状态",
            key: 'status',
            align: 'center',
            width: '120px',
            filters: [
              {
                label: '冻结',
                value: 0
              },
              {
                label: '正常',
                value: 1
              }
            ],
            filterMultiple: true,
            filterMethod(value, row) {
              if (value === 0) {
                return row.status === 0;
              } else if (value === 1) {
                return row.status === 1;
              }
            },
            render: (h, params) => {
              const row = params.row;
              const status = row.status;
              const color = row.status === 1 ? 'success' : 'error';
              const text = row.status === 1 ? '正常' : '冻结';
              return h('Tooltip', {
                props: {
                  content: "点击按钮可将该用户" + (status === 1 ? '冻结' : '解冻'),
                  placement: 'bottom'
                }
              }, [
                h('Tag', {
                  props: {
                    type: 'dot',
                    color: color,
                  },
                  nativeOn: {
                    click: () => {
                      axios({
                        url: apiRoot + '/system/updateStatus',
                        method: 'post',
                        data: {
                          userId: row.userId,
                          status: status === 1 ? 0 : 1
                        }
                      }).then(res => {
                        if (res.data) {
                          if (res.data.code === 'SUCCESS') {
                            this.$Notice.success({title: '操作成功！'});
                            this.data1[params.index].status = (status === 1 ? 0 : 1);
                          } else {
                            this.$Notice.error({title: res.data.message});
                          }
                        }
                      }).catch(() => {
                        this.$Message.error('请检查网络设置！')
                      })
                    }
                  }
                }, text)
              ])
            }
          },
          {
            title: "姓名",
            key: 'userName',
            align: 'center'
          },
          {
            title: "学/工号",
            key: 'userId',
            align: 'center'
          },
          {
            title: "部门/学院",
            key: 'department',
            align: 'center'
          },
          {
            title: "手机",
            key: 'phone',
            align: 'center',
            width: '125px'
          },
          {
            title: "邮箱",
            key: 'mail',
            align: 'center'
          },
          {
            title: '操作',
            key: 'operation',
            align: 'center',
            width: '200px',
            render: (h, params) => {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'error',
                    size: 'small'
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.deleteUser(params);
                    }
                  }
                }, '删除'),
                h('Button', {
                  props: {
                    type: 'warning',
                    size: 'small'
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.modifyPassword(params);
                    }
                  }
                }, '改密码'),
                h('Button', {
                  props: {
                    type: 'primary',
                    size: 'small'
                  },
                  on: {
                    click: () => {
                      this.tmp_arr = this.identity_arr
                      this.modifyIdentity(params);
                    }
                  }
                }, '改权限')
              ])
            }
          }
        ],
        data1: []
      }
    },
    watch: {
      modal_visible(val) {
        if (val) {
          this.modal_delay = true
        }
      },
      select_leader(val) {
        if (val) {
          this.select_leader_delay = val
        }
      }
    },
    mounted() {
      this.initData('初始化成功！', 1)
      this.initLeaderList()
    },
    methods: {
      initData(msg, page) {
        this.loading = true
        axios({
          url: apiRoot + '/system/userInfo',
          method: 'post',
          data: {
            page: page
          }
        }).then(res => {
          if (res.data.data) {
            if (res.data.code === "SUCCESS") {
              this.data1 = res.data.data.userData
              for (let i = 0; i < this.data1.length; i++) {
                this.data1[i].identity = this.data1[i].identity.replace('1', '用户').replace('2', '业务员').replace('3', '审核专家').replace('4', '领导').replace('5', '管理员').split('|').join(',')
              }
              this.totalPage = res.data.data.totalPage
              this.$Message.success(msg)
              this.loading = false
            } else {
              this.$Message.error("初始化错误!")
              this.loading = false
            }
          }
        }).catch(() => {
          this.$Message.error('请检查网络连接!')
          this.loading = false
        })
      },
      initLeaderList() {
        axios({
          url: apiRoot + '/system/leaderList'
        }).then(res => {
          if (res.data) {
            if (res.data.code === 'SUCCESS') {
              this.leader_list = res.data.data;
            }
          }
        })
      },
      genPassword() { //生成8位随机密码
        let pasArr = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '_', '-', '$', '%', '&', '@', '+', '!'];
        let password = '';
        let pasArrLen = pasArr.length;
        for (let i = 0; i < 8; i++) {
          let x = Math.floor(Math.random() * pasArrLen);
          password += pasArr[x];
        }
        this.formItem.password = password;
        //console.log(this.formItem.password)
      },
      Refresh() {
        this.initData('刷新成功！', 1)
      },
      selectedArr(arr) {
        //console.log(arr)
        if (arr.indexOf('principal') != -1) {
          this.initLeaderList()
          this.select_leader = true
        }
      },
      cancel_select() {
        this.select_leader = false
        let index1 = this.formItem.identity.indexOf('principal')
        let index2 = this.identity_arr.indexOf('principal')
        this.formItem.identity.splice(index1, 1)
        this.identity_arr.splice(index2, 1)
      },
      ok_select() {
        this.select_leader = false
      },
      Add() {
        this.modal_visible = true;
      },
      ok_add() { //这里为什么直接就清空了? 答：当看到//console.log的时候，已经执行this.$refs['formItem'].resetFields()了，所以采用了Object.assign({},this.formItem)浅拷贝只拷贝一层，第二层一下都是用指针来代替
        this.$refs['formItem'].validate((valid) => {
          if (valid) {
            axios({
              url: apiRoot + '/system/addUser',
              method: 'post',
              data: {
                userName: this.formItem.userName,
                userId: this.formItem.userId,
                password: this.formItem.password,
                identity: this.formItem.identity,
                leader: this.leaderId
              }
            }).then(res => {
              if (res.data) {
                if (res.data.code === 'SUCCESS') {
                  //console.log(Object.assign({}, this.formItem));
                  this.$Message.success('新增用户成功！');
                  this.modal_visible = false;
                  this.$refs['formItem'].resetFields();
                } else {
                  this.$Message.error(res.data.message);
                }
              }
            }).catch(() => {
              this.$Message.error("请检查网络设置！")
            })
          } else {
            this.$Message.error('请将有关字段填写完整！');
          }
        })
      },
      cancel_add() {
        this.$refs['formItem'].resetFields()
        this.modal_visible = false
      },
      Delete() {
        let selected = []
        let id_list = []
        for (let i = 0; i < this.selected_list.length; i++) {
          selected.push(this.selected_list[i].userId)
        }
        for (let i = 0; i < this.data1.length; i++) {
          id_list.push(this.data1[i].userId)
        }
        //console.log(selected)
        if (selected.length) {
          this.$Modal.confirm({
            title: '请确认',
            content: "请确定是否要删除所选定的" + selected.length + "位用户？",
            onOk: () => {
              axios({
                url: apiRoot + '/system/deleteUser',
                method: 'post',
                data: {
                  userId: selected
                }
              }).then(res => {
                if (res.data) {
                  if (res.data.code === 'SUCCESS') {
                    this.$Message.success("删除成功！");
                    selected = []
                  } else {
                    this.$Message.error(res.data.message)
                  }
                }
              })
            }
          });
        }
      },
      changePage(page) {
        this.currentPage = page
        this.initData('翻页成功！', page)
      },
      updateSelectedList(selection) {
        this.selected_list = selection
      },
      deleteUser(params) {
        let userId = params.row.userId
        let index = params.index
        this.$Modal.confirm({
          title: "请确认",
          content: "确认删除" + params.row.userName + "吗？删除后该用户账号将销毁！",
          onOk: () => {
            let userList = []
            userList.push(userId)
            axios({
              url: apiRoot + '/system/deleteUser',
              method: 'post',
              data: {
                userId: userList
              }
            }).then(res => {
              if (res.data) {
                if (res.data.code === 'SUCCESS') {
                  this.$Message.success('删除' + params.row.userName + '成功！');
                  this.data1.splice(index, 1);
                } else {
                  this.$Message.error(res.data.message)
                }
              }
            }).catch(() => {
              this.$Message.error('请检查网络设置！')
            })
          }
        });
      },
      modifyPassword(params) {
        let userId = params.row.userId
        let index = params.index
        this.$Modal.confirm({
          title: "修改密码",
          onOk: () => {
            if (this.newpwd) {
              //console.log(this.newpwd)
              axios({
                url: apiRoot + '/user/updatePassword',
                method: 'post',
                data: {
                  userId: userId,
                  password: this.newpwd
                }
              }).then(res => {
                if (res.data) {
                  if (res.data.code === 'SUCCESS') {
                    this.$Notice.success({title: "修改成功！"});
                    this.newpwd = null;
                  } else {
                    this.$Notice.error({title: res.data.message});
                  }
                }
              }).catch(() => {
                this.$Message.error('请检查网络设置！')
              })
            } else {
              this.$Notice.error({title: "密码不能为空！"})
            }
          },
          render: (h) => {
            return h('Tooltip', {
              props: {
                content: "一般修改的是校外用户的密码，校内人员使用上海大学一卡通账号，请在修改前仔细斟酌并牢记修改后的密码！",
                placement: 'bottom-start',
                maxWidth: '100%',
              },
              style: {
                width: "100%"
              },
            }, [
              h('Input', {
                props: {
                  value: this.newpwd,
                  autofocus: true,
                  placeholder: '请输入新密码',
                  clearable: true
                },
                on: {
                  input: (val) => {
                    this.newpwd = val;
                  }
                }
              })
            ])
          }
        })
      },
      modifyIdentity(params) {
        let userId = params.row.userId
        //console.log(params.row.identity)
        let identity = params.row.identity.split(',')
        for (let i = 0; i < identity.length; i++) {
          if (identity[i] === '用户') {
            this.identity_arr.push("user")
          } else if (identity[i] === '业务员') {
            this.identity_arr.push("principal")
          } else if (identity[i] === '领导') {
            this.identity_arr.push("leader")
          } else if (identity[i] === '审核专家') {
            this.identity_arr.push("expert")
          } else if (identity[i] === '管理员') {
            this.identity_arr.push("admin")
          }
        }
        this.$Modal.confirm({
          title: "修改权限",
          onOk: () => {
            axios({
              url: apiRoot + '/system/updateIdentity',
              method: 'post',
              data: {
                userId: userId,
                identity: this.identity_arr,
                leader: this.leaderId
              }
            }).then(res => {
              if (res.data) {
                if (res.data.code === 'SUCCESS') {
                  this.$Notice.success({title: '操作成功！'});
                  this.identity_arr = [];
                  this.leaderId = null;
                  this.initData('刷新成功',1)
                } else {
                  this.$Notice.error({title: res.data.message});
                  this.identity_arr = [];
                  this.leaderId = null;
                }
              }
            }).catch(() => {
              this.$Message.error("请检查网络设置！");
            })
          },
          onCancel: () => {
            this.identity_arr = []
          },
          render: (h) => {
            return h('CheckboxGroup', {
                props: {
                  value: this.identity_arr
                },
                on: {
                  input: (value) => {
                    this.identity_arr = value
                  },
                  'on-change': (arr) => {
                    if (arr.indexOf('principal') != -1 && this.tmp_arr.indexOf('principal') == -1) {
                      this.select_leader = true;
                      this.initLeaderList();
                    } else {
                      this.select_leader = false
                    }
                    this.tmp_arr = arr;
                  }
                }
              }, [
                h('Checkbox', {
                  props: {
                    label: 'user'
                  }
                }, [
                  h('span', {
                    domProps: {
                      innerHTML: '用户'
                    }
                  })
                ]),
                h('Checkbox', {
                  props: {
                    label: 'principal'
                  }
                }, [
                  h('span', {
                    domProps: {
                      innerHTML: '业务员'
                    }
                  })
                ]),
                h('Checkbox', {
                  props: {
                    label: 'leader'
                  }
                }, [
                  h('span', {
                    domProps: {
                      innerHTML: '领导'
                    }
                  })
                ]),
                h('Checkbox', {
                  props: {
                    label: 'expert'
                  }
                }, [
                  h('span', {
                    domProps: {
                      innerHTML: '审核专家'
                    }
                  })
                ]),
                h('Checkbox', {
                  props: {
                    label: 'admin'
                  }
                }, [
                  h('span', {
                    domProps: {
                      innerHTML: '管理员'
                    }
                  })
                ])
              ]
            )
          }
        })
      }
    }
  }
</script>

<style lang="scss">
  @import "userManage";
</style>
<style lang="scss">
  .select_leader {
    .ivu-select-selected-value {
      color: #515a6e;
    }
  }
</style>

