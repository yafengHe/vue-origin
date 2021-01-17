<template>
  <div>
    <KForm :model="model" :rules="rules" ref="loginForm">
      <!-- vue的数据双向绑定 -->
      <!-- <KInput v-model="model.username" @input="input" />
      <KInput v-model="model.username" @input="model.username = $event" /> -->
      <KFormItem label="用户名" prop="username">
        <KInput v-model="model.username" placeholder="用户名" />
      </KFormItem>
      <KFormItem>
        <button @click="onLogin">Login</button>
      </KFormItem>
    </KForm>
  </div>
</template>

<script>
import KInput from '@/components/form/KInput.vue';
import KForm from '@/components/form/KForm.vue';
import KFormItem from '@/components/form/KFormItem.vue';

export default {
  data() {
    return {
      model: {
        username: '',
      },
      rules: {
        username: [{ required: true, message: 'username is must' }],
      },
    };
  },
  components: {
    KInput,
    KForm,
    KFormItem,
  },
  methods: {
    input(e) {
      console.log('e', e); // sy-log
      this.model.username = e;
    },
    onLogin() {
      console.log('loginForm', this.$refs.loginForm); // sy-log
      this.$refs.loginForm.validate((isValid) => {
        console.log('isValid', isValid); // sy-log
        this.$notice({
          title: 'this is a notice',
          message: isValid ? 'success' : 'fail',
        });
      });
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
