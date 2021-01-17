<template>
  <div>
    <input type="text" :value="value" v-bind="$attrs" @input="onInput" />
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: String,
      default: '',
    },
  },
  methods: {
    onInput(e) {
      this.$emit('input', e.target.value);

      // 向KFormItem组件派发事件， 需要注意组件的父子关系。如果组件是爷孙关系，考虑用dispatch的方式
      this.$parent.$emit('validate');
    },
  },
};
</script>

<style lang="less" scoped>
</style>
