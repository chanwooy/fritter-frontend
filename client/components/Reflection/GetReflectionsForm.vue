<!-- Form for getting reflections (all, from user) (inline style) -->

<template>
  <form @submit.prevent="submit">
    <section class="alerts">
      <article
        v-for="(status, alert, index) in alerts"
        :key="index"
        :class="status"
      >
        <p>{{ alert }}</p>
      </article>
    </section>
  </form>
</template>

<script>
// import InlineForm from '@/components/common/InlineForm.vue';

export default {
  name: 'GetReflectionsForm',
  data() {
    return {value: this.$store.state.username};
  },
  methods: {
    async submit() {
      if (this.value) {
        const url = `/api/reflections?author=${this.value}`;
        try {
          const r = await fetch(url);
          const res = await r.json();
          if (!r.ok) {
            throw new Error(res.error);
          }
          this.$store.commit('updateReflections', res);
        } catch (e) {
          if (this.value === this.$store.state.filter) {
            // This section triggers if you filter to a user but they
            // change their username when you refresh
            this.$store.commit('updateFilter', null);
            this.$store.commit('refreshReflections');
          }
        }
      } else {
        this.value = this.$store.state.username;
      }
    }
  }
};
</script>
