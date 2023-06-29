<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App',
};
</script>

<style>

.container {
  align-items: center;
}

.button-spacing {
  width: 2vh; /* 定义间距的宽度 */
  display: inline-block;
}
</style>
