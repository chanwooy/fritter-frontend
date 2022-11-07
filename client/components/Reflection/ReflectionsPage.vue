<!-- Default page that also displays reflections -->

<template>
  <main>
    <section v-if="$store.state.username">
      <header>
        <h2>Welcome @{{ $store.state.username }}</h2>
      </header>
      <CreateReflectionForm />
    </section>
    <section v-else>
      <header>
        <h2>Welcome to Fritter!</h2>
      </header>
      <article>
        <h3>
          <router-link to="/login">
            Sign in
          </router-link>
          to create, edit, and delete reflections.
        </h3>
      </article>
    </section>
    <section>
      <header>
        <div class="left">
          <h2>
            Viewing all reflections
            <span v-if="$store.state.username">
              by @{{ $store.state.username }}
            </span>
          </h2>
        </div>
        <div class="right">
          <GetReflectionsForm
            ref="getReflectionsForm"
            value="author"
            placeholder="🔍 Filter by author (optional)"
            button="🔄 Get reflections"
          />
        </div>
      </header>
      <section
        v-if="$store.state.reflections.length"
      >
        <ReflectionComponent
          v-for="reflection in $store.state.reflections"
          :key="reflection.id"
          :reflection="reflection"
        />
      </section>
      <article
        v-else
      >
        <h3>No reflections found.</h3>
      </article>
    </section>
  </main>
</template>

<script>
import ReflectionComponent from '@/components/Reflection/ReflectionComponent.vue';
import CreateReflectionForm from '@/components/Reflection/CreateReflectionForm.vue';
import GetReflectionsForm from '@/components/Reflection/GetReflectionsForm.vue';

export default {
  name: 'ReflectionPage',
  components: {ReflectionComponent, GetReflectionsForm, CreateReflectionForm},
  mounted() {
    this.$refs.getReflectionsForm.submit();
  }
};
</script>

<style scoped>
section {
  display: flex;
  flex-direction: column;
}

header, header > * {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

button {
    margin-right: 10px;
}

section .scrollbox {
  flex: 1 0 50vh;
  padding: 3%;
  overflow-y: scroll;
}
</style>
