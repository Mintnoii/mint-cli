<script setup lang="ts" name="404">
const router = useRouter();
const goBack = () => {
  router.push('/');
};
</script>

<template>
  <div>
    <p class="text-6xl">404</p>
    <p class="text-2xl">页面未找到</p>
    <p>请检查路径后重试或返回首页</p>
    <button class="mb-32px bg-blue-200 p-4 rounded font-bold" @click="goBack">返回首页</button>
  </div>
</template>
<route lang="yaml">
meta:
  layout: BlankLayout
</route>
