import Form from "~/components/form";
import { emailsSendAllApi } from "../apis/emails.send-all.api";
import { useForm } from "react-hook-form";
import { valibotVigilio } from "~/libs/valibot";
import {
    emailsSendAllDto,
    type EmailsSendAllDto,
} from "../dtos/emails.send-all.dto";
import enviroments from "~/config";
import LogoImage from "~/components/LogoImage";
import { handlerError } from "~/libs/helpers";
import { sweetAlert, sweetModal } from "@vigilio/sweet";
import useEmpresastore from "@/empresas/stores/empresa.store";
import { Fragment } from "preact/jsx-runtime";

function EmailsSendAll() {
    const emailsSendAllMutation = emailsSendAllApi();
    const informationStore = useEmpresastore();

    const emailsSendAlForm = useForm<EmailsSendAllDto & { email: string }>({
        resolver: valibotVigilio(emailsSendAllDto),
        defaultValues: { email: informationStore.state!.zoho.email as string },
    });
    const content = emailsSendAlForm.watch("content");
    const title = emailsSendAlForm.watch("title");

    function onEmailSendAll(body: EmailsSendAllDto) {
        sweetModal({
            icon: "info",
            title: "¿Estas seguro de enviar los correo electrónico a tus usuarios?",
        }).then(({ isConfirmed }) => {
            if (isConfirmed) {
                emailsSendAllMutation.mutate(body, {
                    onSuccess(data) {
                        sweetAlert({ icon: "success", title: data.message });
                        emailsSendAlForm.reset();
                    },
                    onError(error) {
                        handlerError(emailsSendAlForm, error);
                    },
                });
            }
        });
    }
    return (
        <div>
            <h1 class="dark:text-white my-4 text-3xl font-bold">
                Enviar correo masivo a tus clientes
            </h1>
            <p class="text-gray-400 font-semibold">
                Puedes enviar ofertas, eventos,etc a tus clientes.
            </p>
            <Form {...emailsSendAlForm} onSubmit={onEmailSendAll}>
                <Form.control
                    name={"subject" as keyof EmailsSendAllDto}
                    title="Asunto"
                    placeholder="Asunto de tu mensaje."
                />
                <Form.control
                    name={"email" as keyof EmailsSendAllDto}
                    title="Correo de la empresa"
                    placeholder="Asunto de tu mensaje."
                    disabled
                />
                <Form.control
                    name={"title" as keyof EmailsSendAllDto}
                    title="Titulo"
                    placeholder="Título del mensaje"
                />
                <Form.control.editor
                    name={"content" as keyof EmailsSendAllDto}
                    title="Contenido del mensaje"
                    height={300}
                    isShow={false}
                />
                <Form.button.submit
                    disabled={emailsSendAllMutation.isLoading || false}
                    isLoading={emailsSendAllMutation.isLoading || false}
                    title="Enviar"
                    ico={null}
                />
                <Fragment>
                    {content?.length ? (
                        <>
                            <span class="text-xs dark:text-white mt-6 block mb-2">
                                Resultado
                            </span>
                            <EmailHtml title={title} content={content} />
                        </>
                    ) : null}
                </Fragment>
            </Form>
        </div>
    );
}
interface EmailHtmlProps {
    title: string;
    content: string;
}
function EmailHtml({ title, content }: EmailHtmlProps) {
    const informationStore = useEmpresastore();
    const styleTableCell = {
        padding: "40px 30px 0px 30px",
        fontSize: "14px",
        color: "#363636",
        fontFamily: "'Nunito Sans', sans-serif",
        fontWeight: 400,
        lineHeight: 1.6,
    };

    const styleSpan = {
        color: "#000000",
        fontSize: "1.2rem",
    };

    const styleSpanPrimary = {
        color: `${enviroments.VITE_BG_PRIMARY}`,
        fontSize: "1.2rem",
    };

    const styleFooterCell = {
        padding: "30px 30px 40px 30px",
        fontSize: "15px",
        color: `${enviroments.VITE_BG_PRIMARY}`,
        fontFamily: "'Nunito Sans rev=3', sans-serif",
    };
    return (
        <div class="overflow-auto my-4 mx-2 rounded-md w-[500px] md:w-full">
            <div style={{ backgroundColor: "#f4f4f4", paddingTop: "50px" }} />
            <div className="adM" />
            <table
                cellPadding="0"
                cellSpacing="0"
                style={{
                    width: "100%",
                    maxWidth: "950px",
                    backgroundColor: "#fff",
                }}
            >
                <thead>
                    <tr>
                        <td>
                            <div
                                className="animation-brightness"
                                style={{
                                    backgroundColor: `${enviroments.VITE_BG_PRIMARY}`,
                                    height: "100px",
                                    width: "100%",
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    "--brightness-delay": "12s",
                                }}
                            >
                                <LogoImage />
                                <span
                                    style={{
                                        color: "#fff",
                                        fontFamily: "'Nunito Sans', sans-serif",
                                        fontWeight: "bolder",
                                        lineHeight: 1.6,
                                        fontSize: "1.2rem",
                                        margin: "0px 1rem",
                                    }}
                                >
                                    {informationStore.state!.company?.ruc}
                                </span>
                            </div>
                        </td>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td style={styleTableCell}>
                            <div>
                                <div>
                                    <p>
                                        <strong>
                                            <span style={styleSpan}>
                                                {title ?? "Titulo del correo"}
                                            </span>
                                        </strong>
                                    </p>
                                    <p>
                                        <strong>
                                            <span style={styleSpanPrimary}>
                                                Hola Usuario,
                                            </span>
                                        </strong>
                                    </p>
                                    <div>
                                        <div
                                            dangerouslySetInnerHTML={{
                                                __html: content,
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td style={styleFooterCell}>
                            <p>
                                <b>
                                    Equipo{" "}
                                    {informationStore.state!.name_empresa}
                                </b>
                            </p>
                        </td>
                    </tr>
                </tbody>
                <tfoot
                    style={{
                        fontSize: "11px",
                        fontFamily: "'Nunito Sans', sans-serif",
                        paddingTop: "12px",
                        paddingBottom: "12px",
                        backgroundColor: "#ecedef",
                        height: "100px",
                        minHeight: "100px",
                    }}
                >
                    <tr>
                        <td>
                            <div>
                                <p>
                                    Si tienes alguna duda o queja, contáctanos{" "}
                                    <a
                                        href={`http://wa.me/51${
                                            informationStore.state!
                                                .telephoneReclamos
                                        }`}
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        <b>Centro de Ayuda</b>
                                    </a>
                                    .
                                </p>
                                <p
                                    style={{
                                        color: "#9da1a5",
                                        fontSize: "9.3px",
                                    }}
                                >
                                    Le agradecemos tener en cuenta que esta es
                                    una comunicación automática de{" "}
                                    {informationStore.state!.name_empresa}
                                    <br />
                                    por tal motivo le pedimos no responder a
                                    esta dirección electrónica.
                                </p>
                            </div>
                        </td>
                    </tr>
                </tfoot>
            </table>
            <style jsx>{`
                .animation-brightness {
                    position: relative;
                    overflow: hidden;
                }
                .animation-brightness::before {
                    content: "";
                    position: absolute;
                    color: white;
                    display: block;
                    top: 0;
                    right: 0;
                    bottom: 0;
                    z-index: 10;
                    width: 70%;
                    height: 100%;
                    background: linear-gradient(
                        to right,
                        rgba(255, 255, 255, 0) 0%,
                        rgba(255, 255, 255, 0.3) 100%
                    );
                    animation: animationbrightness var(--brightness-delay)
                        infinite;
                }
                @keyframes animationbrightness {
                    0% {
                        transform: skewX(-25deg) translateX(-1000%);
                    }
                    50% {
                        transform: skewX(-25deg) translateX(1000%);
                    }
                    100% {
                        transform: skewX(-25deg) translateX(1000%);
                    }
                }
            `}</style>
        </div>
    );
}

export default EmailsSendAll;
