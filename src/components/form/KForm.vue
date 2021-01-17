<template>
  <div>
    <slot></slot>
  </div>
</template>

<script>
export default {
  provide() {
    return {
      form: this,
    };
  },
  props: {
    model: {
      type: Object,
      required: true,
    },
    rules: {
      type: Object,
    },
  },
  methods: {
    // 全局的校验方法
    validate(cb) {
      console.log('cb', cb); // sy-log
      const results = this.$children
        .filter((item) => item.prop)
        .map((item) => item.validate());
      console.log('results', results); // sy-log

      Promise.all(results)
        .then(() => cb(true))
        .catch(() => cb(false));
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
