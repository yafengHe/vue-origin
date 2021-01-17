import Vue from 'vue';

export default function create(Component, props) {
  // 创建组件实例
  const vm = new Vue({
    render: (h) => h(Component, { props }),
  }).$mount();

  // 追加到body
  document.body.appendChild(vm.$el);

  // 获取组件实例
  const comp = vm.$children[0];

  // 移除
  comp.remove = () => {
    document.body.removeChild(vm.$el);
    vm.$destroy();
  };

  // 返回组件实例
  return comp;
}
