<template>
  <i-row type="flex" class="i-row">
    <i-col span="4" class="i-col">
      <v-section></v-section>
    </i-col>
    <i-col span="20" class="i-col i-col-right">
      <v-header></v-header>
      <v-main class=""></v-main>
    </i-col>
  </i-row>
</template>

<script type="text/ecmascript-6">
  import VSection from '@/components/vSection';
  import VHeader from '@/components/vHeader';
  import VMain from '@/components/vMain';

  export default {
    components: {
      VSection,
      VHeader,
      VMain
    }
  };
</script>

<style type="text/css">
  .i-row{
    height: 100%;
  }

  .i-col{
    height: 100%;
  }

  .i-col-right{
    overflow-y: scroll;
  }
</style>
