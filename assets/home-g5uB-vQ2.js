/**
 * name: figma
 * version: v0.0.0
 * description: 
 * author: 
 */
import{d as k,r as _,k as h,l as d,q as D,t as $,o as f,v as p,u as r,M as E,x as w,g as M,y as T,I as F,T as z,C as P,S as B,z as I,A as j,P as L,B as N,F as A,D as H,E as V,G as W,H as q,J as O,K as G}from"./lucide-vue-next-BVk8P4ok.js";import{_ as m}from"./_plugin-vue_export-helper-DlAUqK2U.js";import{f as g}from"./fabric-B-Dms2P0.js";import{v as b}from"./uuid-C6aID195.js";import"./@bassist/progress-DxCYE3TM.js";const J={class:"popover-container"},K=k({__name:"Popover",setup(e,{expose:o}){const n=_(!1),t=_(null),s=()=>{n.value=!n.value};return o({closePopover:()=>{n.value=!1}}),(i,v)=>(f(),h("div",J,[d("div",{onClick:s,class:"popover-trigger"},[$(i.$slots,"trigger",{},void 0)]),n.value?(f(),h("div",{key:0,class:"popover-content",ref_key:"popoverContent",ref:t},[$(i.$slots,"content",{},void 0)],512)):D("",!0)]))}}),U=m(K,[["__scopeId","data-v-ffdf4a79"]]),Q={class:"tool-belt"},X={class:"icon-group"},Y={class:"select-container"},Z={class:"bg-[#1e1e1e]"},R=["onClick"],ee={class:"ml-3 text-white text-[13px]"},te=k({__name:"ToolBelt",props:{selectedShapeRef:{},setSelectedShapeRef:{type:Function}},setup(e){const o=e,n=_(null),t=_("shape"),s=[{icon:I,name:"Rectangle",type:"rect"},{icon:B,name:"Line",type:"line"},{icon:P,name:"Ellipse",type:"ellipse"},{icon:z,name:"Triangle",type:"triangle"}],u={rect:I,line:B,ellipse:P,triangle:z,image:F};function i(l){t.value=l}function v(l){o.setSelectedShapeRef(l),n.value&&(console.log(n.value),n.value.closePopover()),i("shape")}return(l,a)=>(f(),h("div",Q,[d("div",{class:w(["icon-container",{cur:r(t)==="move"}]),onClick:a[0]||(a[0]=c=>i("move"))},[p(r(E),{size:20,"stroke-width":1,color:r(t)==="move"?"white":"black"},null,8,["color"])],2),d("div",X,[d("div",{class:w(["icon-container",{cur:r(t)==="shape"}]),onClick:a[1]||(a[1]=c=>i("shape"))},[(f(),M(T(u[l.selectedShapeRef]),{size:20,"stroke-width":1,color:r(t)==="shape"?"white":"black"},null,8,["color"]))],2),d("div",null,[p(U,{ref_key:"popoverRef",ref:n},{trigger:j(()=>[d("div",Y,[p(r(O),{size:12,"stroke-width":1})])]),content:j(()=>[d("div",Z,[(f(),h(A,null,H(s,c=>d("div",{key:c.type,class:"shape-tool-item",onClick:y=>v(c.type)},[p(r(V),{size:12,"stroke-width":1,color:"white",style:W({opacity:l.selectedShapeRef===c.type?1:0})},null,8,["style"]),(f(),M(T(c.icon),{size:16,"stroke-width":1,class:"ml-1",color:"white"})),d("div",ee,q(c.name),1)],8,R)),64))])]),_:1},512)])]),d("div",{class:w(["icon-container",{cur:r(t)==="creation"}]),onClick:a[2]||(a[2]=c=>i("creation"))},[p(r(L),{size:20,"stroke-width":1,color:r(t)==="creation"?"white":"black"},null,8,["color"])],2),d("div",{class:w(["icon-container",{cur:r(t)==="text"}]),onClick:a[3]||(a[3]=c=>i("text"))},[p(r(N),{size:20,"stroke-width":1,color:r(t)==="text"?"white":"black"},null,8,["color"])],2)]))}}),oe=m(te,[["__scopeId","data-v-fde56171"]]),ne={},se={class:"bg-white w-[300px]"};function le(e,o){return f(),h("div",se)}const ae=m(ne,[["render",le]]),ce={},re={class:"bg-white w-[300px]"};function ie(e,o){return f(),h("div",re)}const ue=m(ce,[["render",ie]]),de=(e,o)=>{switch(e){case"rect":return ve(o);case"triangle":return pe(o);case"ellipse":return _e(o);case"line":return fe(o);case"text":return he(o,"Tap to Type");default:return null}},ve=e=>new g.fabric.Rect({left:e.x,top:e.y,width:100,height:100,fill:"#d9d9d9",objectId:b()}),pe=e=>new g.fabric.Triangle({left:e.x,top:e.y,width:100,height:100,fill:"#d9d9d9",objectId:b()}),_e=e=>new g.fabric.Ellipse({left:e.x,top:e.y,rx:100,ry:100,fill:"#d9d9d9",objectId:b()}),fe=e=>new g.fabric.Line([e.x,e.y,e.x+100,e.y+100],{stroke:"#d9d9d9",strokeWidth:2,objectId:b()}),he=(e,o)=>new g.fabric.IText(o,{left:e.x,top:e.y,fill:"#d9d9d9",fontFamily:"Helvetica",fontSize:36,fontWeight:"400",objectId:b()}),me=({fabricRef:e,canvasRef:o})=>{if(!o.value){console.error("Canvas element is not available.");return}const n=o.value;if(!n){console.error("Canvas is not available.");return}const t=new g.fabric.Canvas(o.value,{width:n.clientWidth,height:n.clientHeight,backgroundColor:"#f5f5f5"});return e.value=t,t},ge=({options:e,canvas:o,selectedShapeRef:n,shapeRef:t})=>{const s=o.getPointer(e.e),u=o.findTarget(e.e,!1);o.isDrawingMode=!1,u&&u.type===n.value?(o.setActiveObject(u),u.setCoords()):(t.value=de(n.value,s),t.value&&(t.value.set({visible:!1}),o.add(t.value)))},ye=({options:e,canvas:o,selectedShapeRef:n,shapeRef:t})=>{var u,i,v,l,a,c,y,x,C,S;const s=o.getPointer(e.e);switch(t.value&&t.value.set({visible:!0}),n==null?void 0:n.value){case"rect":(v=t.value)==null||v.set({width:s.x-(((u=t.value)==null?void 0:u.left)||0),height:s.y-(((i=t.value)==null?void 0:i.top)||0)});break;case"ellipse":(c=t.value)==null||c.set({rx:Math.abs(s.x-(((l=t.value)==null?void 0:l.left)||0))/2,ry:Math.abs(s.y-(((a=t.value)==null?void 0:a.top)||0))/2});break;case"triangle":(C=t.value)==null||C.set({width:s.x-(((y=t.value)==null?void 0:y.left)||0),height:s.y-(((x=t.value)==null?void 0:x.top)||0)});break;case"line":(S=t.value)==null||S.set({x2:s.x,y2:s.y});break}o.renderAll()},be=e=>{e.value&&e.value.set({visible:!0}),e.value=null},we={class:"canvas-container"},ke=k({__name:"CanvasContainer",props:{onMounted:{type:Function}},setup(e){const o=_(null),n=e;return G(()=>{n.onMounted(o.value)}),(t,s)=>(f(),h("div",we,[d("canvas",{id:"canvas",ref_key:"canvasRef",ref:o,class:"canvas"},null,512)]))}}),xe=m(ke,[["__scopeId","data-v-769c2f68"]]),Ce={class:"container"},Se=k({__name:"home",setup(e){const o=_(null),n=_(null),t=_(null),s=_("rect");_(null);const u=v=>{s.value=v},i=v=>{o.value=v;const l=me({canvasRef:o,fabricRef:n});l&&(l.on("mouse:down",a=>{ge({options:a,canvas:l,shapeRef:t,selectedShapeRef:s})}),l.on("mouse:move",a=>{ye({options:a,canvas:l,shapeRef:t,selectedShapeRef:s})}),l.on("mouse:up",()=>{be(t)}))};return(v,l)=>{const a=ue,c=ae,y=oe;return f(),h("div",Ce,[p(a),p(xe,{onMounted:i}),p(c),p(y,{selectedShapeRef:r(s),setSelectedShapeRef:u},null,8,["selectedShapeRef"])])}}}),Be=m(Se,[["__scopeId","data-v-2b4e27c4"]]);export{Be as default};
