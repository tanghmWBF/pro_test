<template>
  <ul class = "dataBaseTree">
    <li v-for = "(item,index) in folder" :key = "index">
            <span @click = "select(item)" :class = "{'active':currentId == item.id}">
                <i class = "folderIcon" v-if = "item.children">
                    <icon :icon = "'xiala'" v-if = "item.show"></icon>
                    <icon :icon = "'xiala2'" v-else></icon>
                </i>
                {{ item.label }}
            </span>
      <el-collapse-transition>
        <DatabaseTree v-if = "item.children && item.show" :folder = "item.children" :select = "select" :currentId = "currentId"></DatabaseTree>
      </el-collapse-transition>
    </li>
  </ul>
</template>

<style lang="scss" scoped>

</style>
<script>
import { mapGetters , mapActions} from 'vuex';
export default{
  name:"DatabaseTree",
  props:["folder","select","currentId"],
  data(){
    return{
      addParams:{
        label:"",
        children:[]
      },
      noteData:{
        children:[]
      }
    }
  },
  computed:{
    ...mapGetters(["catalog"])
  },
  methods:{}
}
</script>
