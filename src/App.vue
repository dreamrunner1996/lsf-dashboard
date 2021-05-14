<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App',
  watch: {
    '$route': function (newVal) {
      // window.location.replace(newVal.fullPath)
      // console.clear()
      let routeQuery = JSON.parse(JSON.stringify(newVal.query))
      routeQuery._timeStampNum = new Date().valueOf()
      this.$router.push({ path: newVal.path, query: routeQuery }).catch(err => err)
    }
  },
  mounted () {
    console.log(this.$route)
  }
}
</script>

<style>
body {
  margin: 0;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background-color: #222222;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  background-color: #222222;
  width: 100vw;
  height: 100vh;
}
</style>
