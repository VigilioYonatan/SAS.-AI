// import { useEffect, useMemo, useRef } from "preact/hooks";
// import { sweetModal } from "@vigilio/sweet";
// import Form from "~/components/form";
// import { isValidDni, isValidRUC, PAYMETHOD, STATUSORDER } from "@/orders/libs";
// import {
//     ordersCartStoreDto,
//     type OrdersCartStoreDto,
// } from "@/orders/dtos/orders-cart.dto";
// import { reactComponent } from "~/libs/preact";
// import Niubiz from "@/cart/views/Niubiz";
// import useEmpresastore, {
//     storageEmpresa,
// } from "@/empresas/stores/empresa.store";
// import WebLayout, { HeaderType } from "@/web/components/WebLayout";
// import { MetodosDePago } from "@/web/components/product/ProductView";
// import { DIALCODE, typeFiscal } from "@/empresas/libs/helpers";
// import { valibotVigilio } from "~/libs/valibot";
// import { useForm } from "react-hook-form";
// import { rucApi } from "@/orders/apis/others/ruc.api";
// import { dniApi } from "@/orders/apis/others/dni.api";
// import { kindInvoiceIndexApi } from "@/orders/apis/kind_invoice.index.api";
// import useAuthStore from "@/auth/stores/auth.store";
// import { useSignal } from "@preact/signals";
// import { formatMoney } from "@/cart/libs/helpers";
// import useProduct, { CouponStore } from "@/products/hooks/useProduct";
// import { printImagesProduct } from "@/products/libs/helpers";
// import { ProductsNormalSchemaFromServer } from "@/products/schemas/products_normal.schema";
// import { citiesIndexApi } from "@/ubigeo/apis/citites.api.index";
// import {
//     RegionsShowAPI,
//     regionsShowMutationApi,
// } from "@/ubigeo/apis/regions.show.api";
// import { useMediaQueryNoReactive } from "~/hooks/useMediaQuery";

// interface ProductCuotaPageProps {
//     product: ProductsNormalSchemaFromServer;
//     header: HeaderType;
// }

// function ProductCuotaPage({ product, header }: ProductCuotaPageProps) {
//     const { discount, couponForm, onCoupon, productCouponMutation } =
//         useProduct({
//             product: product,
//             isService: false,
//         });

//     const authStore = useAuthStore();
//     const empresa = useEmpresastore();
//     const kindInvoiceIndexQuery = kindInvoiceIndexApi();
//     const dniMutation = dniApi();
//     const rucMUtation = rucApi();
//     const regionsShowQuery = regionsShowMutationApi();
//     const city = useSignal<RegionsShowAPI["data"] | null>(null);

//     const ordersCartStoreDtoForm = useForm<OrdersCartStoreDto>({
//         resolver: valibotVigilio(ordersCartStoreDto),
//         defaultValues: {
//             pay_method_id: PAYMETHOD.efectivo, // efectivo
//             status_order_id: STATUSORDER.pendiente, //pedido confirmado
//             address: authStore.state?.address as string,
//             telephone: authStore.state?.telephone as string,
//             description: null,
//             invoice: {
//                 send_sunat: false,
//                 kind_invoice_code:
//                     storageEmpresa?.dial_code === DIALCODE.peru
//                         ? undefined
//                         : "00",
//                 identification_number: authStore.state?.identification_number
//                     ? authStore.state?.identification_number
//                     : null,
//             },
//             user_id: authStore.state ? authStore.state.id : null,
//             isDelivery: true,
//             transferencia_image: null,
//             total: cartStore.methods.getTotal(),
//             map_marker: empresa.state!.enable_map_marker
//                 ? empresa.state!.map_marker
//                 : null,
//             city_id: authStore.state?.city_id ? authStore.state!.city_id : null,
//             mesa_id: null,
//             floor_id: null,
//             fullName: authStore.state?.name ? authStore.state!.name : undefined,
//             email: authStore.state?.email ? authStore.state!.email : undefined,
//             reference: authStore.state?.reference
//                 ? authStore.state!.reference
//                 : undefined,
//             isService: false,
//             seller_id: null,
//             password: null,
//             repeat_password: null,
//             address_id: storageEmpresa!.addresses[0].id as number,
//         },
//         mode: "all",
//     });
//     const map_marker = ordersCartStoreDtoForm.watch("map_marker");

