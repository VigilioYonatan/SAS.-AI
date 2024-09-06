import Loading from "@/admin/components/Loading";
import View404 from "@/admin/views/404";
import { complaintsShowApi } from "../apis/complaints.show.api";
import { formatDateTwo } from "~/libs/helpers";
import { storageEmpresa } from "../stores/empresa.store";

interface ComplaintsShowProps {
    id: number;
}
function ComplaintsShow({ id }: ComplaintsShowProps) {
    const complaintshowIndex = complaintsShowApi(id);

    let component = null;
    if (complaintshowIndex.isLoading) {
        component = <Loading />;
    }

    if (complaintshowIndex.isError) {
        component = (
            <View404 message={`No se encontró un post con el id ${id}`} />
        );
    }
    if (complaintshowIndex.isSuccess) {
        const complaint = complaintshowIndex.data!.complaint;
        component = (
            <div class="flex gap-4 flex-wrap justify-center  font-semibold">
                <div class="flex-1 min-w-[250px]">
                    <div class="flex gap-1 flex-col mb-3 odd:bg-paper-light odd:dark:bg-admin-terciary rounded-md p-2">
                        <span class="text-primary dark:text-terciary font-bold">
                            ID:
                        </span>
                        <span class="dark:text-secondary-light text-secondary-dark tracking-wide">
                            {complaint.id}
                        </span>
                    </div>
                    <div class="flex gap-1 flex-col mb-3 odd:bg-paper-light odd:dark:bg-admin-terciary rounded-md p-2">
                        <span class="text-primary dark:text-terciary font-bold">
                            Nombre:
                        </span>
                        <span class="dark:text-secondary-light text-secondary-dark tracking-wide">
                            {complaint.fullName}
                        </span>
                    </div>

                    <div class="flex gap-1 flex-col mb-3 odd:bg-paper-light odd:dark:bg-admin-terciary rounded-md p-2">
                        <span class="text-primary dark:text-terciary font-bold">
                            Documento de Identidad:
                        </span>
                        <span class="dark:text-secondary-light text-secondary-dark tracking-wide">
                            {complaint.numberDocument}
                        </span>
                    </div>
                    <div class="flex gap-1 flex-col mb-3 odd:bg-paper-light odd:dark:bg-admin-terciary rounded-md p-2">
                        <span class="text-primary dark:text-terciary font-bold">
                            Email:
                        </span>
                        <span class="dark:text-secondary-light text-secondary-dark tracking-wide">
                            {complaint.address}
                        </span>
                    </div>
                    <div class="flex gap-1 flex-col mb-3 odd:bg-paper-light odd:dark:bg-admin-terciary rounded-md p-2">
                        <span class="text-primary dark:text-terciary font-bold">
                            Telefono:
                        </span>
                        <span class="dark:text-secondary-light text-secondary-dark tracking-wide">
                            +{storageEmpresa?.dial_code} {complaint.phone}
                        </span>
                    </div>
                    <div class="flex gap-1 flex-col mb-3 odd:bg-paper-light odd:dark:bg-admin-terciary rounded-md p-2">
                        <span class="text-primary dark:text-terciary font-bold">
                            Detalles del consumo:
                        </span>
                        <span class="dark:text-secondary-light text-secondary-dark tracking-wide">
                            {complaint.typeOfConsumption}
                            {" - "}
                            {complaint.detailsOfConsumption}
                        </span>
                    </div>
                    <div class="flex gap-1 flex-col mb-3 odd:bg-paper-light odd:dark:bg-admin-terciary rounded-md p-2">
                        <span class="text-primary dark:text-terciary font-bold text-wrap break-words">
                            Reclamo:
                        </span>
                        <span class="dark:text-secondary-light text-secondary-dark tracking-wide">
                            {complaint.typeComplaint} -{" "}
                            {complaint.detailsOfComplaint}
                        </span>
                    </div>

                    <div class="flex gap-1 flex-col mb-3 odd:bg-paper-light odd:dark:bg-admin-terciary rounded-md p-2">
                        <span class="text-primary dark:text-terciary font-bold">
                            Fecha:{" "}
                        </span>
                        <span class="dark:text-secondary-light text-secondary-dark tracking-wide">
                            {formatDateTwo(
                                complaint.createdAt,
                                "DD-MM-YYYY H:mm"
                            )}
                        </span>
                    </div>
                </div>
            </div>
        );
    }
    return component;
}

export default ComplaintsShow;
