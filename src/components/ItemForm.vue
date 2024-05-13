<script setup lang="ts">
import { ref } from "vue";
import type { ItemObject } from "@/utils/constants";

defineProps<{
  items: ItemObject[];
}>();

const checkedItems = ref([]);
const materialList = ref<object>({});

function clearForm() {
  checkedItems.value = [];
  materialList.value = {};
}

async function submit(e: Event) {
  e.preventDefault();
  const formData = new FormData(e.currentTarget as HTMLFormElement);
  const response = await fetch("/api/list-items", {
    method: "POST",
    body: formData,
  });
  const data = await response.json();
  materialList.value = data.materials;
}
</script>

<template>
  <form @submit="submit" class="mb-4 lg:w-10/12 mx-auto">
    <fieldset class="border p-3">
      <legend class="text-center px-1.5">Select items to craft:</legend>
      <div class="mb-4 columns-3xs">
        <label class="mb-2 flex items-baseline" v-for="item in items">
          <input
            type="checkbox"
            name="buildItem"
            :value="item._id.$uuid"
            v-model="checkedItems"
            class="appearance-none box-border m-1 size-4 bg-zinc-200 border-2 border-zinc-500 checked:bg-rose-700"
          />
          {{ item.item }} {{ item.rarity !== "N/A" ? `(${item.rarity})` : "" }}
        </label>
      </div>
      <div class="flex justify-center gap-4">
        <button @click="clearForm" type="button" class="bg-zinc-700 hover:bg-zinc-800 active:bg-zinc-800 py-2 px-3 rounded">Reset</button>
        <button
          type="submit"
          class="bg-rose-800 hover:bg-rose-900 active:bg-rose-900 py-2 px-3 rounded"
        >
          Get Materials
        </button>
      </div>
    </fieldset>
  </form>

  <div v-show="Object.keys(materialList).length !== 0" class="mx-auto w-1/4">
    <h2>Here's the materials you need:</h2>
    <div>
      <p v-for="(value, key) in materialList">{{ `${key}: ${value}` }}</p>
    </div>
  </div>
</template>
