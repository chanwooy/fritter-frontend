<!-- Form for creating reflections (block style) -->

<script>
import BlockForm from '@/components/common/BlockForm.vue';

export default {
  name: 'CreateReflectionForm',
  mixins: [BlockForm],
  data() {
    return {
      url: '/api/reflections',
      method: 'POST',
      hasBody: true,
      fields: [
        {id: 'content', label: 'Content', value: ''}
      ],
      title: 'Create a reflection',
      refreshReflections: true,
      callback: () => {
        const message = 'Successfully created a reflection!';
        this.$set(this.alerts, message, 'success');
        setTimeout(() => this.$delete(this.alerts, message), 3000);
      }
    };
  }
};
</script>
