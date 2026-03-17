<template>
  <div class="admin-switcher cs-card p-2 d-flex flex-wrap gap-2 justify-content-center mb-4">
    <router-link
      v-for="item in items"
      :key="item.to"
      :to="item.to"
      class="admin-switcher-link"
      active-class="active"
    >
      {{ item.label }}
    </router-link>
  </div>
</template>

<script>
export default {
  name: 'AdminSectionSwitcher',
  props: {
    items: {
      type: Array,
      required: true,
    },
  },
}
</script>

<style scoped>
.admin-switcher-link {
  border-radius: 999px;
  padding: 0.55rem 1.05rem;
  font-weight: 700;
  color: #4d5565;
  border: 1px solid rgba(80, 92, 124, 0.2);
  background: rgba(255, 255, 255, 0.72);
  transition: all 0.2s ease;
}

.admin-switcher-link:hover,
.admin-switcher-link.active {
  background: linear-gradient(135deg, var(--cs-primary), var(--cs-accent));
  color: #fff;
  border-color: transparent;
  box-shadow: 0 10px 22px rgba(91, 44, 255, 0.26);
}
</style>
