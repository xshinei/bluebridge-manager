<template>
  <div class="v-main">
    <v-visited v-if="$router.currentRoute.path === '/manager'"></v-visited>
    <router-view></router-view>
  </div>
</template>

<script type="text/ecmascript-6">

  import VVisited from '../base/vVisited';

 export default {
   components: {
     VVisited
   }
 };
</script>

<style>
  .v-main{
    padding: 20px;
  }


</style>
