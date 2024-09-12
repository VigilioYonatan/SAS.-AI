import { useForm } from "react-hook-form";
import { useEffect } from "preact/hooks";
import { sweetModal } from "@vigilio/sweet";
import {
    authConfirmPasswordDto,
    AuthConfirmPasswordDto,
} from "@/auth/dtos/auth.confirm-password.dto";
import { valibotVigilio } from "~/libs/valibot";
import { authConfirmPasswordApi } from "@/auth/apis/auth.confirm-password.api";
import { handlerError } from "~/libs/helpers";
import LogoImage from "~/components/LogoImage";
import Form from "~/components/form";

interface AuthConfirmPasswordProps {
    id: number;
}
function AuthConfirmPassword({ id }: AuthConfirmPasswordProps) {
    const authConfirmPasswordForm = useForm<AuthConfirmPasswordDto>({
        mode: "all",
        resolver: valibotVigilio(authConfirmPasswordDto),
        defaultValues: { user_id: id },
    });
    const authConfirmPasswordMutation = authConfirmPasswordApi();
    function onAuthLogin(body: AuthConfirmPasswordDto) {
        authConfirmPasswordMutation.mutate(body, {
            async onSuccess(data) {
                sweetModal({
                    icon: "success",
                    title: "Felicidades ...",
                    text: data.message,
                    timer: 6,
                }).then(() => {
                    window.location.href = "/auth/login";
                });
            },
            onError(error) {
                handlerError(authConfirmPasswordForm, error);
            },
        });
    }
    const password = authConfirmPasswordForm.watch("password");
    const repeatPassword = authConfirmPasswordForm.watch("repeat_password");
    useEffect(() => {
        if (password !== repeatPassword) {
            authConfirmPasswordForm.setError("repeat_password", {
                message: "Contraseña no similares",
            });
            return;
        }
        authConfirmPasswordForm.clearErrors("repeat_password");
    }, [password, repeatPassword]);
    return (
        <div class="text-start p-4">
            <div class="flex justify-center items-center flex-col gap-2 mb-2">
                <LogoImage width="50" height="50" />
                <h3 class="text-2xl font-bold dark:text-secondary-light text-secondary-dark">
                    Me olvidé mi contraseña
                </h3>
            </div>
            <Form onSubmit={onAuthLogin} {...authConfirmPasswordForm}>
                <Form.control
                    ico={<i class="fas fa-lock text-sm" />}
                    name={"password" as keyof AuthConfirmPasswordDto}
                    title="contraseña"
                    placeholder="●●●●●●●●"
                />
                <Form.control
                    ico={<i class="fas fa-lock text-sm" />}
                    name={"repeat_password" as keyof AuthConfirmPasswordDto}
                    title="Confirmar contraseña"
                    placeholder="●●●●●●●●"
                />
                <Form.button.submit
                    title="Enviar"
                    className="w-full justify-center py-3"
                    ico={null}
                    disabled={authConfirmPasswordMutation.isLoading || false}
                    isLoading={authConfirmPasswordMutation.isLoading || false}
                />
            </Form>
        </div>
    );
}

export default AuthConfirmPassword;
