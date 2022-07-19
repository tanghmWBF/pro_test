<template>
  <module className="hot-analysis mt10" title="来源渠道分析" :isBorder="true" type="table">
    <div slot="content" v-if="(table.rows && table.rows.length) || (table.resultPresent && table.resultPresent.length)">
      <table>
        <thead>
        <tr v-if="table.rows && table.rows.length">
          <th v-for="(item, index) in table.header" :style="{width: item.width + 'px'}" :key="'a' + index" v-show="item.show">
            {{item.name}}
          </th>
          <th v-for="(item, index) in table.header" :style="{width: item.width + 'px'}" :key="'b' + index" v-show="item.show">
            {{item.name}}
          </th>
        </tr>
        <tr v-if="table.resultPresent && table.resultPresent.length">
          <template v-if="table.headerMerge">
            <th :colspan="table.headerMerge">{{table.resultPresent[0].type}}</th>
            <th v-for="(item, index) in table.resultPresent[0].extend.slice(table.headerMerge - 1)" :key="index">
              <div>{{ item.time }}</div>
            </th>
          </template>
          <template v-else>
            <th>{{table.resultPresent[0].type}}</th>
            <th v-for="(item, index) in table.resultPresent[0].extend" :key="index">
              <div>{{ item.time }}</div>
            </th>
          </template>
        </tr>
        </thead>
        <tbody>
        <template v-if="table.rows && table.rows.length">
          <tr v-for="(rowsItem, rowsIndex) in table.rows" :key="rowsIndex">
            <td v-for="(item, index) in table.header" :key="'c'+index" v-if="item.show && rowsItem[0]" > {{rowsItem[0][item.field]}}</td>
            <td v-for="(item, index) in table.header" :key="'d'+index" v-if="item.show && rowsItem[1]" > {{rowsItem[1][item.field]}}</td>
          </tr>
        </template>
        <template v-if="table.resultPresent && table.resultPresent.length">
          <tr v-for="(rowsItem, index) in table.resultPresent" :key="index">
            <template v-if="table.bodyMerge">
              <td :rowspan="table.bodyMerge" v-if="index % table.bodyMerge === 0">{{rowsItem.name || rowsItem.region}}</td>
            </template>
            <template v-else>
              <td>{{rowsItem.name || rowsItem.region}}</td>
            </template>
            <td v-for="(extendItem, extendIndex) in rowsItem.extend" :key="extendIndex" :rowspan="extendItem.yAxis"  v-show="extendItem.yAxis != 0">
              {{ extendItem.value }}
            </td>
          </tr>
        </template>
        </tbody>
      </table>
      <div class="table-unit" v-if="table.caption.length && table.caption[0].name && table.caption[0].unit">{{table.caption[0].name}}: {{table.caption[0].unit}}</div>
    </div>
    <div v-else slot="content" class="table-no-data">
      <div  class="ui-loading ui-loading-no-data">
        <i class="ued-datav">&#xe6e6;</i>
        <p>暂无数据</p>
      </div>
    </div>
  </module>
</template>

<style lang="scss" scoped>
  table{
    width: 100%;
    line-height: 24px;
    thead{
      width: 100%;
      tr{
        width: 100%;
        background: #c1e5ee;
        th{
          border: 1px solid #4cc3e3;
          min-height: 32px;
          text-align: center;
          font-weight: bold;
          div{
            word-wrap:break-word;
          }
        }
      }
    }
    tbody{
      tr{
        width: 100%;
        td{
          border: 1px solid #4cc3e3;
          text-align: center;
          word-break:break-all;
        }
      }
    }
  }
  .table-unit{
    text-align: right;
    line-height: 30px;
    color: #999;
  }
</style>
<script>
import module from './module'
import Ajax from '../../service/index'
import { mapState } from 'vuex'
export default {
  name: 'tableDbModel',
  props: {
    cdata: Object,
    index: Number
  },
  data () {
    return {
      // 数据
      table: {},
      params: {},
      list: []
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
    if (this.params.dataType === 'MOCK') {
      this.params.pageSize = 10
    }
    this.getData(this.cdata.api, this.params)
    // this.getData('rest/inlandTouristAmountAnalyze/topTenTouristRegionAndAmount?countType=tableCrosswise', this.params)
  },
  methods: {
    // 获取表格数据
    getData (params, api) {
      Ajax.getModelData(params, api)
        .then(res => {
          let data = res.data || {}
          let content = data.content || {}
          this.table = content.table || {}
          if (this.table.rows && this.table.rows.length) {
            let listArray = []
            this.table.rows.forEach((item, index) => {
              listArray.push(item)
              if (index % 2 !== 0) {
                this.list.push(listArray)
                listArray = []
              }
            })
            if (this.table.rows.length % 2 !== 0) {
              let listArray = []
              listArray.push(this.table.rows[this.table.rows.length - 1])
              this.list.push(listArray)
            }
            //             console.log(this.list)
            this.table.rows = this.list
          }
          this.$store.dispatch('common/GET_LIST', { index: this.index, essentials: res.data.content.essentials || '' })
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
