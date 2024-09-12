import LogoImage from "~/components/LogoImage";
import Form from "~/components/form";
import { useForm } from "react-hook-form";
import { type AuthLoginDto, authLoginDto } from "../dtos/auth.login.dto";
import { authLoginApi } from "../apis/auth.login.api";
import { sweetAlert, sweetModal } from "@vigilio/sweet";
import { useSignal } from "@preact/signals";
import { reactComponent } from "~/libs/preact";
import { useMediaQueryNoReactive } from "~/hooks/useMediaQuery";
import { valibotVigilio } from "~/libs/valibot";

function AuthLogin() {
    const rememberPassword = useSignal<string>(
        localStorage.getItem("rememberPassword") || ""
    );
    const authLoginApiMutation = authLoginApi();
    const authLoginForm = useForm<AuthLoginDto>({
        resolver: valibotVigilio(authLoginDto),
        mode: "all",
    });
    function onAuthLogin(data: AuthLoginDto) {
        if (!data.rememberPassword) {
            localStorage.removeItem("rememberPassword");
        }
        authLoginApiMutation.mutate(data, {
            onSuccess() {
                sweetAlert({
                    icon: "success",
                    title: "Iniciaste sessión correctamente",
                }).then(() => {
                    if (data.rememberPassword) {
                        localStorage.setItem("rememberPassword", data.password);
                    }
                    const url = window.location.href;

                    if (!url.includes("/auth/login")) {
                        window.location.reload();
                        return;
                    }

                    window.location.href = `${window.location.origin}/admin`;
                });
            },
            // no es necesario onError
        });
    }
    return (
        <div class="text-start p-4 w-full">
            <div class="flex justify-center items-center flex-col gap-2 mb-2">
                <LogoImage width="50" height="50" />
                <h3 class="text-2xl font-bold dark:text-secondary-light text-secondary-dark">
                    Inicio de sesión
                </h3>
                <p class="dark:text-paper-light text-paper-dark text-sm">
                    Inicia sesión para acceder a tu cuenta
                </p>
            </div>
            <Form onSubmit={onAuthLogin} {...authLoginForm}>
                {authLoginApiMutation.isError ? (
                    <p class="text-white bg-danger w-full text-xs py-2 px-3 ">
                        <i class="fa-solid fa-circle-exclamation mr-1" />
                        {authLoginApiMutation.error?.message}
                    </p>
                ) : (
                    <></>
                )}
                <Form.control.auth
                    ico={<i class="fas fa-user " />}
                    type="text"
                    name={"telephone" as keyof AuthLoginDto}
                    title="Telefono o Correo Electrónico"
                    placeholder=""
                />
                <Form.control.auth
                    name={"password" as keyof AuthLoginDto}
                    title="Contraseña"
                    type="password"
                    placeholder=""
                    ico={<i class="fas fa-lock" />}
                    autoComplete="current-password"
                    options={{ value: rememberPassword }}
                />
                <div className="flex items-center gap-2 mb-6 mt-2">
                    <input
                        id="rememberPassword"
                        type="checkbox"
                        {...authLoginForm.register("rememberPassword", {
                            value: false,
                        })}
                    />
                    <label
                        htmlFor="rememberPassword"
                        class="text-xs dark:text-secondary-light text-secondary-dark"
                    >
                        Recordar contraseña
                    </label>
                </div>
                <Form.button.submit
                    title="Iniciar sesión"
                    className="justify-center w-full py-3"
                    ico={null}
                    disabled={authLoginApiMutation.isLoading || false}
                    isLoading={authLoginApiMutation.isLoading || false}
                />
            </Form>
            <div class="mt-6 flex flex-col sm:flex-row justify-between gap-2 flex-wrap">
                <a
                    href={"/auth/forgot-password"}
                    class="text-primary dark:text-white text-xs hover:underline"
                >
                    Me olvide mi contraseña?
                </a>
            </div>
        </div>
    );
}
export function openAuth() {
    sweetModal({
        html: reactComponent(<AuthLogin />),
        showCloseButton: true,
        sweetWidth: "600px",
        position: useMediaQueryNoReactive("(min-width:700px)")
            ? "center"
            : "start",
    });
}
export default AuthLogin;
