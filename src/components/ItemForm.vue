<script setup lang="ts">
import { ref } from "vue";
import type { ItemObject } from "@/utils/constants";

defineProps<{
  items: ItemObject[]
}>();

// const responseMessage = ref<string>();

async function submit(e: Event) {
  e.preventDefault();
  const formData = new FormData(e.currentTarget as HTMLFormElement);
  const response = await fetch("/api/list-items", {
    method: "POST",
    body: formData,
  });
  const data = await response.json();
  // responseMessage.value = data.message;
}
</script>

<template>
  <form @submit="submit">
    <fieldset class="border p-3">
      <legend class="text-center px-1.5">Select items to craft:</legend>
      <div class="mb-4 grid">
        <label class="mb-2 flex items-baseline" v-for="item in items">
          <input
            type="checkbox"
            name="buildItem"
            :value="item._id.$uuid"
            class="appearance-none box-border m-1 size-3 bg-zinc-200 border-2 border-zinc-500 checked:bg-rose-700"
          />
          {{item.item}} {{item.rarity !== "N/A" ? `(${item.rarity})` : ""}}
        </label>
      </div>
      <button
        type="submit"
        class="bg-rose-800 hover:bg-rose-900 active:bg-rose-900 py-2 px-3 rounded"
      >
        Submit form
      </button>
    </fieldset>
  </form>
</template>
