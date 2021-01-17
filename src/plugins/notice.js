/* eslint-disable no-param-reassign */
import Notice from '@/components/Notice.vue';
import create from '@/utils/create';

export default {
  install(Vue) {
    Vue.prototype.$notice = (props) => {
      const comp = create(Notice, props);
      comp.show();
      return comp;
    };
  },
};
