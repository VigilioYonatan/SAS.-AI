import { storageEmpresa } from "@/empresas/stores/empresa.store";
import FormContact from "./FormContact";

function EmailSection() {
    return (
        <div class="contact-section max-w-6xl mx-auto  ">
            <div class="flex flex-col gap-2 md:flex-row  py-6  mx-4">
                <div class="flex flex-col px-2 ">
                    <div class="flex flex-col md:w-[300px] py-4">
                        <div class="py-2">
                            <i class="fas fa-home mr-3 text-xl" />
                            <span class="font-bold text-lg">Dirección</span>
                        </div>
                        <p class="text-sm dark:text-white font-semibold">
                            {storageEmpresa?.address.direccion},{" "}
                            {storageEmpresa?.address.city.name} -{" "}
                            {storageEmpresa?.address.city.region.name}
                        </p>
                    </div>
                    <div class="h-[1px] w-full bg-gray-300" />
                    <div class="flex flex-col py-4">
                        <div class="py-2">
                            <i class="fas fa-phone mr-3 text-xl" />
                            <span class="font-bold text-lg">Teléfono</span>
                        </div>
                        <ul class="text-sm list-item list-disc dark:text-white font-semibold ml-4">
                            <li>
                                {" "}
                                (+51){" "}
                                {storageEmpresa?.telephoneFirst.replace(
                                    /(\d{3})(\d{3})(\d{3})/,
                                    "$1 $2 $3"
                                )}
                            </li>
                            {storageEmpresa?.telephoneReclamos ? (
                                <li>
                                    (+51){" "}
                                    {storageEmpresa?.telephoneReclamos.replace(
                                        /(\d{3})(\d{3})(\d{3})/,
                                        "$1 $2 $3"
                                    )}
                                </li>
                            ) : null}
                            {storageEmpresa?.telephoneThird ? (
                                <li>
                                    (+51){" "}
                                    {storageEmpresa?.telephoneThird.replace(
                                        /(\d{3})(\d{3})(\d{3})/,
                                        "$1 $2 $3"
                                    )}
                                </li>
                            ) : null}
                        </ul>
                    </div>
                    <div class="h-[1px] w-full bg-gray-300" />
                    <div class="flex flex-col py-4">
                        <div class="py-2">
                            <i class="fas fa-envelope-open text-xl mr-3" />
                            <span class="font-bold text-lg">Email</span>
                        </div>
                        <ul class="text-sm list-item list-disc dark:text-white font-semibold ml-4">
                            <li>{storageEmpresa?.email}</li>
                        </ul>
                    </div>
                    <div class="h-[1px] w-full bg-gray-300" />
                </div>
                <div class="w-full">
                    <FormContact />
                </div>
            </div>
        </div>
    );
}

export default EmailSection;
