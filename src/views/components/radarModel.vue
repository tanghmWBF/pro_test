<template>
  <module  className="hot-analysis mt10" title="来源渠道分析"  :isBorder="true">
    <div slot="content" ref="js_radar" class="radar_two">
      <div v-for="(item, index) in list" :key="index">
        <div class="radar"></div>
        <p class="title">{{list[index].axisLabels[0]}}</p>
      </div>
    </div>
  </module>
</template>

<style lang="scss" scoped>
  .radar_two{
    display: flex;
    height: 100%;
    width: 100%;
    &>div{
      flex: 1;
      p{
        line-height: 32px;
        color: #229ef4;
      }
      div{
        width: 100%;
        height: calc(100% - 32px);
      }
    }
    .title{
      text-align: center;
      font-size: 14px;
      font-weight: bold;
      margin-bottom: 0 !important;
    }
  }
</style>
<script>
import module from './module'
import Ajax from '../../service/index'
import { mapState } from 'vuex'
import config from '../../service/config'
export default {
  name: 'lineModel',
  props: {
    cdata: Object,
    index: Number
  },
  data () {
    return {
      // 数据
      list: [],
      params: {}
    }
  },
  created () {
    this.params = {
      sdate: this.$route.query.startTime || this.option.sdate,
      edate: this.$route.query.endTime || this.option.edate,
      dateType: this.getType(this.$route.query.type) || this.option.dateType,
      dataType: this.$route.query.dataType || 'REAL'
    }
  },
  computed: mapState({
    // 获取vuex存储东西
    option: state => state.common.params
  }),
  mounted () {
    this.getData(this.cdata.api, this.params)
  },
  methods: {
    /**
     * 处理图表
     */
    renderAnalysisEchart () {
      let box = this.$refs.js_radar.getElementsByClassName('radar')
      for (let i = 0; i < this.list.length; i++) {
        this.renderEchart(box[i], this.list[i])
      }
    },
    // 渲染图标
    renderEchart ($ele, data) {
      geekECharts.setTheme('white')
      let chartsArray = []
      if (this.echarts) {
        this.echarts.destroy()
      }
      /* eslint-disable no-new */
      chartsArray.push(new geekECharts.Radar($ele, {
        data: {
          original: data.series,
          transform: null
        },
        seriesType: 'radar',
        chart: {
          color: config.echartsColor,
          name: {
            show: true
          },
          radar: {
            shape: 'circle',
            radius: '50%'
          },
          tooltip: {
            show: false
          },
          legend: {
            top: 'auto',
            left: 'center',
            bottom: 3
          },
          series: [{
            shadow: {
              show: true,
              opacity: 0.6
            }
          }]
        }
      }))
    },
    // 获取数据
    getData (params, api) {
      Ajax.getModelData(params, api)
        .then(res => {
          this.list = res.data.content.charts
          this.$store.dispatch('common/GET_LIST', { index: this.index, essentials: res.data.content.essentials || '' })
          setTimeout(() => {
            this.renderAnalysisEchart()
          }, 100)
        })
    },
    // 类型判断
    getType (value) {
      switch (value) {
        case 'day_report':
          return 'DAY'
        case 'month_report':
          return 'MONTH'
        case 'quarter_report':
          return 'QUARTER'
        case 'year_report':
          return 'YEAR'
      }
    }
  },
  components: {
    module
  },
  watch: {
    cdata () {
      this.params = {
        sdate: this.$route.query.startTime || this.option.sdate,
        edate: this.$route.query.endTime || this.option.edate,
        dateType: this.getType(this.$route.query.type) || this.option.dateType,
        dataType: this.$route.query.dataType || 'REAL'
      }
      this.getData(this.cdata.api, this.params)
    }
  }
}
</script>
