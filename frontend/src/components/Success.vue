<template>
  <v-alert
      type="success"
      icon="mdi-check-circle"
      closable
      @update:modelValue="onHideClick"
      class="mb-5"
  >
    {{ text }}
  </v-alert>
</template>

<script>
export default {
  name: 'Success',

  props: {
    text: {
      type: String,
      required: true
    }
  },

  methods: {
    onHideClick() {
      this.$emit('hide');
    }
  }
}
</script>