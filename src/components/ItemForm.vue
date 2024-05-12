<script setup lang="ts">
import { ref } from "vue";
import type { ItemObject } from "@/utils/constants";

defineProps<{
  items: ItemObject[];
}>();

const checkedItems = ref([]);
const materialList = ref<object>();

async function submit(e: Event) {
  e.preventDefault();
  const formData = new FormData(e.currentTarget as HTMLFormElement);
  const response = await fetch("/api/list-items", {
    method: "POST",
    body: formData,
  });
  const data = await response.json();
  materialList.value = data.materials;
  checkedItems.value = [];
  // make a button to clear the form instead of this - let items stay selected and then move the checkedItems reset to the clear button
}
</script>

<template>
  <form @submit="submit" class="mb-4">
    <fieldset class="border p-3">
      <legend class="text-center px-1.5">Select items to craft:</legend>
      <div class="mb-4 grid md:grid-cols-2 lg:grid-cols-3 ps-10">
        <label class="mb-2 flex items-baseline" v-for="item in items">
          <input
            type="checkbox"
            name="buildItem"
            :value="item._id.$uuid"
            v-model="checkedItems"
            class="appearance-none box-border m-1 size-3 bg-zinc-200 border-2 border-zinc-500 checked:bg-rose-700"
          />
          {{ item.item }} {{ item.rarity !== "N/A" ? `(${item.rarity})` : "" }}
        </label>
      </div>
      <div class="flex justify-center">
        <button
          type="submit"
          class="bg-rose-800 hover:bg-rose-900 active:bg-rose-900 py-2 px-3 rounded"
        >
          Submit form
        </button>
      </div>
    </fieldset>
  </form>

  <div v-if="materialList" class="mx-auto w-1/2">
    <h2>Here's all the materials you need to craft your items:</h2>
    <p v-for="(value, key) in materialList">{{ `${key}: ${value}` }}</p>
  </div>
</template>
