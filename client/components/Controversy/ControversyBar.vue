<template>
  <form>
    <button
        @click="like"
    >
    👍
    </button>
    <button
        @click="dislike"
    >
    👎
    </button>

  </form>
</template>


<script>

export default {
  name: "ControversyBar",
  data() {
    return {
        alerts: {} // Displays success/error messages encountered during freet modification
    };
  },
  props: {
    freetId: String
  },
  methods: {
    async like() {
        try {
            this.$store.commit('likeFreet', freetId);
        } catch (e) {
            this.$set(this.alerts, e, 'error');
            setTimeout(() => this.$delete(this.alerts, e), 3000);
        }
    },
    async dislike() {
        try {
            this.$store.commit('dislikeFreet', freetId);
        } catch (e) {
            this.$set(this.alerts, e, 'error');
            setTimeout(() => this.$delete(this.alerts, e), 3000);
        }
    }
  }
};

</script>