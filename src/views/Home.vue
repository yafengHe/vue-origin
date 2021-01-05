<template>
  <div class="home">
    <HelloWorld msg="Welcome to Your Vue.js App"/>
    <p @click="$store.commit('add')">{{$store.state.count}}</p>
    <p @click="$store.dispatch('add')">{{$store.state.count}}</p>
    <p>{{$store.getters.doubleCounter}}</p>
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue';

export default {
  name: 'Home',
  components: {
    HelloWorld,
  },
};
</script>
