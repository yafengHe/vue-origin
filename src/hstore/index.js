import Vue from 'vue';
import Vuex from './hvuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    count: 0,
  },
  mutations: {
    add(state) {
      // eslint-disable-next-line no-plusplus
      state.count++;
    },
  },
  actions: {
    add({ commit }) {
      setTimeout(() => {
        commit('add');
      }, 1000);
    },
  },
  getters: {
    doubleCounter: (state) => {
      console.log(state, 'state ---');
      return state.count * 2;
    },
  },
  modules: {
  },
});
