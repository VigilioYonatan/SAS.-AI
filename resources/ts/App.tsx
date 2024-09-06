import AdminLayout from "@/admin/components/AdminLayout";
import View404 from "@/admin/views/404";
import { storageInformation } from "@/information/stores/information.store";
import { Suspense, lazy } from "preact/compat";
import { Switch, Router, Route } from "wouter-preact";

function App() {
	return (
		<Router base="/admin">
			<AdminLayout>
				<Suspense fallback={null}>
					<Switch>
						<Route
							path="/"
							component={lazy(() => import("@/admin/views/Dashboard"))}
						/>
						<Route
							path="/empresa"
							component={lazy(
								() => import("@/information/views/InformationUpdate"),
							)}
						/>
						<Route
							path="/horario"
							component={lazy(
								() => import("@/information/views/InformationSchedule"),
							)}
						/>
						<Route
							path="/direccion"
							component={lazy(
								() => import("@/information/views/InformationAddressUpdate"),
							)}
						/>
						{storageInformation?.tipo_empresa.tipo_servicio_id === 1 ? (
							<>
								<Route
									path="/local"
									component={lazy(() => import("@/admin/views/Local"))}
								/>
								<Route
									path="/productos"
									component={lazy(
										() => import("@/products/views/ProductsIndex"),
									)}
								/>
							</>
						) : null}
						{storageInformation?.tipo_empresa.tipo_servicio_id === 2 ? (
							<>
								<Route
									path="/local"
									component={lazy(() => import("@/admin/views/MesasLocal"))}
								/>
								<Route
									path="/productos"
									component={lazy(
										() => import("@/products/views/ProductsRestaurantIndex"),
									)}
								/>
							</>
						) : null}
						{storageInformation?.tipo_empresa.tipo_servicio_id === 3 ? (
							<Route
								path="/servicios"
								component={lazy(
									() => import("@/products/views/ServiciosIndex"),
								)}
							/>
						) : null}
						<Route
							path="/cupones"
							component={lazy(() => import("@/products/views/CouponsIndex"))}
						/>
						<Route
							path="/usuarios"
							component={lazy(() => import("@/users/views/UsersIndex"))}
						/>
						<Route
							path="/usuarios/:slug"
							component={lazy(() => import("@/users/views/UsersShow"))}
						/>
						<Route
							path="/suppliers"
							component={lazy(() => import("@/suppliers/views/SuppliersIndex"))}
						/>
						<Route
							path="/short-links"
							component={lazy(() => import("@/urls/views/UrlsIndex"))}
						/>{" "}
						<Route
							path="/posts"
							component={lazy(() => import("@/posts/views/PostsIndex"))}
						/>
						{/*  */}
						{/* orders */}
						<Route
							path="/orders"
							component={lazy(() => import("@/orders/views/OrdersIndex"))}
						/>
						<Route
							path="/orders/:order_code"
							component={
								lazy(
									() => import("@/orders/views/OrdersShow"),
									// biome-ignore lint/suspicious/noExplicitAny: <explanation>
								) as any
							}
						/>
						{[1, 2].includes(
							storageInformation!.tipo_empresa.tipo_servicio_id,
						) ? (
							<Route
								path="/delivery"
								component={lazy(() => import("@/orders/views/OrdersDelivery"))}
							/>
						) : null}
						<Route
							path="/perfil"
							component={lazy(() => import("@/users/views/UsersProfile"))}
						/>
						<Route
							path="/proveedores"
							component={lazy(() => import("@/suppliers/views/SuppliersIndex"))}
						/>
						<Route
							path="/payment"
							component={lazy(() => import("@/information/views/PaymentIndex"))}
						/>
						<Route
							path="/settings"
							component={lazy(
								() => import("@/information/views/SettingsIndex"),
							)}
						/>
						<Route
							path="/facturacion"
							component={lazy(
								() => import("@/facturacion/views/Facturacion.index"),
							)}
						/>
						<Route
							path="/whatsapp"
							component={lazy(() => import("@/bot/views/Whatsapp"))}
						/>
						<Route
							path="/ai"
							component={lazy(
								() => import("@/bot/views/InteligenciaArtificial"),
							)}
						/>
						<Route
							path="/plus"
							component={lazy(() => import("@/admin/views/Plus"))}
						/>
						<Route
							path="/reclamaciones"
							component={lazy(
								() => import("@/information/views/ComplaintsIndex"),
							)}
						/>
						<Route
							path="/pricing-shipping"
							component={lazy(() => import("@/ubigeo/views/RegionsIndex"))}
						/>
						<Route
							path="/noticia"
							component={lazy(() => import("@/information/views/NewIndex"))}
						/>
						<Route
							path="/background"
							component={lazy(
								() => import("@/information/views/BackgroundIndex"),
							)}
						/>
						<Route>
							<View404 />
						</Route>
					</Switch>
				</Suspense>
			</AdminLayout>
		</Router>
	);
}

export default App;
