import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';

Vue.use(Vuex);

/**
 * Storage for data that needs to be accessed from various compoentns.
 */
const store = new Vuex.Store({
  state: {
    filter: null, // Username to filter shown freets by (null = show all)
    freets: [], // All freets created in the app,
    reflections: [], // All reflections created in the app,
    username: null, // Username of the logged in user
    currentProfile: null,
    alerts: {}, // global success/error messages encountered during submissions to non-visible forms
    profiles: []
  },
  mutations: {
    alert(state, payload) {
      /**
       * Add a new message to the global alerts.
       */
      Vue.set(state.alerts, payload.message, payload.status);
      setTimeout(() => {
        Vue.delete(state.alerts, payload.message);
      }, 3000);
    },
    setUsername(state, username) {
      /**
       * Update the stored username to the specified one.
       * @param username - new username to set
       */
      state.username = username;
    },
    updateFilter(state, filter) {
      /**
       * Update the stored freets filter to the specified one.
       * @param filter - Username of the user to fitler freets by
       */
      state.filter = filter;
    },
    updateFreets(state, freets) {
      /**
       * Update the stored freets to the provided freets.
       * @param freets - Freets to store
       */
      state.freets = freets;
    },
    updateReflections(state, reflections) {
      /**
       * Update the stored reflections to the provided reflections.
       * @param reflections - Reflections to store
       */
      state.reflections = reflections;
    },
    updateProfiles(state, profiles) {
      /**
       * Update the stored profiles to the provided profiles.
       * @param profiles - profiles to store
       */
      state.profiles = profiles;
    },
    changeProfile(state, profile) {
      // change the current profile to the given profile
      state.currentProfile = profile;
    },
    async refreshFreets(state) {
      /**
       * Request the server for the currently available freets.
       */
      const url = state.filter ? `/api/users/${state.filter}/freets` : '/api/freets';
      const res = await fetch(url).then(async r => r.json());
      state.freets = res;
    },
    async refreshReflections(state) {
      /**
       * Request the server for the currently available reflections.
       */
      if (state.username) {
        const url = `/api/reflections/${ state.username }`;
        const res = await fetch(url).then(async r => r.json());
        state.reflections = res;
      }
      
    },
    async refreshProfiles(state) {
      /**
       * Request the server for the currently available freets.
       */
      if (state.username) {
        const url = `/api/profiles/?user=${state.username}`;
        const res = await fetch(url).then(async r => r.json());
        state.profiles = res;
      } else {
        state.profiles = [];
      }
    },
    async likeFreet(state, freetId) {
      const url = `/api/freets/dislike/${freetId}`;
      await fetch(url);
    },
    async dislikeFreet(state, freetId) {
      const url = `/api/freets/like/${freetId}`;
      await fetch(url);
    }
  },
  // Store data across page refreshes, only discard on browser close
  plugins: [createPersistedState()]
});

export default store;
