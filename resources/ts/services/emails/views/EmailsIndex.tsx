import { useTable } from "@vigilio/preact-table";
import VigilioTable from "~/components/table";
import type { EmailsSchemaFromServer } from "../schemas/emails.schema";
import Container from "@/admin/components/Container";
import AdminBreadCrumb from "@/admin/components/AdminBreadCrumb";
import emailsColumns from "../libs/EmailsColumns";
import EmailsShow from "./EmailsShow";
import useAuthstore from "@/auth/stores/auth.store";
import AlertInfo from "~/components/Alerts/AlertInfo";
import { sweetModal } from "@vigilio/sweet";
import { reactComponent } from "~/libs/preact";
import { emailsAccountsApi } from "../apis/emails.accounts.api";
import Box from "../components/Box";
import Loading from "@/admin/components/Loading";
import View404 from "@/admin/views/404";
import useEmpresastore from "@/empresas/stores/empresa.store";
import { emailsPaginatorApi } from "@/common/paginator/emails.paginator.api";

function EmailsIndex() {
    const table = useTable({
        columns: emailsColumns,
    });
    const authStore = useAuthstore();
    const query = emailsPaginatorApi(table);

    function onShowPost(post: EmailsSchemaFromServer) {
        sweetModal({
            html: reactComponent(<EmailsShow id={post.id} />),
            showCloseButton: true,
            position: "start",
        });
    }
    function onShowMoreInformation() {
        sweetModal({
            html: reactComponent(<EmailInformation />),
            showCloseButton: true,
            position: "start",
            sweetWidth: "700px",
        });
    }

    return (
        <Container className="p-2">
            <div className="flex flex-col gap-4 mx-1 ">
                <AdminBreadCrumb current="Buzón de Correo Electrónico" />
            </div>
            <div class="overflow-auto">
                <VigilioTable query={query} table={table}>
                    <VigilioTable.header className="p-0 mb-2 flex justify-between items-center">
                        <>
                            {authStore.guards.permissionAdminGuard() ? (
                                <div class="flex items-center gap-2">
                                    <a
                                        target="_blank"
                                        rel="noreferrer"
                                        href="https://mail.zoho.com/zm/#mail/folder/inbox"
                                        class="text-xs px-4 py-2 rounded-md dark:bg-admin-terciary shadow font-bold  dark:text-white"
                                    >
                                        <i class="fa-solid fa-inbox" /> Bandeja
                                        de entrada
                                    </a>
                                    <button
                                        type="button"
                                        aria-label="open to more information"
                                        class="text-xs px-4 py-2 rounded-md dark:bg-admin-terciary shadow font-bold dark:text-white"
                                        onClick={onShowMoreInformation}
                                    >
                                        Más información
                                    </button>
                                </div>
                            ) : null}

                            <div class="flex items-center gap-1">
                                <VigilioTable.header.limit />
                                <VigilioTable.header.refetch />
                            </div>
                        </>
                    </VigilioTable.header>
                    <VigilioTable.table>
                        <VigilioTable.thead>
                            <VigilioTable.thead.row>
                                <VigilioTable.thead.th />
                            </VigilioTable.thead.row>
                        </VigilioTable.thead>
                        <VigilioTable.tbody>
                            <VigilioTable.tbody.row handleClick={onShowPost}>
                                {(data) => (
                                    <VigilioTable.tbody.td data={data} />
                                )}
                            </VigilioTable.tbody.row>
                        </VigilioTable.tbody>
                    </VigilioTable.table>
                    <VigilioTable.footer>
                        <VigilioTable.footer.paginator />
                        <VigilioTable.footer.show />
                    </VigilioTable.footer>
                </VigilioTable>
            </div>
        </Container>
    );
}

function EmailInformation() {
    const emailsAccountsQuery = emailsAccountsApi();
    const information = useEmpresastore();

    let component: JSX.Element | JSX.Element[] | null = null;
    if (emailsAccountsQuery.isLoading) {
        component = <Loading />;
    }
    if (emailsAccountsQuery.isError) {
        component = <View404 message={emailsAccountsQuery.error?.message} />;
    }
    if (emailsAccountsQuery.isSuccess) {
        component = (
            <div class="flex flex-col gap-2 dark:text-white">
                <h3 class="font-bold">
                    Correo electrónico{" "}
                    <a
                        class="text-primary underline font-bold text-xl"
                        href="https://mail.zoho.com/zm/"
                        target="_blank"
                        rel="noreferrer"
                    >
                        zoho
                    </a>
                </h3>
                <div class="text-xs flex flex-col gap-2">
                    <span class="text-lg">
                        Correo: <b>{information.state!.email_zoho}</b>
                    </span>
                    <span class="text-lg">
                        Contraseña: <b>{information.state!.password_zoho}</b>
                    </span>
                </div>
                <div class="flex flex-col gap-2">
                    <Box
                        usedStorage={
                            emailsAccountsQuery.data?.data[0].usedStorage!
                        }
                        allowedStorage={
                            emailsAccountsQuery.data?.data[0].allowedStorage!
                        }
                    />
                    <pre class="overflow-auto break-words text-wrap h-[300px] dark:bg-black dark:bg-opacity-60 p-2">
                        {JSON.stringify(
                            emailsAccountsQuery.data?.data[0],
                            null,
                            3
                        )}
                    </pre>
                </div>
                <AlertInfo>
                    <div class="flex flex-col">
                        <span>
                            Estas usando la version gratuita, Si los mb de los
                            correos se llenan no podrás enviar correos. Le
                            recomendamos eliminar los{" "}
                            <a
                                href="https://mail.zoho.com/zm/"
                                target="_blank"
                                rel="noreferrer"
                            >
                                <em> correos antiguos</em>
                            </a>{" "}
                            para ahorrar almacenamiento y enviar más mensajes ó
                            acceder a
                        </span>

                        <div class="flex gap-2 justify-between">
                            <a
                                class="text-primary hover:underline mt-2 block bold"
                                target="_blank"
                                rel="noreferrer"
                                href="https://www.zoho.com/mail/zohomail-pricing.html"
                            >
                                Zoho Planes
                            </a>
                        </div>
                    </div>
                </AlertInfo>
            </div>
        );
    }
    return component;
}
export default EmailsIndex;
