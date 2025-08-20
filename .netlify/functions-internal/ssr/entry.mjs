import { renderers } from './renderers.mjs';
import { manifest } from './manifest_D30oxxAm.mjs';
import * as serverEntrypointModule from '@astrojs/netlify/ssr-function.js';
import { onRequest } from './_noop-middleware.mjs';

const _page0 = () => import('./chunks/generic_CT4pi5oa.mjs');
const _page1 = () => import('./chunks/all-items_BtgoGUMr.mjs');
const _page2 = () => import('./chunks/list-items_DG_2NJt1.mjs');
const _page3 = () => import('./chunks/index_CQ_RUpeS.mjs');
const pageMap = new Map([
    ["node_modules/astro/dist/assets/endpoint/generic.js", _page0],
    ["src/pages/api/all-items.ts", _page1],
    ["src/pages/api/list-items.ts", _page2],
    ["src/pages/index.astro", _page3]
]);

const _manifest = Object.assign(manifest, {
    pageMap,
    renderers,
    middleware: onRequest
});
const _args = {
    "middlewareSecret": "677522cc-3c0d-4652-a81a-72ec1af12e01"
};
const _exports = serverEntrypointModule.createExports(_manifest, _args);
const __astrojsSsrVirtualEntry = _exports.default;
const _start = 'start';
if (_start in serverEntrypointModule) {
	serverEntrypointModule[_start](_manifest, _args);
}

export { __astrojsSsrVirtualEntry as default, pageMap };
