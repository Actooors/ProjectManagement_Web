<template>
  <div class="wrapper">
    <div class="header">
      <ButtonGroup class="operation" shape="circle">
        <Button type="success" icon="md-refresh" @click.native="Refresh" size="large">
          刷新
        </Button>
        <Button type="primary" icon="md-add" @click.native="Add" size="large">
          添加
        </Button>
        <Button type="error" icon="md-close" @click.native="Delete" size="large">
          删除
        </Button>
      </ButtonGroup>
      <Input class="search" placeholder="检索用户..." icon="" search size="large"></Input>
    </div>
    <Table stripe border :loading="loading" :columns="columns" :data="data1" class="table" height="520"
           size="large" @on-selection-change="updateSelectedList"></Table>
    <div style="margin: 10px 30px 20px 0px;overflow: hidden">
      <div style="float: right;">
        <Page :total="totalPage" :current="currentPage" @on-change="changePage"></Page>
      </div>
    </div>
    //TODO Modal
    <Modal title="新增用户" v-model="modal_visible" v-if="modal_delay"
           width="450">
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
          <CheckboxGroup v-model="formItem.identity">
            <Checkbox label="用户" value="user"></Checkbox>
            <Checkbox label="业务员" value="principal"></Checkbox>
            <Checkbox label="领导" value="leader"></Checkbox>
            <Checkbox label="审核专家" value="expert"></Checkbox>
            <Checkbox label="管理员" value="admin"></Checkbox>
          </CheckboxGroup>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button @click="cancel_add">取消</Button>
        <Button type='primary' @click="ok_add">确定</Button>
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
        modal_delay: false,
        formItem: {
          userId: '',
          userName: '',
          identity: [],
          password: null
        },
        formValidate: {},
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
            }
          },
          {
            title: "状态",
            key: 'status',
            align: 'center',
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
                      this.data1[params.index].status = (status === 1 ? 0 : 1)
                      this.$Notice.success({title: '操作成功！'})
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
                      this.modifyIdentity(params);
                    }
                  }
                }, '改权限')
              ])
            }
          }
        ],
        data1: [
          {
            identity: '领导,用户,业务员', //此处用逗号隔开
            userName: 'user1',
            status: 1, //1：正常，0：冻结
            userId: '12123',
            department: '计算机学院',
            phone: '',
            mail: 'whzhu@shu.edu.cn',
            position: '教授'
          },
          {
            identity: '用户',
            userName: 'user2',
            status: 0,
            userId: 'aabbcc',
            department: '理学院',
            phone: '',
            mail: '',
            position: '教授'
          },
          {
            identity: '业务员',
            userName: 'user3',
            status: 0,
            userId: 'aabbcc',
            department: '文学院',
            phone: '18101971575',
            mail: '',
            position: '教授'
          },
          {
            identity: '专家,管理员',
            userName: 'user4',
            status: 1,
            userId: 'aabbcc',
            department: '理学院',
            phone: '',
            mail: '',
            position: '教授'
          },
        ]
      }
    },
    watch: {
      modal_visible(val) {
        if (val) {
          this.modal_delay = true
        }
      },
    },
    methods: {
      genPassword() { //生成8位随机密码
        let pasArr = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '_', '-', '$', '%', '&', '@', '+', '!'];
        let password = '';
        let pasArrLen = pasArr.length;
        for (let i = 0; i < 8; i++) {
          let x = Math.floor(Math.random() * pasArrLen);
          password += pasArr[x];
        }
        this.formItem.password = password;
        console.log(password)
      },
      Refresh() {

      },
      Add() {
        this.modal_visible = true;
      },
      ok_add() {
        this.$refs['formItem'].validate((valid) => {
          if (valid) {
            this.$Message.success('新增用户成功！');
            this.$refs['formItem'].resetFields()
            this.modal_visible = false
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
        let selected = this.selected_list
        if (selected.length) {
          this.$Modal.confirm({
            title: '请确认',
            content: "请确定是否要删除所选定的" + selected.length + "位用户？",
            onOk: async () => {
              this.$Message.success("删除成功！")
            }
          })
        }
      },
      changePage() {

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
            this.$Message.success('删除' + params.row.userName + '成功！')
            this.data1.splice(index, 1)
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
              console.log(this.newpwd)
              this.newpwd = null
              this.$Notice.success({title: "修改成功！"})
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
        let index = params.index
        this.$Modal.confirm({
          title: "修改权限",
          render: (h) => {
            return h('CheckboxGroup', {
                props: {
                  value: this.identity_arr
                }
              }, [
                h('Checkbox', {
                  props: {
                    label: '用户'
                  }
                }),
                h('Checkbox', {
                  props: {
                    label: '业务员'
                  }
                }),
                h('Checkbox', {
                  props: {
                    label: '领导'
                  }
                }),
                h('Checkbox', {
                  props: {
                    label: '审核专家'
                  }
                }),
                h('Checkbox', {
                  props: {
                    label: '管理员'
                  }
                })
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
