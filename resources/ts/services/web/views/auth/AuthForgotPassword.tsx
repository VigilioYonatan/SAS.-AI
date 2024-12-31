import { useForm } from "react-hook-form";
import { valibotVigilio } from "~/libs/valibot";
import LogoImage from "~/components/LogoImage";
import Form from "~/components/form";
import { handlerError, isColorLight } from "~/libs/helpers";
import { sweetModal } from "@vigilio/sweet";
import { storageEmpresa } from "@/empresas/stores/empresa.store";
import {
    authForgotPasswordDto,
    AuthForgotPasswordDto,
} from "@/auth/dtos/auth.forgot-password.dto";
import { authForgotPasswordApi } from "@/auth/apis/auth.forgot-password.api";
import { authWallpaper } from "~/config/settings";
import { UsersSchemaFromServer } from "@/users/schemas/users.schema";
import AuthConfirmPassword from "./AuthConfirmPassword";
import { useEffect } from "preact/hooks";
interface AuthForgotPasswordProps {
    user: UsersSchemaFromServer;
}
function AuthForgotPassword({ user }: AuthForgotPasswordProps) {
    const authForgotPasswordForm = useForm<AuthForgotPasswordDto>({
        mode: "all",
        resolver: valibotVigilio(authForgotPasswordDto),
    });
    const authForgotPasswordMutation = authForgotPasswordApi();
    function onAuthLogin(body: AuthForgotPasswordDto) {
        authForgotPasswordMutation.mutate(body, {
            onSuccess() {
                sweetModal({
                    icon: "success",
                    title: "Estas apunto de recuperar tu contraseña",
                    text: `Se envió un mensaje a +${storageEmpresa?.dial_code} ${body.telephone}`,
                });
                authForgotPasswordForm.reset();
            },
            onError(error) {
                handlerError(authForgotPasswordForm, error);
            },
        });
    }
    useEffect(() => {
        if (storageEmpresa?.setting.web_script) {
            const script = document.createElement("script");
            const div = document.querySelector("body");
            script.innerHTML = storageEmpresa.setting.web_script;
            div?.appendChild(script);
            // Limpieza del script para evitar problemas
            return () => {
                document.body.removeChild(script);
            };
        }
    }, []);
    return (
        <section class="relative flex flex-col-reverse h-screen overflow-hidden sm:grid sm:grid-cols-5 lg:grid-cols-3 auth-page">
            <style jsx>{`
                .bg-background-light {
                    ${isColorLight(storageEmpresa!.setting.bg_color_background)
                        ? "color: #000000 !important"
                        : "color: #FFFFFF !important"};
                }
                .bg-background-paper {
                    ${isColorLight(storageEmpresa!.setting.bg_color_paper)
                        ? "color: #000000 !important"
                        : "color: #FFFFFF !important"};
                }
                .bg-primary {
                    ${storageEmpresa!.setting.text_color !== "transparent"
                        ? `color: ${
                              storageEmpresa!.setting.text_color
                          } !important`
                        : isColorLight(storageEmpresa!.setting.bg_color)
                        ? "color: #000000 !important"
                        : "color: #FFFFFF !important"};
                }
            `}</style>
            <div class="sticky z-10  dark:bg-background-dark sm:static sm:col-span-3 lg:col-span-1">
                <div class="col-span-1 flex h-[85vh] flex-col items-start justify-center px-4 sm:h-[calc(100vh-34px)] sm:px-8">
                    {user ? (
                        <AuthConfirmPassword id={user.id} />
                    ) : (
                        <div class="text-start p-4 w-full">
                            <div class="flex justify-center items-center flex-col gap-2 mb-2">
                                <LogoImage
                                    width={storageEmpresa?.setting.logo_width}
                                    height="50"
                                />
                                <h3 class="text-2xl font-bold dark:text-secondary-light  text-center">
                                    Me olvidé mi contraseña
                                </h3>
                            </div>
                            <Form
                                onSubmit={onAuthLogin}
                                {...authForgotPasswordForm}
                            >
                                <Form.control.auth
                                    ico={<span class="font-bold">+51</span>}
                                    name={
                                        "telephone" as keyof AuthForgotPasswordDto
                                    }
                                    title="Telefono"
                                    placeholder=""
                                />
                                <Form.button.submit
                                    title="Enviar"
                                    className="w-full justify-center py-3"
                                    ico={null}
                                    disabled={
                                        authForgotPasswordMutation.isLoading ||
                                        false
                                    }
                                    isLoading={
                                        authForgotPasswordMutation.isLoading ||
                                        false
                                    }
                                />
                            </Form>
                        </div>
                    )}
                </div>
            </div>
            <img
                width={1200}
                height={1200}
                src={authWallpaper()}
                alt="auth wallpaper"
                class="object-cover w-full h-screen translate-y-16 sm:col-span-2 sm:translate-y-0 gradient"
            />
        </section>
    );
}

export default AuthForgotPassword;