//     const arrayAdress = storageEmpresa?.addresses
//         .filter((address) => address.enabled)
//         .map((address) => ({
//             key: String(address.id),
//             value: `${address.direccion} - ${address.city.name}`,
//         }));
//     const kindInvoice = ordersCartStoreDtoForm.watch(
//         "invoice.kind_invoice_code"
//     );
//     const city_id = ordersCartStoreDtoForm.watch("city_id");
//     const documentCode = ordersCartStoreDtoForm.watch("invoice.document_code");
//     const identificationNumber = ordersCartStoreDtoForm.watch(
//         "invoice.identification_number"
//     );
//     const kind_invoice_code = ordersCartStoreDtoForm.watch(
//         "invoice.kind_invoice_code"
//     );
//     const citiesIndexQuery = citiesIndexApi();

//     const citiesSelect = useMemo(() => {
//         if (citiesIndexQuery.isSuccess && citiesIndexQuery.data) {
//             return citiesIndexQuery.data.data.map((value) => ({
//                 key: value.id,
//                 value: `${value.region.name} - ${value.name}`,
//             }));
//         }
//         return [];
//     }, [citiesIndexQuery.data, citiesIndexQuery.isSuccess]);

//     const arrayKindInvoices = useMemo(
//         () =>
//             kindInvoiceIndexQuery.isSuccess && kindInvoiceIndexQuery.data
//                 ? kindInvoiceIndexQuery.data.data
//                       .filter((kind) =>
//                           empresa.state?.certificado &&
//                           empresa.state?.enabled_igv
//                               ? kind.code === "01" || kind.code === "03"
//                               : kind.code === "00"
//                       )
//                       .map((kind) => ({
//                           key: kind.code,
//                           value: kind.name,
//                       }))
//                 : [],
//         [kindInvoiceIndexQuery]
//     );

//     useEffect(() => {
//         if (kindInvoice) {
//             ordersCartStoreDtoForm.setValue(
//                 "invoice.identification_number",
//                 null
//             );

//             ordersCartStoreDtoForm.setValue("invoice.document_code", null);
//             ordersCartStoreDtoForm.setValue("invoice.razon_social", null);
//             if (kindInvoice === "00") {
//                 /* @ts-ignore */
//                 ordersCartStoreDtoForm.setValue("invoice", {
//                     razon_social: null,
//                     document_code: null,
//                     send_sunat: false,
//                     identification_number: null,
//                     kind_invoice_code: "00",
//                 });
//             }
//             if (kindInvoice === "01") {
//                 ordersCartStoreDtoForm.setValue("invoice.document_code", "6"); //6 ruc
//             }
//             if (kindInvoice === "03") {
//                 ordersCartStoreDtoForm.setValue("invoice.document_code", "1"); //1 dni
//             }
//         }
//     }, [kindInvoice]);

//     useEffect(() => {
//         if (
//             identificationNumber &&
//             storageEmpresa?.dial_code === DIALCODE.peru
//         ) {
//             ordersCartStoreDtoForm.clearErrors("invoice.razon_social");

