import{k as d,l as y,y as i,u as e,w as v,g as w}from"./vendor-CZUWYgQd.js";import{u as S}from"./helpers-GTjZ4v-0.js";import{l as T}from"./index-7sRwzA1E.js";import{u as C,a as E}from"./useNotifications-Bpwv6Prq.js";import{r as j,d as A}from"./main-BihXfA-e.js";import{u as L}from"./socket.store-BiOY2f2D.js";function $({onClose:u,isOpen:p}){const s=d([]),r=S(),c=y(null),{io:t,connectSocket:m}=L(),h=r.watch("message"),o=d(!1),[f]=C(),{handleTouchEnd:x,handleTouchStart:b}=E();async function g(a){o.value||(o.value=!0,r.reset(),s.value=[...s.value,["user",a.message]],t==null||t.emit("chat:send-message",a),await A(1))}function l(){const a=c.current;a&&setTimeout(()=>{a.scrollTop=a.scrollHeight},100)}return i(()=>{l(),m()},[]),i(()=>{l()},[h]),i(()=>(t==null||t.on("chat:ai",a=>{s.value=a??[],l()}),()=>t==null?void 0:t.off("chat:ai")),[t]),i(()=>(t==null||t.on("chat:send-message",a=>{s.value=[...s.value,a],l(),o.value=!1}),()=>t==null?void 0:t.off("chat:send-message")),[t]),e("div",{class:`${p?"block":"hidden"} p-2  rounded-md overflow-hidden  shadow-primary bg-background-light dark:bg-paper-dark w-[250px] md:w-[300px] h-[350px] md:h-[405px] absolute bottom-7 md:bottom-12 z-[99] m-4 right-0  shadow`,children:[e("div",{class:"flex flex-col",children:[e("h3",{class:" dark:text-white text-primary font-bold text-center text-xl",children:[e("i",{class:"fas fa-user-robot mr-2"})," Asistente Virtual"]}),e("a",{href:T(),target:"_blank",rel:"noreferrer",class:"text-[11px] opacity-70   text-center dark:text-white",children:["Powered by"," ",e("b",{class:" text-primary dark:text-white",children:"Vigilio Services"})]})]}),e("button",{class:"absolute right-0 m-2 top-0 dark:text-white",type:"button",onClick:u,children:"X"}),e("div",{class:"bg-primary w-full h-[1px]"}),e("div",{ref:c,class:"flex flex-col h-[320px] gap-1.5 m-1 overflow-auto form-chat mb-12  p-3",children:[s.value.map(([a,n],k)=>e(v,{children:a==="assistant"?e("div",{class:" font-normal bg-paper-light border dark:bg-background-dark dark:!text-white shadow  p-2 rounded-md flex flex-col ",onTouchStart:()=>b(()=>{f(j(n)).then(()=>{w({icon:"success",title:"Copiado correctamente"})})}),onTouchEnd:x,children:e("div",{class:"text-sm font-semibold",dangerouslySetInnerHTML:{__html:n}})}):e("div",{class:"text-[0.6rem] font-normal bg-[#E1FEC4] px-2 py-1 rounded-md self-end flex flex-col text-black",children:e("p",{class:"text-sm font-semibold",children:n})})},`${n}${k+1}`)),o.value?e("div",{class:" font-normal bg-paper-light  dark:bg-background-dark dark:text-white px-4 py-1 rounded-md  self-start",children:e("div",{class:"mensaje-tipeando",children:[e("span",{class:"punto",children:"."}),e("span",{class:"punto",children:"."}),e("span",{class:"punto",children:"."})]})}):null]}),e("form",{onSubmit:r.handleSubmit(g),class:"absolute bottom-0 right-0 left-0  flex   overflow-auto  h-[38px]  rounded-md dark:bg-paper-dark bg-background-light",children:[e("input",{class:"w-full  outline-none px-1  bg-transparent text-xs dark:text-white",type:"text",...r.register("message",{required:{value:!0,message:"Este campo es obligatorio"},maxLength:{value:300,message:"Máximo 300 carácteres"}}),placeholder:"Enviar mensaje"}),e("button",{class:"px-4 py-2 flex justify-center items-center text-white  text-xs font-light bg-primary",type:"submit","aria-label":"send message",children:e("i",{class:"fa-solid fa-paper-plane-top"})})]}),e("style",{jsx:!0,children:`
                .form-chat {
                    scrollbar-color: black;
                    scrollbar-width: thin;
                }
                .mensaje-tipeando {
                    display: inline-block;
                }

                .punto {
                    animation: moverPunto 1s infinite;
                    opacity: 0;
                    display: inline-block;
                }

                @keyframes moverPunto {
                    0% {
                        opacity: 0;
                    }
                    25% {
                        opacity: 1;
                    }
                    50% {
                        opacity: 0;
                    }
                    75% {
                        opacity: 1;
                    }
                    100% {
                        opacity: 0;
                    }
                }

                .punto:nth-child(2) {
                    animation-delay: 0.2s;
                }

                .punto:nth-child(3) {
                    animation-delay: 0.4s;
                }
            `})]})}export{$ as A};
