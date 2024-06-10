<script setup lang="ts">
import { ref, watch, provide, computed } from 'vue'

import Header from './components/Header.vue'
import Drawer from './components/Drawer.vue';
import type { Item } from '@/pages/Home.vue'


const cart = ref<Item[]>([])
const drawerOpen = ref(false)

const totalPrice = computed(() => cart.value.reduce((acc, item) => acc + item.price, 0))
const vatPrice = computed(() => Math.round((totalPrice.value * 5) / 100))

const closeDrawer = () => {
  drawerOpen.value = false
}

const openDrawer = () => {
  drawerOpen.value = true
}

const addToCart = (item: Item) => {
  cart.value.push(item)
  item.isAdded = true
}

const removeFromCart = (item: Item) => {
  cart.value.splice(cart.value.indexOf(item), 1)
  item.isAdded = false
}

watch(
  cart,
  () => {
    localStorage.setItem('cart', JSON.stringify(cart.value))
  },
  { deep: true }
)

provide('cart', {
  cart,
  closeDrawer,
  openDrawer,
  addToCart,
  removeFromCart
})
</script>

<template>
  <Drawer v-if="drawerOpen" :totalPrice="totalPrice" :vatPrice="vatPrice" />

  <div class="bg-white w-4/5 m-auto h-auto rounded-xl shadow-xl mt-14">
    <Header @open-drawer="openDrawer" :totalPrice="totalPrice" />

    <div class="p-10">
      <router-view></router-view>
    </div>
  </div>
</template>