//             if (documentCode === "1") {
//                 if (isValidDni.test(identificationNumber)) {
//                     dniMutation.mutate(identificationNumber, {
//                         onSuccess(data) {
//                             ordersCartStoreDtoForm.setValue(
//                                 "invoice.razon_social",
//                                 data.data.nombre_completo
//                             );
//                             ordersCartStoreDtoForm.setValue(
//                                 "fullName",
//                                 data.data.nombre_completo
//                             );
//                         },
//                         onError() {
//                             ordersCartStoreDtoForm.setValue(
//                                 "invoice.razon_social",
//                                 ""
//                             );
//                             ordersCartStoreDtoForm.setError(
//                                 "invoice.identification_number",
//                                 {
//                                     message: "DNI no valido",
//                                 }
//                             );
//                         },
//                     });
//                 } else {
//                     ordersCartStoreDtoForm.setValue("invoice.razon_social", "");
//                     ordersCartStoreDtoForm.setError(
//                         "invoice.identification_number",
//                         {
//                             message: "DNI no valido",
//                         }
//                     );
//                 }
//             }
//             if (documentCode === "6") {
//                 if (isValidRUC.test(identificationNumber)) {
//                     rucMUtation.mutate(identificationNumber, {
//                         onSuccess(data) {
//                             ordersCartStoreDtoForm.setValue(
//                                 "invoice.razon_social",
//                                 data.result.razon_social
//                             );
//                         },
//                         onError() {
//                             ordersCartStoreDtoForm.setValue(
//                                 "invoice.razon_social",
//                                 ""
//                             );
//                             ordersCartStoreDtoForm.setError(
//                                 "invoice.identification_number",
//                                 {
//                                     message: "RUC no valido",
//                                 }
//                             );
//                         },
//                     });
//                 } else {
//                     ordersCartStoreDtoForm.setValue("invoice.razon_social", "");
//                     ordersCartStoreDtoForm.setError(
//                         "invoice.identification_number",
//                         {
//                             message: "RUC no valido",
//                         }
//                     );
//                 }
//             }
//         }
//     }, [documentCode, identificationNumber]);

//     // GET RESULT district when user choose district
//     async function citySelect(city_id: number) {
//         const region = citiesIndexQuery.data?.data.find(
//             (ct) => ct.id === city_id
//         );
//         if (region) {
//             const result = await regionsShowQuery.mutateAsync(region.region_id);
//             city.value = result?.data as RegionsShowAPI["data"];
//         }
//     }

//     useEffect(() => {
//         if (city_id) {
//             citySelect(city_id);
//         }
//     }, [city_id]);

//     function onCartOrderStore(body: OrdersCartStoreDto) {
//         if (!body.fullName) {
//             ordersCartStoreDtoForm.setError(
//                 "fullName",
//                 { message: "Este campo es obligatorio." },
//                 { shouldFocus: true }
//             );
//             return;
//         }

//         if (!body.city_id && storageEmpresa?.enable_sell_country) {
//             ordersCartStoreDtoForm.setError(
//                 "city_id",
//                 { message: "Este campo es obligatorio." },
//                 { shouldFocus: true }
//             );
//             return;
//         }
//         if (
//             storageEmpresa?.enabled_dni_cart &&
//             !body.invoice?.identification_number
//         ) {
//             ordersCartStoreDtoForm.setError(
//                 "invoice.identification_number",
//                 { message: "Este campo es obligatorio." },
//                 { shouldFocus: true }
//             );
//             return;
//         }
//         if (body.invoice && body.invoice.kind_invoice_code !== "00") {
//             if (!body.invoice.identification_number) {
//                 ordersCartStoreDtoForm.setError(
//                     "invoice.identification_number",
//                     { message: "Este campo es obligatorio." },
//                     { shouldFocus: true }
//                 );
//                 return;
//             }
//             if (
//                 documentCode === "1" &&
//                 !isValidDni.test(body.invoice.identification_number)
//             ) {
//                 ordersCartStoreDtoForm.setError(
//                     "invoice.identification_number",
//                     { message: "Dni no válido" },
//                     { shouldFocus: true }
//                 );
//                 return;
//             }
//             if (
//                 documentCode === "6" &&
//                 !isValidRUC.test(body.invoice.identification_number)
//             ) {
//                 ordersCartStoreDtoForm.setError(
//                     "invoice.identification_number",
//                     { message: "Ruc no válido" },
//                     { shouldFocus: true }
//                 );
//                 return;
//             }
//             if (!body.invoice.razon_social) {
//                 ordersCartStoreDtoForm.setError(
//                     "invoice.razon_social",
//                     { message: "Este campo es obligatorio." },
//                     { shouldFocus: true }
//                 );
//                 return;
//             }
//         }
//         if (!authStore.state) {
//             if (!password?.length) {
//                 ordersCartStoreDtoForm.setError("password", {
//                     message: "Este campo es obligatorio",
//                 });
//                 return;
//             }
//             if (!repeatPassword?.length) {
//                 ordersCartStoreDtoForm.setError("repeat_password", {
//                     message: "Este campo es obligatorio",
//                 });
//                 return;
//             }
//             if (password !== repeatPassword) {
//                 ordersCartStoreDtoForm.setError("repeat_password", {
//                     message: "Contraseña no similares",
//                 });
//                 return;
//             }
//             ordersCartStoreDtoForm.clearErrors("repeat_password");
//         }
//         sweetModal((onClose) => ({
//             html: reactComponent(
//                 <Niubiz
//                     ordersCartStoreDtoForm={ordersCartStoreDtoForm}
//                     ordersCartStoreDto={body}
//                     onClose={onClose}
//                 />
//             ),
//             isCloseInBackground: false,
//             showCloseButton: true,
//             position: useMediaQueryNoReactive("(min-width:600px)")
//                 ? "center"
//                 : "start",
//         }));
//     }
//     const password = ordersCartStoreDtoForm.watch("password");
//     const repeatPassword = ordersCartStoreDtoForm.watch("repeat_password");
//     useEffect(() => {
//         if (password !== repeatPassword) {
//             ordersCartStoreDtoForm.setError("repeat_password", {
//                 message: "Contraseña no similares",
//             });
//             return;
//         }
//         ordersCartStoreDtoForm.clearErrors("repeat_password");
//     }, [password, repeatPassword]);

