<script setup lang="ts" name="SvgIcon">
interface Props {
    prefix?: string
    name?: string
    color?: string
    size?: number
    className?: string
}

const props = withDefaults(defineProps<Props>(), {
    prefix: 'svg-icon',
    name: '',
    color: '#fff',
    size: 16,
    className: 'svg-icon'
})

const symbolId = computed(() => `#${props.prefix}-${props.name}`)
// const svgClass = computed(() => props.name ? 'svg-icon ' + props.name : 'svg-icon')
</script>

<template>
  <svg aria-hidden="true" :width="size" :height="size" :class="className">
    <use :xlink:href="symbolId" :fill="color" />
  </svg>
</template>
<style lang="scss" scoped>
.svg-icon {
    vertical-align: -0.15em;
    fill: currentColor;
    overflow: hidden;
}
</style>
