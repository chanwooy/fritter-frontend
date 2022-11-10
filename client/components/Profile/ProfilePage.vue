<!-- Page for account settings and management -->
<!-- User should be authenticated in order to see this page -->

<template>
  <main>
    <section>
      <header>
        <h2>Profile settings for @{{ $store.state.username }}</h2>
      </header>
      <header>
        <h2>Current Profile: @{{ $store.state.currentProfile }}</h2>
      </header>
    </section>

    <section>
      <header>
        <h2>Profile Management</h2>
      </header>
      <NewProfileForm />
      <ChangeProfileName
        ref="changeProfileName"
      />
      <DeleteProfileForm />
    </section>
  </main>
</template>

<script>
import NewProfileForm from '@/components/Profile/NewProfileForm.vue';
import DeleteProfileForm from '@/components/Profile/DeleteProfileForm.vue';
import ChangeProfileName from '@/components/Profile/ChangeProfileName.vue';

export default {
  name: 'ProfilePage',
  components: {
    NewProfileForm,
    DeleteProfileForm,
    ChangeProfileName
  },
  mounted() {
    this.$refs.changeProfileName.submit();
  }
};
</script>
