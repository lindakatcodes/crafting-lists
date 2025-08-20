/* empty css                          */
import { e as createComponent, r as renderTemplate, g as addAttribute, i as renderHead, j as renderComponent, h as createAstro } from '../astro_BAzrCEj4.mjs';
import 'kleur/colors';
import 'html-escaper';
import { GET } from './all-items_BcSlWHHv.mjs';
import { useSSRContext, defineComponent, ref } from 'vue';
import { ssrRenderList, ssrRenderAttr, ssrIncludeBooleanAttr, ssrLooseContain, ssrInterpolate, ssrRenderStyle } from 'vue/server-renderer';

const _export_sfc = (sfc, props) => {
  const target = sfc.__vccOpts || sfc;
  for (const [key, val] of props) {
    target[key] = val;
  }
  return target;
};

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "ItemForm",
  props: {
    items: {}
  },
  setup(__props, { expose: __expose }) {
    __expose();
    const checkedItems = ref([]);
    const materialList = ref({});
    function clearForm() {
      checkedItems.value = [];
      materialList.value = {};
    }
    async function submit(e) {
      e.preventDefault();
      const formData = new FormData(e.currentTarget);
      const response = await fetch("/api/list-items", {
        method: "POST",
        body: formData
      });
      const data = await response.json();
      materialList.value = data.materials;
    }
    const __returned__ = { checkedItems, materialList, clearForm, submit };
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
});
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<!--[--><form class="mb-4 lg:w-10/12 mx-auto"><fieldset class="border p-3"><legend class="text-center px-1.5">Select items to craft:</legend><div class="mb-4 columns-3xs"><!--[-->`);
  ssrRenderList($props.items, (item) => {
    _push(`<label class="mb-2 flex items-baseline"><input type="checkbox" name="buildItem"${ssrRenderAttr("value", item._id.$uuid)}${ssrIncludeBooleanAttr(Array.isArray($setup.checkedItems) ? ssrLooseContain($setup.checkedItems, item._id.$uuid) : $setup.checkedItems) ? " checked" : ""} class="appearance-none box-border m-1 size-4 bg-zinc-200 border-2 border-zinc-500 checked:bg-rose-700"> ${ssrInterpolate(item.item)} ${ssrInterpolate(item.rarity !== "N/A" ? `(${item.rarity})` : "")}</label>`);
  });
  _push(`<!--]--></div><div class="flex justify-center gap-4"><button type="submit" class="bg-rose-800 hover:bg-rose-900 active:bg-rose-900 py-2 px-3 rounded"> Get Materials </button><button type="button" class="bg-zinc-700 hover:bg-zinc-800 active:bg-zinc-800 py-2 px-3 rounded">Reset</button></div></fieldset></form><div style="${ssrRenderStyle(Object.keys($setup.materialList).length !== 0 ? null : { display: "none" })}" class="mx-auto w-1/4"><h2>Here&#39;s the materials you need:</h2><div><!--[-->`);
  ssrRenderList($setup.materialList, (value, key) => {
    _push(`<p>${ssrInterpolate(`${key}: ${value}`)}</p>`);
  });
  _push(`<!--]--></div></div><!--]-->`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/ItemForm.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const ItemForm = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);

const $$Astro = createAstro();
const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Index;
  let response = await GET();
  const items = await response.json();
  return renderTemplate`<html lang="en" class="bg-zinc-900 text-zinc-200"> <head><meta charset="utf-8"><link rel="icon" type="image/svg+xml" href="/favicon.svg"><meta name="viewport" content="width=device-width"><meta name="generator"${addAttribute(Astro2.generator, "content")}><title>Craft Lists</title>${renderHead()}</head> <body class="py-8 px-6"> <h1 class="text-center mb-4">Let's Craft in Lego Fortnite!</h1> ${renderComponent($$result, "ItemForm", ItemForm, { "client:load": true, "items": items, "client:component-hydration": "load", "client:component-path": "@/components/ItemForm.vue", "client:component-export": "default" })} </body></html>`;
}, "C:/Users/linda/Documents/LindaKatProjects/crafting-lists/src/pages/index.astro", void 0);

const $$file = "C:/Users/linda/Documents/LindaKatProjects/crafting-lists/src/pages/index.astro";
const $$url = "";

export { $$Index as default, $$file as file, $$url as url };
