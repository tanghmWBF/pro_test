// 首页
const home = () => import('../views/home/index')
const systemModel = () => import('../views/systemModel/index')
const modelData = () => import('../views/modelData/index')
const editModel = () => import('../views/editModel/index')
const details = () => import('../views/modelDetails/index')

const base = [
  {
    path: '/',
    redirect: '/home',
    meta: {
      title: '首页'
    }
  },
  {
    path: '/home',
    name: 'home',
    component: home,
    meta: {
      title: '首页'
    }
  },
  {
    path: '/systemModel',
    name: 'systemModel',
    component: systemModel,
    meta: {
      title: '系统模型'
    }
  },
  {
    path: '/modelData',
    name: 'modelData',
    component: modelData,
    meta: {
      title: '模板库'
    }
  },
  {
    path: '/editModel',
    name: 'editModel',
    component: editModel,
    meta: {
      title: '编辑模版'
    }
  },
  {
    path: '/details',
    name: 'details',
    component: details,
    meta: {
      title: '详情页面'
    }
  }
]

export default base
