<script>
import BlockForm from '@/components/common/BlockForm.vue';

export default {
  name: 'NewProfileForm',
  mixins: [BlockForm],
  data() {
    return {
      url: '/api/profiles',
      method: 'POST',
      hasBody: true,
      fields: [
        {id: 'profileName', label: 'ProfileName', value: ''}
      ],
      title: 'Create Profile',
      callback: () => {
        const message = 'Successfully created a profile!';
        this.$store.commit('refreshProfiles');
        this.$set(this.alerts, message, 'success');
        setTimeout(() => this.$delete(this.alerts, message), 3000);
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