import { useForm } from "react-hook-form";
import Form from "~/components/form";
import { valibotVigilio } from "~/libs/valibot";
import { emailsStoreDto, type EmailsStoreDto } from "../dtos/emails.store.dto";
import { emailsStoreApi } from "../apis/emails.store.api";
import { sweetAlert, sweetModal } from "@vigilio/sweet";
import { handlerError } from "~/libs/helpers";
import useSocketStore from "~/stores/socket.store";

function FormContact() {
    const emailsStoreMutation = emailsStoreApi();
    const { io } = useSocketStore();

    const emailStoreForm = useForm<EmailsStoreDto>({
        resolver: valibotVigilio(emailsStoreDto),
    });

    function onSendEmail(body: EmailsStoreDto) {
        sweetModal({
            title: "¿Estas seguro de enviarnos un mensaje?",
            showCancelButton: true,
            showCloseButton: true,
            isCloseInBackground: false,
        }).then(({ isConfirmed }) => {
            if (isConfirmed) {
                emailsStoreMutation.mutate(body, {
                    onSuccess(data) {
                        sweetAlert({ icon: "success", title: data.message });
                        io?.emit("notifications:email-store", body);
                        emailStoreForm.reset();
                    },
                    onError(error) {
                        handlerError(emailStoreForm, error);
                    },
                });
            }
        });
    }
    return (
        <Form {...emailStoreForm} onSubmit={onSendEmail}>
            <Form.control.web
                name={"name" as keyof EmailsStoreDto}
                title="Tu nombre Completo"
                placeholder="XXXX"
            />
            <Form.control.web
                name={"subject" as keyof EmailsStoreDto}
                title="Asunto"
                placeholder="Asunto de tu mensaje."
            />
            <Form.control.web
                type="email"
                name={"email" as keyof EmailsStoreDto}
                title="Correo Electrónico"
                placeholder="correo@gmail.com"
            />
            <Form.control.web.area
                name={"content" as keyof EmailsStoreDto}
                title="Contenido"
                placeholder="Tu mensaje."
            />
            <Form.button.submit
                disabled={emailsStoreMutation.isLoading || false}
                isLoading={emailsStoreMutation.isLoading || false}
                title="Enviar mensaje"
                ico={null}
            />
        </Form>
    );
}

export default FormContact;
