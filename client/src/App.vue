<template>
  <div id="app">
    <transition name="router-anim">
      <router-view />
    </transition>
  </div>
</template>

<script>
import '@/assets/css/main.css';

export default {
  data() {
    return {};
  },
};
</script>


<style>
@import url("https://fonts.googleapis.com/css?family=Roboto+Condensed");
@import url('https://fonts.googleapis.com/css?family=Varela+Round&display=swap');
@import url('https://fonts.googleapis.com/css?family=Source+Sans+Pro&display=swap');

html,
body {
  margin: 0;
  font-family: "Roboto Condensed", sans-serif;
  overflow-x: hidden;
  overflow-y: hidden;
  background: #F5F6F9;
}

#app {
  width: 100vw;
  height: 100vh;
}
.router-anim-enter-active,
.router-anim-leave-active {
  transition-duration: 0.3s;
  transition-property: opacity;
  transition-timing-function: ease;
}

.router-anim-enter-active {
  transition-delay: .3s;
}

.router-anim-enter,
.router-anim-leave-active {
  opacity: 0
}
</style>
