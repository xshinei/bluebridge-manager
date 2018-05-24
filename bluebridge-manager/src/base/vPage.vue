<template>
  <div class="i-page-wrapper">
    <i-page show-total
            :total="total"
            :page-size="pageSize"
            :current="pageNum"
            show-sizer
            :page-size-opts="pageSizeOpts"
            @on-change="handleChangePageNum"
            @on-page-size-change="handleChangePageSize"
            class-name="i-page">
    </i-page>
  </div>
</template>

<script>

  export default {
    props: {
      pageNum: {
        type: Number,
      },
      pageSize: {
        type: Number,
      },
      total: {
        type: Number
      },
      pageSizeOpts: {
        type: Array,
        default: () => {
          return [1, 5, 10, 15];
        }
      }
    },
    data() {
      return {

      };
    },
    methods: {
      handleChangePageNum(newPageNum) {
        this.$emit('changePageNum', newPageNum);
      },
      handleChangePageSize(newPageSize) {
        this.$emit('changePageSize', newPageSize)
      }
    }
  }
</script>

<style scoped>
  .i-page-wrapper {
    width: 500px;
    margin: 30px auto 0;
  }
</style>
