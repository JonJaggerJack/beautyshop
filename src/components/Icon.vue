<template>
  <svg :class="['icon', `icon-${name}`, sizeClass]" :style="style">
    <use :xlink:href="`/src/assets/icons.svg#icon-${name}`"></use>
  </svg>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  name: {
    type: String,
    required: true,
  },
  size: {
    type: String,
    default: "md",
    validator: (value) => ["xs", "sm", "md", "lg", "xl"].includes(value),
  },
  color: {
    type: String,
    default: "currentColor",
  },
  strokeWidth: {
    type: [String, Number],
    default: 2,
  },
});

const sizeClass = computed(() => `icon-${props.size}`);

const style = computed(() => ({
  color: props.color,
  "--stroke-width": props.strokeWidth,
}));
</script>

<style scoped>
.icon {
  display: inline-block;
  vertical-align: middle;
  stroke: currentColor;
  stroke-width: var(--stroke-width, 2);
  fill: none;
  transition: color 0.3s ease;
}

/* Tailles */
.icon-xs {
  width: 16px;
  height: 16px;
}

.icon-sm {
  width: 20px;
  height: 20px;
}

.icon-md {
  width: 24px;
  height: 24px;
}

.icon-lg {
  width: 32px;
  height: 32px;
}

.icon-xl {
  width: 48px;
  height: 48px;
}
</style>
