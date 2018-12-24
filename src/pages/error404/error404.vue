<template>
  <div>
    <div class="overlay"></div>
    <div class="terminal">
      <h1>Error <span class="errorcode">404</span></h1>
      <p class="output">The page you are looking for might have been removed, had its name changed or is temporarily unavailable</p>
      <p class="output">Please try <a href="/login">login</a> or <a @click="goBack">go back</a></p>
      <p class="output">Good luck</p>
    </div>
  </div>
</template>

<script>
  export default {
    name: "error404",
    methods:{
      goBack(){
        console.log("123")
        this.$router.back(-1)
      }
    }
  }
</script>
<style scoped lang="scss">
  @import "error404";
</style>
