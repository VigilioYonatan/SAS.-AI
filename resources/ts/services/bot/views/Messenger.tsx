// import AdminBreadCrumb from "@/admin/components/AdminBreadCrumb";
// import Container from "@/admin/components/Container";
// import {
//     Conversation,
//     getConversations,
//     getMessages,
//     Message,
//     sendMessageMessenger,
//     sendSeenMessenger,
// } from "../apis/messenger";
// import Loading from "@/admin/components/Loading";
// import View404 from "@/admin/views/404";
// import { useSignal } from "@preact/signals";
// import { useEffect, useRef } from "preact/hooks";
// import { Fragment } from "preact/jsx-runtime";
// import { sweetAlert, sweetModal } from "@vigilio/sweet";
// import { showTime } from "../../../libs/helpers";
// import { reactComponent } from "~/libs/preact";
// import Form from "~/components/form";
// import {
//     array,
//     Input,
//     instance,
//     minLength,
//     nullable,
//     object,
//     string,
// } from "@vigilio/valibot";
// import validFileValibot, { valibotVigilio } from "~/libs/valibot";
// import { useForm } from "react-hook-form";

import AdminBreadCrumb from "@/admin/components/AdminBreadCrumb";
import Container from "@/admin/components/Container";

// function Messenger() {
//     const nextPage = useSignal<string | null>(null);
//     const messagesQuery = getConversations(nextPage.value);
//     const sendmessage = object({
//         message: nullable(string([minLength(1)])),
//         files: nullable(
//             array(instance(File), [
//                 validFileValibot({
//                     required: true,
//                     min: 1,
//                     max: 1,
//                     types: null,
//                 }),
//             ])
//         ),
//     });

//     type Sendmessage = Input<typeof sendmessage>;
//     const onSendMessageForm = useForm<Sendmessage>({
//         resolver: valibotVigilio(sendmessage),
//         defaultValues: { files: null, message: null },
//     });
//     const message = onSendMessageForm.watch("message");
//     const chatBox = useRef<HTMLDivElement | null>(null);
//     function onScrolling() {
//         const chatContainer = chatBox.current;
//         if (chatContainer) {
//             setTimeout(() => {
//                 chatContainer.scrollTop = chatContainer.scrollHeight;
//             }, 100);
//         }
//     }
//     useEffect(() => {
//         onScrolling();
//     }, []);

//     useEffect(() => {
//         console.log({ message });

//         onScrolling();
//     }, [message]);
//     let chat: JSX.Element | null | JSX.Element[] = null;
//     if (messagesQuery.isLoading) {
//         chat = <Loading />;
//     }
//     if (messagesQuery.isError) {
//         chat = <View404 />;
//     }
//     if (messagesQuery.isSuccess) {
//         const userID = useSignal<null | string>(
//             messagesQuery.data?.data.length
//                 ? messagesQuery.data?.data[0].id
//                 : null
//         );
//         const chats = useSignal<Conversation[]>(
//             messagesQuery.data?.data as Conversation[]
//         );
//         const sendSeenMessengerMutation = sendSeenMessenger();
//         const sendMessageMessengerMutation = sendMessageMessenger();
//         const getMessagesQuery = getMessages(userID.value ?? "");
//         let message: JSX.Element | JSX.Element[] | null = null;

//         if (getMessagesQuery.isLoading) {
//             message = <Loading />;
//         }
//         if (getMessagesQuery.isError) {
//             message = <View404 />;
//         }
//         if (getMessagesQuery.isSuccess) {
//             const messagesData = useSignal<Message[]>(
//                 getMessagesQuery.data?.data ?? []
//             ); // esto no cambia

//             useEffect(() => {
//                 messagesQuery.refetch();
//             }, [nextPage.value]);
//             useEffect(() => {
//                 getMessagesQuery.refetch();
//             }, [userID.value]);
//             useEffect(() => {
//                 messagesData.value = getMessagesQuery.data?.data as Message[];
//             }, [getMessagesQuery.data]);

//             function onSendMessage(body: Sendmessage) {
//                 if (!body.message && !body.files) return;
//                 const recipientId = messagesData.value.filter(
//                     (msg) => msg.from.id !== "1478478932424655"
//                 )[0]!;
//                 sendMessageMessengerMutation.mutate(
//                     {
//                         messageText: body.message ? body.message : null,
//                         recipientId: recipientId.from.id as string,
//                         file: body.files ? body.files[0] : null,
//                     },
//                     {
//                         onSuccess(data) {

