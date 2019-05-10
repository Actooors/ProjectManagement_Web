<template>
  <div class="wrapper">
    <div class="header">
      <ButtonGroup class="operation">
        <Button type="success" icon="md-refresh" @click="Refresh" size="large" ghost>
          刷新
        </Button>
        <Button type="primary" icon="md-add" @click="Refresh" size="large" ghost>
          添加
        </Button>
      </ButtonGroup>
      <Input class="search" placeholder="检索用户..." icon="" search size="large"></Input>
    </div>
    <Table stripe border :loading="loading" :columns="columns" :data="data1" class="table" height="600"
           size="large"></Table>
  </div>
</template>

<script>
  import axios from 'axios'

  export default {
    name: "userManage",
    data() {
      return {
        loading: false,
        columns: [
          {
            title: "用户身份",
            key: 'identity',
            align: 'center',
            width:'200px',
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
            align: 'center'
          },
          {
            title: "邮箱",
            key: 'mail',
            align: 'center'
          },
          {
            title: "职称",
            key: 'position',
            align: 'center'
          },
          {
            title: '操作',
            key: 'operation',
            align: 'center',
            width:'200px',
            render: (h, params) => {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'error',
                    size:'small'
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {

                    }
                  }
                },'删除'),
                h('Button',{
                  props:{
                    type:'warning',
                    size:'small'
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on:{
                    click:()=>{

                    }
                  }
                },'冻结'),
                h('Button',{
                  props:{
                    type:'primary',
                    size:'small'
                  },
                  on:{
                    click:()=>{

                    }
                  }
                },'更改权限')
              ])
            }
          }
        ],
        data1: [
          {
            identity:'领导，审核专家',
            userName:'user1',
            userId:'12123',
            department:'计算机学院',
            phone:'',
            mail:'',
            position:'教授'
          }
        ]
      }
    }
  }
</script>

<style lang="scss">
@import "userManage";
</style>
