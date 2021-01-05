/* eslint-disable no-const-assign */
// * 实现构造函数
let Vue;
class Router {
  /**
   * options也就是new Router之后传过来的值
   * @param {Object} options
   */
  constructor(options) {
    this.$options = options;
    // 截取hash的值
    const initial = window.location.hash.slice(1) || '/';

    // 响应式的给current附上最新的值 这样 在组件页面router-view里面  this.$router.current拿到的就是最新的
    Vue.util.defineReactive(this, 'current', initial);

    // 监听路由的变化， 定义current的属性来接收
    window.addEventListener('hashchange', () => {
      this.current = window.location.hash.slice(1);
    });
  }
}

// * 实现插件
Router.install = (_Vue) => {
  // 引用构造函数 使用Vue来接收 也可以是其他任意值 为保持一致 使用Vue
  Vue = _Vue;

  // *  使用Vue.mixin混入函数 在Vue的原型上挂载$router
  // *  这样在每个组件的router-view里面都能使用$router
  Vue.mixin({
    beforeCreate() {
      // ! 只有根实例才有this.$options.router
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
      // * 遍历路由表 获取当前路由的路径
      const currentRoute = this.$router.$options.routes.find(
        (route) => route.path === this.$router.current,
      );
      // * 拿到当前的组件
      if (currentRoute) {
        component = currentRoute.component;
      }
      return h(component);
    },
  });
};

export default Router;