//                             onSendMessageForm.reset();
//                             messagesData.value = [
//                                 ...messagesData.value,
//                                 {
//                                     message: body.message,
//                                     created_time: String(Date.now()),
//                                     from: {
//                                         id: "1478478932424655",
//                                         name: "",
//                                         photo: "",
//                                     },
//                                     attachments: body.files
//                                         ? { data: [{}] }
//                                         : null,
//                                 },
//                             ];
//                             sweetAlert({
//                                 icon: "success",
//                                 title: "Enviado correctamente",
//                             });
//                         },
//                         onError() {
//                             sweetAlert({
//                                 icon: "danger",
//                                 title: "No se envió correctamente.",
//                             });
//                         },
//                     }
//                 );
//             }
//             message = (
//                 <div class="p-4  w-full h-[500px] overflow-auto" ref={chatBox}>
//                     {/* <span>{getMessagesQuery.data?.data}</span> */}
//                     <div class="flex flex-col gap-3  mb-5">
//                         {messagesData.value.toReversed().map((message, i) => (
//                             // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
//                             <Fragment key={i}>
//                                 {message.from.id !== "1478478932424655" ? (
//                                     <div class=" font-normal bg-background-light dark:bg-background-dark dark:text-white shadow  p-2 rounded-md flex flex-col   w-[250px]">
//                                         {message.attachments ? (
//                                             <>
//                                                 {message.attachments.data[0].mime_type.startsWith(
//                                                     "image"
//                                                 ) ? (
//                                                     <img
//                                                         width={200}
//                                                         height={200}
//                                                         src={
//                                                             message.attachments
//                                                                 .data[0]
//                                                                 .image_data
//                                                                 .preview_url
//                                                         }
//                                                         onClick={() => {
//                                                             sweetModal({
//                                                                 html: reactComponent(
//                                                                     <div>
//                                                                         <img
//                                                                             src={
//                                                                                 message
//                                                                                     .attachments
//                                                                                     .data[0]
//                                                                                     .image_data
//                                                                                     .url
//                                                                             }
//                                                                             alt=""
//                                                                         />
//                                                                     </div>
//                                                                 ),
//                                                                 showCloseButton:
//                                                                     true,
//                                                                 isCloseInBackground:
//                                                                     false,
//                                                             });
//                                                         }}
//                                                         alt=""
//                                                     />
//                                                 ) : (
//                                                     <a
//                                                         href={
//                                                             message.attachments
//                                                                 .data[0]
//                                                                 .file_url
//                                                         }
//                                                         class="text-xs"
//                                                     >
//                                                         Archivo{" "}
//                                                         {
//                                                             message.attachments
//                                                                 .data[0].name
//                                                         }{" "}
//                                                         -{" "}
//                                                         {(
//                                                             message.attachments
//                                                                 .data[0].size /
//                                                             1048576
//                                                         ).toFixed(2)}{" "}
//                                                         MB
//                                                     </a>
//                                                 )}
//                                             </>
//                                         ) : (
//                                             <p class="text-sm font-semibold">
//                                                 {message.message}
//                                             </p>
//                                         )}

//                                         <span class="text-xs  self-end">
//                                             {showTime(message.created_time)}
//                                         </span>
//                                     </div>
//                                 ) : (
//                                     <div class="font-normal bg-[#E1FEC4] px-2 py-1 rounded-md self-end flex flex-col shadow-sm w-[250px]">
//                                         {message.attachments ? (
//                                             <>
//                                                 {message.attachments.data[0].mime_type.startsWith(
//                                                     "image"
//                                                 ) ? (
//                                                     <img
//                                                         width={200}
//                                                         height={200}
//                                                         src={
//                                                             message.attachments
//                                                                 .data[0]
//                                                                 .image_data
//                                                                 .preview_url
//                                                         }
//                                                         onClick={() => {
//                                                             sweetModal({
//                                                                 html: reactComponent(
//                                                                     <div>
//                                                                         <img
//                                                                             src={
//                                                                                 message.attachments!
//                                                                                     .data[0]
//                                                                                     .image_data
//                                                                                     .url
//                                                                             }
//                                                                             alt=""
//                                                                         />
//                                                                     </div>
//                                                                 ),
//                                                                 showCloseButton:
//                                                                     true,
//                                                                 isCloseInBackground:
//                                                                     false,
//                                                             });
//                                                         }}
//                                                         alt=""
//                                                     />
//                                                 ) : (
//                                                     <a
//                                                         href={
//                                                             message.attachments
//                                                                 .data[0]
//                                                                 .file_url
//                                                         }
//                                                         class="text-xs"
//                                                     >
//                                                         Archivo{" "}
//                                                         {
//                                                             message.attachments
//                                                                 .data[0].name
//                                                         }{" "}
//                                                         -{" "}
//                                                         {(
//                                                             message.attachments
//                                                                 .data[0].size /
//                                                             1048576
//                                                         ).toFixed(2)}{" "}
//                                                         MB
//                                                     </a>
//                                                 )}
//                                             </>
//                                         ) : (
//                                             <p class="text-sm font-semibold">
//                                                 {message.message}
//                                             </p>
//                                         )}