//     return (
//         <WebLayout header={header}>
//             <section class="max-w-6xl mx-auto  m-4 items-center justify-center  pb-20 pt-24 lg:pt-8 px-4 flex flex-col md:flex-row gap-4">
//                 <div class="md:w-1/2 w-full self-start flex justify-center flex-col  gap-4 items-center bg-background-light dark:bg-background-dark rounded-md p-4">
//                     <img
//                         class="h-[300px] object-cover"
//                         width={500}
//                         height={500}
//                         src={printImagesProduct(product.images, 500)[0]}
//                         alt={product.name}
//                     />{" "}
//                     <div class="flex flex-col gap-2 items-center justify-center pb-4 w-full">
//                         <div class="flex gap-2 text-gray-400 dark:text-gray-300 text-xs font-semibold">
//                             {product.category?.icon ? (
//                                 <div
//                                     dangerouslySetInnerHTML={{
//                                         __html: product.category.icon,
//                                     }}
//                                 />
//                             ) : null}

//                             <span>{product.category.name}</span>
//                         </div>
//                         <a
//                             href={`/${product.slug}`}
//                             class="text-primary font-bold dark:text-white line-clamp-2 text-xl  "
//                         >
//                             {product.name}
//                         </a>{" "}
//                     </div>
//                     <Form
//                         {...couponForm}
//                         onSubmit={onCoupon}
//                         className="flex gap-2 items-center [&>div>div>div>div>input]:bg-white [&>div>div>div>div>input]:text-black dark:[&>div>div>div>div>input]:bg-background-dark"
//                     >
//                         <div class="w-full flex-col ">
//                             {discount.value ? (
//                                 <p class="text-xs text-primary">
//                                     Se agregó {discount.value}% de descuento
//                                 </p>
//                             ) : null}
//                             <Form.control.web
//                                 type="text"
//                                 title="¿Tienes un cupón de descuento?"
//                                 placeholder="XXXXX-XXXXX-XXXXX"
//                                 name={"coupon" as keyof CouponStore}
//                                 disabled={!!discount.value}
//                             />
//                         </div>
//                         <Form.button.submit
//                             disabled={productCouponMutation.isLoading || false}
//                             isLoading={productCouponMutation.isLoading || false}
//                             title=""
//                             className="w-[40px] h-[40px] flex justify-center items-center"
//                             ico={
//                                 discount.value ? (
//                                     <span>x</span>
//                                 ) : (
//                                     <i class="fa-solid fa-magnifying-glass text-base" />
//                                 )
//                             }
//                         />
//                     </Form>
//                 </div>
//                 <Form
//                     className="[&>div]:h-auto flex flex-col justify-center items-center p-4 bg-background-light dark:bg-background-dark md:w-1/2"
//                     {...ordersCartStoreDtoForm}
//                     onSubmit={onCartOrderStore}
//                 >
//                     {storageEmpresa?.enabled_igv ? (
//                         <div class="flex items-center justify-between h-max">
//                             <span class="dark:text-white font-bold text-base lg:text-xl " />
//                             <span class="font-bold dark:text-gray-400 text-gray-400 text-xs ">
//                                 {storageEmpresa?.tipo_impuesto.toUpperCase()}{" "}
//                                 Incluido
//                             </span>
//                         </div>
//                     ) : (
//                         <></>
//                     )}
//                     <div class="flex justify-between w-full">
//                         <span class="dark:text-white font-semibold">
//                             Cuota:
//                         </span>
//                         <span class="text-primary font-bold text-xl">
//                             {formatMoney(product.price)}
//                         </span>
//                     </div>
//                     <div class="w-full flex gap-2 items-center">
//                         <Form.control.web
//                             name={"telephone" as keyof OrdersCartStoreDto}
//                             title="Numero de celular"
//                             type="tel"
//                             ico={
//                                 <span class="font-bold">
//                                     +{storageEmpresa?.dial_code}
//                                 </span>
//                             }
//                             question={
//                                 <span>
//                                     Este campo no es obligatorio. <br />
//                                     Se te enviará comprobante de pago a
//                                     whatsapp.
//                                 </span>
//                             }
//                         />
//                     </div>
//                     {!authStore.state ? (
//                         <span class="text-xs text-start block self-start font-semibold">
//                             <b class="text-danger ">*</b> Estas apunto de crear
//                             una cuenta para realizar esta compra
//                         </span>
//                     ) : (
//                         <></>
//                     )}
//                     <Form.control.web
//                         ico={<i class="fas fa-at" />}
//                         name={"email" as keyof OrdersCartStoreDto}
//                         title="Correo Electrónico"
//                         type="email"
//                         placeholder="micorreo@gxxx.com"
//                     />
//                     {storageEmpresa?.enabled_address ? (
//                         <>
//                             <Form.control.web
//                                 ico={<i class="fas fa-map-marker-alt" />}
//                                 name={"address" as keyof OrdersCartStoreDto}
//                                 title="Dirección"
//                             />
//                             {empresa.state!.enable_map_marker ? (
//                                 <div class="w-full">
//                                     <Form.control.map
//                                         name={
//                                             "map_marker" as keyof OrdersCartStoreDto
//                                         }
//                                         title="Ubicación para encontrarte mejor"
//                                         style={{
//                                             height: "200px",
//                                             width: "100%",
//                                             zIndex: 0,
//                                         }}
//                                         isLocal
//                                         question="Para encontrarte mejor, por favor indícanos tu ubicación."
//                                     />
//                                     <span class="text-[10px] dark:text-white">
//                                         Lng: {map_marker?.lng}, Lat:{" "}
//                                         {map_marker?.lat}
//                                     </span>
//                                 </div>
//                             ) : (
//                                 <></>
//                             )}
//                         </>
//                     ) : (
//                         <></>
//                     )}
//                     {[DIALCODE.peru].includes(
//                         storageEmpresa!.dial_code as DIALCODE
//                     ) ? (
//                         <Form.control.web.select
//                             title="Tipo de comprobante"
//                             name={
//                                 "invoice.kind_invoice_code" as keyof OrdersCartStoreDto
//                             }
//                             placeholder="Seleccione comprobante"
//                             ico={<i class="fas fa-ticket-alt" />}
//                             array={arrayKindInvoices}
//                             disabled={dniMutation.isLoading || false}
//                         />
//                     ) : (
//                         <></>
//                     )}
//                     {storageEmpresa?.dial_code === DIALCODE.peru ? (
//                         <>
//                             {documentCode === "1" || documentCode === "6" ? (
//                                 <>
//                                     <Form.control.web
//                                         title={
//                                             documentCode === "1"
//                                                 ? "Documento Nacional de Identidad (DNI)"
//                                                 : "Registro Único de Contribuyentes (RUC)"
//                                         }
//                                         name={"invoice.identification_number"}
//                                         placeholder="Digite su identificación"
//                                     />
//                                     {dniMutation.isLoading ||
//                                     rucMUtation.isLoading ? (
//                                         <span>cargando...</span>
//                                     ) : (
//                                         <></>
//                                     )}
//                                     {storageEmpresa?.dial_code ===
//                                     DIALCODE.peru ? (
//                                         <Form.control.web
//                                             title={
//                                                 documentCode === "1"
//                                                     ? "Nombre"
//                                                     : "Razon Social"
//                                             }
//                                             disabled
//                                             name={"invoice.razon_social"}
//                                             placeholder={`Digite su ${
//                                                 documentCode === "1"
//                                                     ? "Nombre"
//                                                     : "Razon Social"
//                                             }`}
//                                         />
//                                     ) : (
//                                         <></>
//                                     )}
//                                 </>
//                             ) : (
//                                 <></>
//                             )}
//                         </>
//                     ) : (
//                         <></>
//                     )}
//                     <div
//                         class={`${
//                             storageEmpresa?.dial_code !== DIALCODE.peru &&
//                             storageEmpresa!.enabled_dni_cart
//                                 ? "grid grid-cols-2"
//                                 : "grid grid-cols-1"
//                         } gap-2 w-full`}
//                     >
//                         <Form.control.web
//                             name={"fullName" as keyof OrdersCartStoreDto}
//                             title="Nombre Completo"
//                             ico={<i class="fas fa-user" />}
//                             placeholder="John Doe"
//                             disabled={!!authStore.state?.email}
//                         />
//                         {storageEmpresa!.enabled_dni_cart &&
//                         kind_invoice_code === "00" ? (
//                             <Form.control.web
//                                 title={`${
//                                     typeFiscal[
//                                         storageEmpresa?.dial_code as keyof typeof typeFiscal
//                                     ].type_dni
//                                 }/${
//                                     typeFiscal[
//                                         storageEmpresa?.dial_code as keyof typeof typeFiscal
//                                     ].type_fiscal
//                                 }`}
//                                 name={"invoice.identification_number"}
//                                 ico={<i class="fas fa-id-card" />}
//                             />
//                         ) : (
//                             <></>
//                         )}
//                     </div>
//                     {!authStore.state ? (
//                         <div class="grid grid-cols-2 gap-2 w-full">
//                             <Form.control.web
//                                 name={"password" as keyof OrdersCartStoreDto}
//                                 title="Contraseña"
//                                 type="password"
//                                 ico={<i class="fas fa-lock text-sm" />}
//                                 question={
//                                     <span>
//                                         Contraseña para registrarte a nuestra
//                                         web.
//                                     </span>
//                                 }
//                                 placeholder=""
//                             />
//                             <Form.control.web
//                                 name={
//                                     "repeat_password" as keyof OrdersCartStoreDto
//                                 }
//                                 title="Confirmar contraseña"
//                                 type="password"
//                                 ico={<i class="fas fa-lock text-sm" />}
//                                 placeholder=""
//                             />
//                         </div>
//                     ) : (
//                         <></>
//                     )}
//                     <span class="text-sm dark:text-white mt-3">
//                         Sus datos personales se utilizarán para procesar su
//                         pedido, respaldar su experiencia en este sitio web y
//                         para otros fines descritos en nuestra{" "}
//                         <a
//                             href="/politica-de-privacidad"
//                             class=" hover:underline  text-primary font-semibold"
//                         >
//                             politica de privacidad
//                         </a>
//                         .
//                     </span>
//                     <Form.button.submit
//                         ico={null}
//                         className="flex justify-center w-full px-5 py-3 text-center"
//                         title="Realizar Pago"
//                         disabled={dniMutation.isLoading || false}
//                         isLoading={false}
//                     />
//                     <ul class="flex flex-col gap-2 w-full bg-orange-100 px-2 py-5 rounded-lg mt-3">
//                         <li class="flex justify-between items-center flex-col overflow-auto  text-black">
//                             {storageEmpresa?.metodos_pago.enable_efectivo ? (
//                                 <>
//                                     <span class="text-sm font-bold dark:text-paper-dark">
//                                         Realiza un pedido en efectivo
//                                     </span>
//                                     <span class="text-sm font-bold">ó</span>
//                                 </>
//                             ) : null}
//                             <MetodosDePago isEfectivo={false} />
//                         </li>
//                     </ul>
//                 </Form>
//             </section>
//             <style jsx>{`
//                 .vigilio-modal {
//                     z-index: 999 !important;
//                 }
//             `}</style>
//         </WebLayout>
//     );
// }

// export default ProductCuotaPage;
