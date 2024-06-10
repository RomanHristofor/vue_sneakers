<script setup lang="ts">
import { inject, onMounted, reactive, ref, watch } from 'vue'
import { useStore } from '@/store'
import debounce from 'lodash/debounce'
import axios from 'axios'

import Card from '@/components/Card.vue'
import Select from '@/components/Tools/SelectSearch.vue'
import Input from '@/components/Tools/InputSearch.vue'


export interface Item {
  id: number;
  item_id: number;
  favoriteId: number | null;
  title: string;
  price: number;
  imageUrl: string;
  isFavorite: boolean;
  isAdded: boolean;
}

export interface Cart {
  cart: Item[];
}

interface CartActions {
  addToCart: (item: Item) => void;
  removeFromCart: (item: Item) => void;
}
export type CartContext = Cart & CartActions;

const cartContext = inject<CartContext>('cart')
if (!cartContext) {
  throw new Error('Cart context is not provided');
}
const { cart, addToCart } = cartContext;

// const { setFavorites } = useStore();
const items = ref<Item[]>([]);

const filters = reactive({
  sortBy: 'title',
  searchQuery: ''
})

const onChangeSelect = (event: Event) => {
  const target = event.target as HTMLSelectElement;
  filters.sortBy = target.value;
}

const onChangeSearchInput = debounce((event: Event) => {
  const target = event.target as HTMLInputElement;
  filters.searchQuery = target.value;
}, 400)

const addToFavorite = async (item: Item) => {
  try {
    if (!item.isFavorite) {
      const obj = {
        item_id: item.id,
        // item
      }

      item.isFavorite = true

      const { data } = await axios.post(`https://eb5c2106385dea30.mokky.dev/favorites`, obj)

      item.favoriteId = data.id
    } else {
      item.isFavorite = false
      await axios.delete(`https://eb5c2106385dea30.mokky.dev/favorites/${item.favoriteId}`)
      item.favoriteId = null
    }
  } catch (err) {
    console.log(err)
  }
}

const fetchFavorites = async () => {
  try {
    const { data: favorites } = await axios.get(`https://eb5c2106385dea30.mokky.dev/favorites`)

    items.value = items.value.map((item) => {
      const favorite = favorites.find((favorite: Item) => favorite.item_id === item.id)

      if (!favorite) {
        return item
      }

      return {
        ...item,
        isFavorite: true,
        favoriteId: favorite.id
      }
    })
  } catch (err) {
    console.log(err)
  }
}

const fetchItems = async () => {
  try {
    const params = {
      sortBy: filters.sortBy,
    }

    if (filters.searchQuery) {
      // @ts-ignore
      params.title = `*${filters.searchQuery}*`
    }

    const { data } = await axios.get(`https://eb5c2106385dea30.mokky.dev/items`, {
      params
    })

    items.value = data.map((obj: Item) => ({
      ...obj,
      isFavorite: false,
      favoriteId: null,
      isAdded: false
    }))
  } catch (err) {
    console.log(err)
  }
}

onMounted(async () => {
  const localCart = localStorage.getItem('cart')
  // @ts-ignore
  cart.value = localCart ? JSON.parse(localCart) : [];

  await fetchItems();
  await fetchFavorites();

  items.value = items.value.map((item) => ({
    ...item,
    // @ts-ignore
    isAdded: cart.value.some((cartItem: Item) => cartItem.id === item.id)
  }))

  // const favoritesArray = items.value.filter((item) => item.isFavorite)
  // await setFavorites(favoritesArray)
})

watch(filters, fetchItems)
</script>

<template>
  <div class="flex justify-between items-center mb-10">
    <h1 class="text-3xl font-bold">Все кроссовки</h1>
    <div class="flex items-center gap-4">
      <Select @change="onChangeSelect" />
      <Input @input="onChangeSearchInput" />
    </div>
  </div>

  <div
    v-if="items.length"
    class="grid grid-cols-4 gap-10"
    v-auto-animate
  >
    <Card
      v-for="item in items"
      :key="item.id"
      :title="item.title"
      :price="item.price"
      :imageUrl="item.imageUrl"
      :item="item"
      @add-to-favorite="addToFavorite"
      :addToCart="addToCart"
      :isFavorite="item.isFavorite"
      :isAdded="item.isAdded"
    />
  </div>
  <div v-else>Loading...</div>
</template>
