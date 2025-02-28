/**
 * name: figma
 * version: v0.0.0
 * description: 
 * author: 
 */
import{e as i,r as l,m as p}from"./lucide-vue-next-BVk8P4ok.js";/*!
 * pinia v2.3.1
 * (c) 2025 Eduardo San Martin Morote
 * @license MIT
 */const u=Symbol();var o;(function(t){t.direct="direct",t.patchObject="patch object",t.patchFunction="patch function"})(o||(o={}));function h(){const t=i(!0),r=t.run(()=>l({}));let a=[],n=[];const c=p({install(e){c._a=e,e.provide(u,c),e.config.globalProperties.$pinia=c,n.forEach(s=>a.push(s)),n=[]},use(e){return this._a?a.push(e):n.push(e),this},_p:a,_a:null,_e:t,_s:new Map,state:r});return c}export{h as c};
