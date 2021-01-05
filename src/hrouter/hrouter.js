let Vue;
class VueRouter {
  constructor(options) {
    // console.log(options);
    this.$options = options;
    const initial = window.location.hash.slice(1) || '/';

    Vue.util.defineReactive(this, 'current', initial);

    window.addEventListener('hashchange', () => {
      this.current = window.location.hash.slice(1);
    });
  }
}

VueRouter.install = (_Vue) => {
  Vue = _Vue;

  Vue.mixin({
    beforeCreate() {
      if (this.$options.router) {
        Vue.prototype.$router = this.$options.router;
      }
    },
  });

  Vue.component('router-link', {
    props: {
      to: {
        type: String,
        required: true,
      },
    },
    render(h) {
      return h('a', { attrs: { href: `#${this.to}` } }, this.$slots.default);
    },
  });

  Vue.component('router-view', {
    render(h) {
      let component = null;

      const currentRoute = this.$router.$options.routes.find(
        (route) => route.path === this.$router.current,
      );
      if (currentRoute) {
        component = currentRoute.component;
      }
      return h(component);
    },
  });
};

export default VueRouter;
