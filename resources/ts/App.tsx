import AdminLayout from "@/admin/components/AdminLayout";
import View404 from "@/admin/views/404";
import { storageEmpresa } from "@/empresas/stores/empresa.store";
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
                                () => import("@/empresas/views/EmpresaUpdate")
                            )}
                        />
                        <Route
                            path="/horario"
                            component={lazy(
                                () => import("@/empresas/views/EmpresaSchedule")
                            )}
                        />
                        <Route
                            path="/direccion"
                            component={lazy(
                                () =>
                                    import(
                                        "@/empresas/views/EmpresaAddressUpdate"
                                    )
                            )}
                        />
                        {[1, 3].includes(
                            storageEmpresa!.tipo_empresa.tipo_servicio_id
                        ) ? (
                            <>
                                <Route
                                    path="/local"
                                    component={lazy(
                                        () => import("@/admin/views/Local")
                                    )}
                                />
                                <Route
                                    path="/productos"
                                    component={lazy(
                                        () =>
                                            import(
                                                "@/products/views/ProductsIndex"
                                            )
                                    )}
                                />
                                <Route
                                    path="/categorias"
                                    component={lazy(
                                        () =>
                                            import(
                                                "@/products/views/CategoriesIndex"
                                            )
                                    )}
                                />
                                {storageEmpresa?.setting.is_subcategory ? (
                                    <Route
                                        path="/subcategorias"
                                        component={lazy(
                                            () =>
                                                import(
                                                    "@/products/views/SubcategoriesIndex"
                                                )
                                        )}
                                    />
                                ) : null}

                                <Route
                                    path="/categorias_servicios"
                                    component={lazy(
                                        () =>
                                            import(
                                                "@/products/views/CategoriesServices"
                                            )
                                    )}
                                />
                                <Route
                                    path="/marcas"
                                    component={lazy(
                                        () =>
                                            import(
                                                "@/products/views/BrandsIndex"
                                            )
                                    )}
                                />
                            </>
                        ) : null}
                        {storageEmpresa?.tipo_empresa.tipo_servicio_id === 2 ? (
                            <>
                                <Route
                                    path="/local"
                                    component={lazy(
                                        () => import("@/admin/views/MesasLocal")
                                    )}
                                />
                                <Route
                                    path="/productos"
                                    component={lazy(
                                        () =>
                                            import(
                                                "@/products/views/ProductsRestaurantIndex"
                                            )
                                    )}
                                />{" "}
                                <Route
                                    path="/categorias"
                                    component={lazy(
                                        () =>
                                            import(
                                                "@/products/views/CategoriesIndex"
                                            )
                                    )}
                                />
                            </>
                        ) : null}
                        {storageEmpresa?.tipo_empresa.tipo_servicio_id === 3 ? (
                            <Route
                                path="/servicios"
                                component={lazy(
                                    () =>
                                        import(
                                            "@/products/views/ServiciosIndex"
                                        )
                                )}
                            />
                        ) : null}
                        <Route
                            path="/cupones"
                            component={lazy(
                                () => import("@/products/views/CouponsIndex")
                            )}
                        />
                        <Route
                            path="/crud/:slug"
                            component={lazy(
                                () => import("@/empresas/views/CrudShow")
                            )}
                        />
                        <Route
                            path="/usuarios"
                            component={lazy(
                                () => import("@/users/views/UsersIndex")
                            )}
                        />
                        <Route
                            path="/meeting"
                            component={lazy(
                                () => import("@/citas/views/CitasIndex")
                            )}
                        />
                        <Route
                            path="/usuarios/:slug"
                            component={lazy(
                                () => import("@/users/views/UsersShow")
                            )}
                        />
                        <Route
                            path="/suppliers"
                            component={lazy(
                                () => import("@/suppliers/views/SuppliersIndex")
                            )}
                        />
                        <Route
                            path="/short-links"
                            component={lazy(
                                () => import("@/urls/views/UrlsIndex")
                            )}
                        />{" "}
                        <Route
                            path="/posts"
                            component={lazy(
                                () => import("@/posts/views/PostsIndex")
                            )}
                        />
                        <Route
                            path="/banners"
                            component={lazy(
                                () => import("@/empresas/views/BannersIndex")
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
                        />{" "}
                        <Route
                            path="/emails"
                            component={lazy(
                                () => import("@/emails/views/EmailsIndex")
                            )}
                        />
                        <Route
                            path="/perfil"
                            component={lazy(
                                () => import("@/users/views/UsersProfile")
                            )}
                        />
                        <Route
                            path="/proveedores"
                            component={lazy(
                                () => import("@/suppliers/views/SuppliersIndex")
                            )}
                        />
                        <Route
                            path="/finanzas"
                            component={lazy(
                                () => import("@/finanzas/views/FinanzasIndex")
                            )}
                        />
                        <Route
                            path="/payment"
                            component={lazy(
                                () => import("@/empresas/views/PaymentIndex")
                            )}
                        />
                        <Route
                            path="/settings"
                            component={lazy(
                                () => import("@/empresas/views/SettingsIndex")
                            )}
                        />
                        <Route
                            path="/files"
                            component={lazy(
                                () => import("@/empresas/views/FilesIndex")
                            )}
                        />
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
                                () => import("@/empresas/views/ComplaintsIndex")
                            )}
                        />
                        <Route
                            path="/pricing-shipping"
                            component={lazy(
                                () => import("@/ubigeo/views/RegionsIndex")
                            )}
                        />
                        <Route
                            path="/noticia"
                            component={lazy(
                                () => import("@/empresas/views/NewIndex")
                            )}
                        />
                        <Route
                            path="/background"
                            component={lazy(
                                () => import("@/empresas/views/BackgroundIndex")
                            )}
                        />
                        {/* REDES SOCIALES */}
                        <Route
                            path="/messenger"
                            component={lazy(
                                () => import("@/bot/views/Messenger")
                            )}
                        />
                        <Route
                            path="/instagram"
                            component={lazy(
                                () => import("@/bot/views/Instagram")
                            )}
                        />
                        <Route
                            path="/tiktok"
                            component={lazy(() => import("@/bot/views/TikTok"))}
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
