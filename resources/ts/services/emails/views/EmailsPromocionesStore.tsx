import { useForm } from "react-hook-form";
import { emailsPromocionesStoreApi } from "../apis/emails_promociones.store.api";
import {
    emailsPromocionesStoreDto,
    type EmailsPromocionesStoreDto,
} from "../dtos/emails_promociones.store.dto";
import { valibotVigilio } from "~/libs/valibot";
import Form from "~/components/form";
import { sweetModal } from "@vigilio/sweet";
import { handlerError } from "~/libs/helpers";
import { storageEmpresa } from "@/empresas/stores/empresa.store";

function EmailsPromocionesStore() {
    const emailsPromocionesStoreMutation = emailsPromocionesStoreApi();
    const emailsPromocionesForm = useForm<EmailsPromocionesStoreDto>({
        resolver: valibotVigilio(emailsPromocionesStoreDto),
        defaultValues: { empresa_id: storageEmpresa!.id },
    });

    function onEmailsPromocionesStore(body: EmailsPromocionesStoreDto) {
        emailsPromocionesStoreMutation.mutate(body, {
            onSuccess(data) {
                emailsPromocionesForm.reset();
                sweetModal({ title: data.message, icon: "success", text: "" });
            },
            onError(error) {
                handlerError(emailsPromocionesForm, error);
            },
        });
    }

    return (
        <section class="email-promotion">
            <div class="max-w-6xl mx-auto">
                <Form
                    className="flex gap-2 items-center"
                    {...emailsPromocionesForm}
                    onSubmit={onEmailsPromocionesStore}
                >
                    <Form.control
                        title="Correo Electrónico"
                        name={"email" as keyof EmailsPromocionesStoreDto}
                        type="email"
                    />
                    <Form.button.submit
                        ico={null}
                        className="py-3 px-3"
                        title="Suscribete"
                        isLoading={
                            emailsPromocionesStoreMutation.isLoading || false
                        }
                    />
                </Form>
            </div>
        </section>
    );
}

export default EmailsPromocionesStore;
