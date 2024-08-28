import AdminLayout from "@/admin/components/AdminLayout";
import View404 from "@/admin/views/404";
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
                            component={lazy(
                                () => import("@/admin/views/Dashboard")
                            )}
                        />
                        <Route
                            path="/empresa"
                            component={lazy(
                                () =>
                                    import(
                                        "@/information/views/InformationUpdate"
                                    )
                            )}
                        />
                        <Route
                            path="/horario"
                            component={lazy(
                                () =>
                                    import(
                                        "@/information/views/InformationSchedule"
                                    )
                            )}
                        />
                        <Route
                            path="/Direccion"
                            component={lazy(
                                () =>
                                    import(
                                        "@/information/views/InformationAddressUpdate"
                                    )
                            )}
                        />
                        <Route
                            path="/local"
                            component={lazy(
                                () => import("@/admin/views/Local")
                            )}
                        />
                        <Route
                            path="/categorias"
                            component={lazy(
                                () => import("@/products/views/CategoriesIndex")
                            )}
                        />
                        <Route
                            path="/productos"
                            component={lazy(
                                () => import("@/products/views/ProductsIndex")
                            )}
                        />
                        <Route
                            path="/cupones"
                            component={lazy(
                                () => import("@/products/views/CouponsIndex")
                            )}
                        />
                        <Route
                            path="/usuarios"
                            component={lazy(
                                () => import("@/users/views/UsersIndex")
                            )}
                        />
                        <Route
                            path="/usuarios/:slug"
                            component={lazy(
                                () => import("@/users/views/UsersShow")
                            )}
                        />
                        <Route
                            path="/proveedores"
                            component={lazy(
                                () => import("@/suppliers/views/SuppliersIndex")
                            )}
                        />
                        <Route
                            path="/usuarios/:slug"
                            component={lazy(
                                () => import("@/users/views/UsersShow")
                            )}
                        />
                        {/*  */}
                        {/* orders */}
                        <Route
                            path="/orders"
                            component={lazy(
                                () => import("@/orders/views/OrdersIndex")
                            )}
                        />
                        <Route
                            path="/orders/:order_code"
                            component={
                                lazy(
                                    () => import("@/orders/views/OrdersShow")
                                    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
                                ) as any
                            }
                        />
                        <Route
                            path="/delivery"
                            component={lazy(
                                () => import("@/orders/views/OrdersDelivery")
                            )}
                        />
                        <Route
                            path="/orders/:id"
                            component={
                                lazy(
                                    () => import("@/orders/views/OrdersShow")
                                    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
                                ) as any
                            }
                        />
                        <Route
                            path="/perfil"
                            component={lazy(
                                () => import("@/users/views/UsersProfile")
                            )}
                        />
                        {/* settings */}
                        <Route
                            path="/facturacion"
                            component={lazy(
                                () =>
                                    import(
                                        "@/facturacion/views/Facturacion.index"
                                    )
                            )}
                        />
                        <Route
                            path="/whatsapp"
                            component={lazy(
                                () => import("@/bot/views/Whatsapp")
                            )}
                        />
                        <Route
                            path="/ai"
                            component={lazy(
                                () =>
                                    import("@/bot/views/InteligenciaArtificial")
                            )}
                        />
                        <Route
                            path="/plus"
                            component={lazy(() => import("@/admin/views/Plus"))}
                        />
                        <Route
                            path="/reclamaciones"
                            component={lazy(
                                () =>
                                    import(
                                        "@/information/views/ComplaintsIndex"
                                    )
                            )}
                        />
                        {/* <Route
                            path="/pricing-shipping"
                            component={lazy(
                                () => import("@/ubigeo/views/DepartmentsIndex")
                            )}
                        /> */}{" "}
                        <Route
                            path="/games"
                            component={lazy(
                                () => import("@/information/views/GamesIndex")
                            )}
                        />
                        <Route
                            path="/noticia"
                            component={lazy(
                                () => import("@/information/views/NewIndex")
                            )}
                        />
                        <Route
                            path="/background"
                            component={lazy(
                                () =>
                                    import(
                                        "@/information/views/BackgroundIndex"
                                    )
                            )}
                        />
                        <Route>
                            <View404 />
                        </Route>{" "}
                    </Switch>
                </Suspense>
            </AdminLayout>
        </Router>
    );
}

export default App;
