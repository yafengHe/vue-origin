<template>
  <div>
    <div class="form">
      <label v-if="label">{{ label }}</label>
      <slot></slot>
    </div>
    <div class="error" v-if="error">{{ error }}</div>
    <p>{{ form.rules[this.prop] }}</p>
  </div>
</template>

<script>
import Validator from 'async-validator';

export default {
  inject: ['form'],
  data() {
    return {
      error: '',
    };
  },
  props: {
    label: {
      type: String,
      default: '',
    },
    prop: {
      type: String,
    },
  },
  mounted() {
    this.$on('validate', () => {
      // 执行校验
      this.validate();
    });
  },
  methods: {
    validate() {
      // 获取校验规则
      const rules = this.form.rules[this.prop];
      // 获取值
      const value = this.form.model[this.prop];

      const validator = new Validator({ [this.prop]: rules });

      return validator.validate({ [this.prop]: value }, (errors) => {
        if (errors) {
          // 显示错误信息
          this.error = errors[0].message;
        } else {
          // 校验通过清除错误
          this.error = '';
        }
      });
    },
  },
};
</script>

<style lang="less" scoped>
.form {
  display: flex;
  flex-direction: row;
  align-items: center;
}
</style>
