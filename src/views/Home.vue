<template>
  <div class="grid-container-inner">
    <div class="home">

      <img alt="Vue logo" src="../assets/icon-on-yellow.svg">

      <h1 class="title" >NextNovate interne projecten</h1>
    </div>
    <div class="filler"></div>
  </div>
</template>

<script>

export default {
  name: 'Home',
  components: {
  }
}
</script>

<style scoped>

  .home {
    display: inline-block;
    justify-content: center;
    grid-row-start: 3;
    grid-column-start: 2;
    grid-column-end: 5;
  }

  img {
    width: 12%;
  }

  .title {
    justify-content: center;
    padding: 40px;
    color:#999;
  }

  .filler {
    grid-column-start: 5;
    grid-column-end: 5;
  }
</style>
