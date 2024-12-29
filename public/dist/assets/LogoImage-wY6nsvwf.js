import{u as e,w as m}from"./vendor-CZUWYgQd.js";import{p as r}from"./helpers-GTjZ4v-0.js";import{u as t}from"./main-BihXfA-e.js";function g({height:a="100",width:l="100"}){const{state:o}=t();return e("a",{href:"/",children:o!=null&&o.logo?e(m,{children:[e("img",{class:"object-contain image-logo",width:l,height:a,style:{width:l,height:a},src:r(o.logo,300)[0],alt:o.name_empresa,title:o.name_empresa,onLoad:()=>{var s;return(s=r(o.logo,300)[0])!=null&&s.startsWith("blob:")?URL.revokeObjectURL(r(o.logo,300)[0]):null}}),e("style",{jsx:!0,children:`
                        .auth-page .image-logo, app .image-logo {
                            filter: drop-shadow(1px 1px black);
                        }
                    `})]}):e("span",{class:"text-primary text-4xl font-bold",children:o==null?void 0:o.name_empresa[0]})})}export{g as L};
