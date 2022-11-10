<script>
import BlockForm from '@/components/common/BlockForm.vue';

export default {
  name: 'DeleteProfileForm',
  mixins: [BlockForm],
  data() {
    return {
      url: '/api/profiles',
      method: 'DELETE',
      setUsername: true,
      title: 'Delete profile',
      hasBody: true,
      fields: [
        {id: 'username', label: 'Username', value: ''},
        {id: 'profileName', label: 'ProfileName', value: ''}
      ],
      content: 'Deleting your profile is permanent and irreversible. Proceed only if you understand these consequences.',
      callback: () => {
        this.$store.commit('alert', {
          message: 'Your profile has been deleted!', status: 'success'
        });
      }
    };
  }
};
</script>