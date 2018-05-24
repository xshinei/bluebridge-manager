<template>
  <i-row>
    <i-col span="12">
      <i-card>
        <p slot="title">上周每日来访量统计</p>
        <div style="height: 300px; width: 100%;" ref="visited"></div>
      </i-card>
    </i-col>
    <i-col span="12"></i-col>
  </i-row>

</template>

<script>

  import echarts from 'echarts';
  import axios from 'axios';

  export default {
    data() {
      return {
        requestList: [],
        week: ['Sun', 'Mon', 'Tues', 'Wed', 'Thur', 'Fri', 'Sat'],
        data: []
      };
    },
    created() {
      this.getRequestCount();
    },
    mounted() {

    },
    methods: {
      async getRequestCount() {
        try {
          const result = await axios.get('/logger/visited');

          const data = result.data;

          this.requestList = data.result;
          this.serializeData();
          this.initVolume();
        }
        catch (err) {
          console.log(err.message);
        }
      },
      serializeData() {
        this.data =  this.requestList.map((item, index) => {
          return {
            value: item,
            name: this.week[index],
            itemStyle: {normal: {color: '#2d8cf0'}}
          }
        });
      },
      initVolume() {
        this.$nextTick(() => {
          const visited = this.$refs.visited;
          let visiteVolume = echarts.init(visited, {
            renderer: 'canvas',
            width: 'auto',
            height: 'auto'
          });

          const option = {
            tooltip: {
              trigger: 'axis',
              axisPointer: {
                type: 'shadow'
              }
            },
            grid: {
              top: 0,
              left: '2%',
              right: '4%',
              bottom: '3%',
              containLabel: true
            },
            xAxis: {
              type: 'value',
              boundaryGap: [0, 0.01]
            },
            yAxis: {
              type: 'category',
              data: this.week,
              nameTextStyle: {
                color: '#c3c3c3'
              }
            },
            series: [
              {
                name: '访问量',
                type: 'bar',
                data: this.data
              }
            ]
          };
          visiteVolume.setOption(option);
          window.addEventListener('resize', function () {
            visiteVolume.resize();
          });
        });
      }
    }
  }
</script>

<style scoped>

</style>
