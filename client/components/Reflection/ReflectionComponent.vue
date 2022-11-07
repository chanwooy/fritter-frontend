<!-- Reusable component representing a single reflection and its actions -->

<template>
  <article
    class="reflection"
  >
    <header>
      <h3 class="author">
        @{{ reflection.author }}
      </h3>
      <div
        v-if="$store.state.username === reflection.author"
        class="actions"
      >
        <button
          v-if="editing"
          @click="submitEdit"
        >
          ✅ Save changes
        </button>
        <button
          v-if="editing"
          @click="stopEditing"
        >
          🚫 Discard changes
        </button>
        <button
          v-if="!editing"
          @click="startEditing"
        >
          ✏️ Edit
        </button>
        <button @click="deleteReflection">
          🗑️ Delete
        </button>
      </div>
    </header>
    <textarea
      v-if="editing"
      class="content"
      :value="draft"
      @input="draft = $event.target.value"
    />
    <p
      v-else
      class="content"
    >
      {{ reflection.content }}
    </p>
    <p class="info">
      Posted at {{ reflection.dateModified }}
      <i v-if="reflection.edited">(edited)</i>
    </p>
    <section class="alerts">
      <article
        v-for="(status, alert, index) in alerts"
        :key="index"
        :class="status"
      >
        <p>{{ alert }}</p>
      </article>
    </section>
  </article>
</template>

<script>
export default {
  name: 'ReflectionComponent',
  props: {
    // Data from the stored reflection
    reflection: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      editing: false, // Whether or not this reflection is in edit mode
      draft: this.reflection.content, // Potentially-new content for this reflection
      alerts: {} // Displays success/error messages encountered during reflection modification
    };
  },
  methods: {
    startEditing() {
      /**
       * Enables edit mode on this reflection.
       */
      this.editing = true; // Keeps track of if a reflection is being edited
      this.draft = this.reflection.content; // The content of our current "draft" while being edited
    },
    stopEditing() {
      /**
       * Disables edit mode on this reflection.
       */
      this.editing = false;
      this.draft = this.reflection.content;
    },
    deleteReflection() {
      /**
       * Deletes this reflection.
       */
      const params = {
        method: 'DELETE',
        callback: () => {
          this.$store.commit('alert', {
            message: 'Successfully deleted reflection!', status: 'success'
          });
        }
      };
      this.request(params);
    },
    submitEdit() {
      /**
       * Updates reflection to have the submitted draft content.
       */
      if (this.reflection.content === this.draft) {
        const error = 'Error: Edited reflection content should be different than current reflection content.';
        this.$set(this.alerts, error, 'error'); // Set an alert to be the error text, timeout of 3000 ms
        setTimeout(() => this.$delete(this.alerts, error), 3000);
        return;
      }

      const params = {
        method: 'PATCH',
        message: 'Successfully edited reflection!',
        body: JSON.stringify({content: this.draft}),
        callback: () => {
          this.$set(this.alerts, params.message, 'success');
          setTimeout(() => this.$delete(this.alerts, params.message), 3000);
        }
      };
      this.request(params);
    },
    async request(params) {
      /**
       * Submits a request to the reflection's endpoint
       * @param params - Options for the request
       * @param params.body - Body for the request, if it exists
       * @param params.callback - Function to run if the the request succeeds
       */
      const options = {
        method: params.method, headers: {'Content-Type': 'application/json'}
      };
      if (params.body) {
        options.body = params.body;
      }

      try {
        const r = await fetch(`/api/reflections/${this.reflection._id}`, options);
        if (!r.ok) {
          const res = await r.json();
          throw new Error(res.error);
        }

        this.editing = false;
        this.$store.commit('refreshReflections');

        params.callback();
      } catch (e) {
        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    }
  }
};
</script>

<style scoped>
.freet {
    border: 1px solid #111;
    padding: 20px;
    position: relative;
}
</style>
