<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400;1,500;1,600;1,700;1,800&display=swap');

#app {
  font-family: 'Noto Sans', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: var(--cs-text);
  min-height: 100vh;
}

h1, h2, h3, h4 {
  letter-spacing: -0.02em;
}

p {
  margin-bottom: 0;
}
</style>
