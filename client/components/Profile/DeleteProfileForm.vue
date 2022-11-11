<script>
import BlockForm from '@/components/common/BlockForm.vue';

export default {
  name: 'DeleteProfileForm',
  mixins: [BlockForm],
  data() {
    return {
      url: '/api/profiles',
      method: 'DELETE',
      title: 'Delete profile',
      hasBody: true,
      fields: [
        {id: 'profileName', label: 'ProfileName', value: ''}
      ],
      content: 'Deleting your profile is permanent and irreversible. Proceed only if you understand these consequences.',
      callback: () => {
        this.$store.commit('refreshProfiles');
        this.$store.commit('alert', {
          message: 'Your profile has been deleted!', status: 'success'
        });
      },
      preprocess: () => {
        this.fields.push({id: 'username', label: 'Username', value: `${this.$store.state.username}`});
      },
      postprocess: () => {
        this.fields.pop();
      }
    };
  }
};
</script>