<template>
  <form @submit.prevent="submit">
    <h3> Change Profile </h3>

    <select name="profiless" id="profileDrop">
        <option
            v-for="profile in this.$store.state.profiles"
            :key="profile.id"
            :value="profile.profileName"
        >
            {{ profile.profileName }}
        </option>
    </select>
    <button
      type="submit"
    >
        Change Profile
    </button>
  </form>
</template>


<script>

export default {
  name: 'ChangeProfileName',
  data() {
    return {profileName: this.$store.state.currentProfile};
  },
  methods: {
    async submit() {
        try {
            // get the selected profile
            const elt = document.getElementById("profileDrop");
            const selectedProfile = elt.value;
            // TODO: review
            this.$store.commit('changeProfile', selectedProfile);
            this.$store.commit('refreshProfiles');
        } catch (e) {
            this.$store.commit('refreshProfiles');
            this.$set(this.alerts, e, 'error');
            setTimeout(() => this.$delete(this.alerts, e), 3000);
        }
    },
    async start() {
        const url = `/api/profiles`;
        try {
            const r = await fetch(url);
            const res = await r.json();
            if (!r.ok) {
                throw new Error(res.error);
            }

            this.$store.commit('updateProfiles', res);
        } catch (e) {
            this.$store.commit('refreshProfiles');
            this.$set(this.alerts, e, 'error');
            setTimeout(() => this.$delete(this.alerts, e), 3000);
        }
    }
  }
};
</script>
