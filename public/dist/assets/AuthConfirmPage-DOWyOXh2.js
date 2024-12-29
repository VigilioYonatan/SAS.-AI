import{y as n,u as r}from"./vendor-CZUWYgQd.js";import{A as s}from"./AuthLogin-TavyGC4b.js";import{i as l,s as t}from"./main-BihXfA-e.js";import{A as a}from"./AlertDanger-Bzvmw3Aq.js";import{A as m}from"./AlertSuccess-9qppflYy.js";import{e as p}from"./index-7sRwzA1E.js";import"./LogoImage-wY6nsvwf.js";import"./helpers-GTjZ4v-0.js";import"./users.schema-xFMUQchK.js";import"./date-CYvbL70B.js";import"./transform-DP6c316D.js";import"./email-BYSdoKcJ.js";import"./helpers-BtIJDS2c.js";function _({user:e}){return n(()=>{var c;if((c=t)!=null&&c.setting.web_script){const o=document.createElement("script"),i=document.querySelector("body");return o.innerHTML=t.setting.web_script,i==null||i.appendChild(o),()=>{document.body.removeChild(o)}}},[]),r("section",{class:"relative flex flex-col-reverse h-screen overflow-hidden sm:grid sm:grid-cols-5 lg:grid-cols-3 auth-page",children:[" ",r("style",{jsx:!0,children:`
                .bg-background-light {
                    ${l(t.setting.bg_color_background)?"color: #000000 !important":"color: #FFFFFF !important"};
                }
                .bg-background-paper {
                    ${l(t.setting.bg_color_paper)?"color: #000000 !important":"color: #FFFFFF !important"};
                }
                .bg-primary {
                    ${l(t.setting.bg_color)?"color: #000000 !important":"color: #FFFFFF !important"};
                }
            `}),r("div",{class:"sticky z-10  dark:bg-background-dark sm:static sm:col-span-3 lg:col-span-1",children:r("div",{class:"col-span-1 flex h-[85vh] flex-col items-start justify-center px-4 sm:h-[calc(100vh-34px)] sm:px-8",children:[r("div",{class:"flex w-full items-center justify-center [&>div]:w-full [&>div>div>b]:text-center [&>div>div>b]:block",children:e?r(m,{children:r("b",{children:[e==null?void 0:e.username," Token válido correctamente."]})}):r(a,{children:r("b",{children:"Token no válido."})})}),r(s,{})]})}),r("img",{width:1200,height:1200,src:p(),alt:"wallpaper",loading:"lazy",class:"object-cover w-full h-screen translate-y-16 sm:col-span-2 sm:translate-y-0 gradient"})]})}export{_ as default};
