<template>
  <module  className="hot-analysis mt10" title="来源渠道分析"  :isBorder="true">
    <div slot="content" style="height: 100%;width: 100%;" ref="js_pie"></div>
  </module>
</template>

<style lang="scss" scoped>
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
      geekECharts.setTheme('white')
      let charts = this.list || []
      let chartsArray = []
      charts.forEach(function (chart) {
        if (chart) {
          chart.destroy && chart.destroy()
          chart = null
        }
      })
      /**
       * 图表1，自行调用目标图表类，多个图表时容器需要自定义dom。
       * new的图表对象，需要push到widgetPart.content.charts中（记录到微件构造中）
       */
      chartsArray.push(new geekECharts.NormalSinglePie(this.$refs.js_pie,
        $.extend(true, {}, {}, {
          data: {
            original: this.list[0].series // 第一个图表为charts[0],第二个为charts[1]
          },
          seriesType: ['pie'],
          chart: {
            color: config.echartsColor,
            grid: {
              left: 65
            },
            legend: {
              show: false
            },
            tooltip: {
              show: false
            },
            pie: {
              label: {
                normal: {
                  formatter: '{b} : {c} {unit}({d}%)',
                  show: true, // 是否开启数据值显示
                  position: 'top', // 显示位置
                  align: 'center', // 水平分布
                  fontSize: 18, // 字体大小
                  z: 5
                }
              },
              labelLine: {
                show: true
              }
            }
          }
        })
      ))
    },
    // 获取数据
    getData (params, api) {
      Ajax.getModelData(params, api)
        .then(res => {
          this.list = res.data.content.charts
          this.$store.dispatch('common/GET_LIST', { index: this.index, essentials: res.data.content.essentials || '' })
          this.renderAnalysisEchart()
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
