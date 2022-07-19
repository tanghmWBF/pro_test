<template>
  <module className="hot-analysis mt10" title="来源渠道分析" :isBorder="true">
    <div slot="content" style="height: 100%;width: 100%;" ref="js_bar"></div>
  </module>
</template>

<style lang="scss" scoped></style>
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

      let groupOption = []
      for (let i = 0; i < charts[0].series.length; i++) {
        let option = {
          label: {
            normal: {
              show: true,
              fontSize: 18,
              formatter: function (item) {
                if (item.value === 0) {
                  return ''
                } else {
                  return item.value
                }
              }
            }
          }
        }
        groupOption.push(option)
      }
      /**
       * 图表1，自行调用目标图表类，多个图表时容器需要自定义dom。
       * new的图表对象，需要push到widgetPart.content.charts中（记录到微件构造中）
       */

      chartsArray.push(
        new geekECharts.GroupCharts(
          this.$refs.js_bar,
          $.extend(
            true,
            {},
            {},
            {
              data: {
                original: this.list[0].series // 第一个图表为charts[0],第二个为charts[1]
              },
              seriesType: ['bar'],
              chart: {
                color: config.echartsColor,
                grid: {
                  left: 65
                },
                legend: {
                  left: 'center',
                  top: 0,
                  textStyle: {
                    fontSize: 20
                  }
                },
                yAxis: [
                  {
                    name: this.list[0].axisLabels[0],
                    nameTextStyle: {
                      fontSize: 20
                    },
                    axisLabel: {
                      fontSize: 18
                    }
                  }
                ],
                xAxis: [
                  {
                    axisLabel: {
                      fontSize: 18
                    }
                  }
                ],
                tooltip: {
                  show: false
                },
                groupSeries: groupOption
              }
            }
          )
        )
      )
    },
    // 获取数据
    getData (params, api) {
      Ajax.getModelData(params, api).then(res => {
        this.list = res.data.content.charts
        this.$store.dispatch('common/GET_LIST', {
          index: this.index,
          essentials: res.data.content.essentials || ''
        })
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
