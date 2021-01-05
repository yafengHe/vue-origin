/* eslint-disable no-use-before-define */
/* eslint-disable array-callback-return */
/* eslint-disable class-methods-use-this */
/* eslint-disable no-underscore-dangle */
// import { partial, forEachValue } from '../utils/index';

let Vue;
class Store {
  constructor(options) {
    this.$options = options;
    this._mutaions = options.mutations || {};
    this._actions = options.actions || {};
    this._wrappedGetters = Object.create(null);

    // resetStoreVM(this, options.state);
    this._vm = new Vue({
      data: {
        $$state: options.state,
      },
    });

    this.getters = {};
    Object.keys(options.getters).forEach((k) => {
      Object.defineProperty(this.getters, k, {
        get() {
          return options.getters[k](options.state);
        },
      });
    });

    this.commit = this.commit.bind(this);
    this.dispatch = this.dispatch.bind(this);
  }

  get state() {
    return this._vm._data.$$state;
  }

  set state(v) {
    console.error('please use replaeState to reset state');
  }

  commit(type, payload) {
    const entry = this._mutaions[type];
    entry(this.state, payload);
  }

  dispatch(type, payload) {
    const entry = this._actions[type];
    entry(this, payload);
  }
}

// function resetStoreVM(store, state) {
//   const computed = {};
//   const wrappedGetters = store._wrappedGetters;
//   forEachValue(wrappedGetters, (fn, key) => {
//     console.log(fn, key);
//     computed[key] = partial(fn, store);
//     Object.defineProperty(store.getters, key, {
//       get: () => store._vm[key],
//       enumerable: true, // for local getters
//     });
//   });

//   this._vm = new Vue({
//     data: {
//       $$state: state,
//     },
//     computed,
//   });
// }

function install(_Vue) {
  Vue = _Vue;

  Vue.mixin({
    beforeCreate() {
      if (this.$options.store) {
        Vue.prototype.$store = this.$options.store;
      }
    },
  });
}

export default { Store, install };