//                                         <span class="text-xs self-end">
//                                             {showTime(message.created_time)}
//                                         </span>
//                                     </div>
//                                 )}
//                             </Fragment>
//                         ))}
//                     </div>{" "}
//                     {userID.value ? (
//                         <Form
//                             {...onSendMessageForm}
//                             className="flex gap-2 px-4 rounded-md absolute bottom-0 left-0 right-0"
//                             onSubmit={onSendMessage}
//                         >
//                             <Form.control.file
//                                 name="files"
//                                 title=""
//                                 fileNormal="small"
//                                 multiple={false}
//                             />
//                             <input
//                                 type="text"
//                                 class="w-full py-2  text-xs rounded-md outline-none px-2"
//                                 placeholder="Enviar mensaje"
//                                 {...onSendMessageForm.register("message")}
//                                 id=""
//                             />
//                             <button
//                                 class="px-4 py-2 flex justify-center items-center    font-light bg-primary rounded-md text-white"
//                                 type="submit"
//                                 aria-label="send message"
//                             >
//                                 <i class="fa-solid fa-paper-plane-top" />
//                             </button>
//                         </Form>
//                     ) : null}
//                 </div>
//             );
//         }
//         chat = (
//             <>
//                 <div class="w-[100px] flex flex-col gap-2 overflow-auto">
//                     {chats.value
//                         // solo chat que tienen 2 participantes
//                         .filter((val) => val.participants.data.length === 2)
//                         .map((chat) => (
//                             <div
//                                 class="flex-col flex justify-center items-center relative"
//                                 key={chat.id}
//                                 onClick={() => {
//                                     userID.value = chat.id;
//                                     sendSeenMessengerMutation.mutate({
//                                         conversationId: "9179955045347845",
//                                     });
//                                 }}
//                             >
//                                 <img
//                                     width={30}
//                                     height={30}
//                                     src="https://www.vigilio-services.com/images/settings/logo-white.webp"
//                                     alt=""
//                                 />
//                                 {chat.unread_count > 0 ? (
//                                     <span class="bg-primary rounded-full font-bold absolute w-[15px] h-[15px] flex justify-center items-center text-white text-xs top-0 right-0">
//                                         {chat.unread_count}
//                                     </span>
//                                 ) : null}
//                                 <span class="text-xs line-clamp-2 font-semibold text-center">
//                                     {chat.participants.data[0].name}
//                                 </span>
//                             </div>
//                         ))}
//                     <div class="grid grid-cols-2">
//                         <button
//                             type="button"
//                             onClick={() => {
//                                 nextPage.value = messagesQuery.data?.paging
//                                     ?.cursors.before as string;
//                             }}
//                         >
//                             {"<"}
//                         </button>
//                         <button
//                             type="button"
//                             onClick={() => {
//                                 nextPage.value = messagesQuery.data?.paging
//                                     ?.cursors.after as string;
//                             }}
//                         >
//                             {">"}
//                         </button>
//                     </div>
//                 </div>
//                 <div class="w-full relative">{message}</div>
//             </>
//         );
//     }
//     return (
//         <Container className="p-2">
//             <div className=" flex flex-col gap-4">
//                 <AdminBreadCrumb current="Messenger" />
//             </div>
//             <div class="flex gap-2 items-center md:justify-between flex-wrap justify-center">
//                 <div />
//                 <a
//                     href="/auth/facebook"
//                     type="button"
//                     class="bg-gradient-to-br from-purple-500 to-pink-500 text-white font-semibold py-2 px-4 rounded-full hover:shadow-lg"
//                     aria-label="login messenger"
//                 >
//                     <i class="fa-brands fa-instagram" /> Iniciar Sessión
//                 </a>
//             </div>
//             <div class="flex h-[500px] overflow-auto">{chat}</div>
//         </Container>
//     );
// }

// export default Messenger;

function Messenger() {
	return (
		<Container className="p-2">
			<div className=" flex flex-col gap-4">
				<AdminBreadCrumb current="Messenger" />
			</div>
			<div class="min-h-[600px] w-[500px] flex items-center flex-col">
				<h3 class="text-primary font-bold text-xl text-center">Muy Pronto</h3>
				<p class="text-sm dark:text-white font-semibold  text-center">
					Siguenos en nuestras redes sociales para ver nuevas novedades <br />
					<a
						href="https://www.vigilio-services.com"
						target="_blank"
						rel="noreferrer"
						class="text-primary hover:underline"
					>
						Más información
					</a>
				</p>
				<img
					class="object-contain"
					width={300}
					height={300}
					src="/images/settings/others/astronaut.png"
					alt=""
				/>
			</div>
		</Container>
	);
}

export default Messenger;
