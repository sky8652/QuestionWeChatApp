<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
  body{
    margin: 0;
  }
  .header-search {
     padding: 20px;
   }
  .pagination {
    padding: 10px 0;
    text-align: center;
  }
</style>
