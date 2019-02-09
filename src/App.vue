<template>
  <div id="app">
    <router-view />
    <NavigationBar />
  </div>
</template>

<script>
import NavigationBar from './components/NavigationBar'
export default {
  name: 'App',
  components: {
    NavigationBar
  },
  data(){
    return {
      items: []
    }
  }
}
</script>

<style>
body, p, input, label {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  margin: 0;
  padding: 0;
  background-color: #fff;
  color: #333;
}
</style>
