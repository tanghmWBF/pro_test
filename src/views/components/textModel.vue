<template>
  <div></div>
</template>

<style lang="scss" scoped>
</style>
<script>
export default {
  name: 'textModel',
  props: {
    params: Array,
    api: String
  },
  data () {
    return {
      // 数据
      list: [
        {
          name: '新闻',
          unit: '条',
          value: 1651,
          data: [
            {
              name: '2018-07',
              value: 100
            },
            {
              name: '2018-08',
              value: 100
            },
            {
              name: '2018-9',
              value: 100
            },
            {
              name: '2018-10',
              value: 5464
            },
            {
              name: '2018-11',
              value: 1232
            },
            {
              name: '2018-12',
              value: 1020
            },
            {
              name: '2019-01',
              value: 1020
            },
            {
              name: '2019-02',
              value: 34
            },
            {
              name: '2019-03',
              value: 768
            },
            {
              name: '2019-04',
              value: 56
            },
            {
              name: '2019-05',
              value: 123
            },
            {
              name: '2019-06',
              value: 12
            }
          ]
        }
      ]
    }
  }
}
</script>
