import { computed } from 'vue';
import type { Item } from '@/pages/Home.vue'
import { createStore } from 'vuex';

interface State {
  favorites: Item[];
}

const store = createStore<State>({
  state: {
    favorites: []
  },
  mutations: {
    setFavorites(state: State, favorites: Item[]) {
      state.favorites = favorites;
    }
  },
  actions: {
    setFavorites({ commit }, favorites: Item[]) {
      commit('setFavorites', favorites);
    }
  },
  getters: {
    favorites: (state: State) => state.favorites
  }
});

export default store;

export function useStore() {
  const favorites = computed(() => store.getters.favorites);
  const setFavorites = (favorites: Item[]) => store.dispatch('setFavorites', favorites);

  return {
    favorites,
    setFavorites
  };
}
