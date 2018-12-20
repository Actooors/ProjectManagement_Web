<template lang="pug">
  div(class="abc")
    a(href="http://www.baidu.com") 这是链接
    div 这是另一个div
    Button(
    @click="hhh"
    ) 这是Button
</template>

<script>
  export default {
    name: "mainpage",
    methods: {
      hhh() {
        alert("!00");
      }
    }
  }
</script>

<style scoped>

</style>
