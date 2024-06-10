<script setup lang="ts">

import Card from '@/components/Card.vue'
import { onMounted, ref } from 'vue'
import type { Item } from '@/pages/Home.vue'
import axios from 'axios'

const items = ref<Item[]>([]);

const fetchFavorites = async () => {
  try {
    const { data } = await axios.get(`https://eb5c2106385dea30.mokky.dev/favorites?_relations=items`)
    items.value = data.map((o: Item) => {
      o.item.isFavorite = true;
      return o.item;
    });
  } catch (err) {
    console.log(err)
  }
}

onMounted(async () => {
  await fetchFavorites();
})
</script>

<template>
  <h1 class="text-3xl font-bold">Мои закладки</h1>
  <div
    v-if="items.length"
    class="grid grid-cols-4 gap-10"
  >
    <Card
      v-for="item in items"
      :key="item.id"
      :title="item.title"
      :price="item.price"
      :imageUrl="item.imageUrl"
      :item="item"
      :isFavorite="item.isFavorite"
    />
  </div>
  <div v-else>Favorites is Empty</div>
</template>
