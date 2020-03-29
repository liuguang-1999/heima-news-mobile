<template>
  <div id="app">
 <!-- 一级路由容器 -->
 <!--  缓存一级路由容器  -->
 <!--  如果 不控制 keep-alive 标签 它会缓存所有的组件实例 这样会造成 内存溢出  -->
 <!--  只要是 keep-alive 标签包裹的组件实例 都会将其全部缓存  -->
 <!--  接下来 要根据 meta 属性来决定是否 要缓存某个组件  -->
 <keep-alive>
   <!-- 这里是 当前需要缓存的组件 -->
    <router-view v-if="$route.meta.isAlive" />
 </keep-alive>
 <!-- 这里是不需要 缓存时的组件 -->
  <router-view v-if="!$route.meta.isAlive" />
  </div>
</template>

<style lang="less">

</style>
