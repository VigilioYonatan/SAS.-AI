import useEmpresastore, {
    storageEmpresa,
} from "@/empresas/stores/empresa.store";
import AdminEdit from "@/web/components/AdminEdit";
import TitleSection from "@/web/components/TitleSection";
import MapValue from "~/components/MapValue";

function FindSection() {
    if (!storageEmpresa?.setting.shows.map) {
        return null;
    }
    const empresaStore = useEmpresastore();

    return (
        <section
            data-aos={`${
                storageEmpresa?.setting.isScrolling ? "fade-up" : ""
            } `}
            class="  h-[400px] md:h-[700px] mx-4 md:mx-0  px-2  rounded-md  mb-4 flex flex-col gap-4"
        >
            <TitleSection>Encuéntranos</TitleSection>
            <div class="w-full relative h-full">
                <MapValue
                    zoom={16}
                    value={empresaStore.state!.map_marker}
                    style={{
                        height: "100%",
                        width: "100%",
                    }}
                    scrollWheelZoom={false}
                />{" "}
                <div class="flex flex-col absolute  bottom-2 md:bottom-0 m-1 bg-opacity-80 bg-background-dark z-10 p-2 gap-2 max-w-[250px] rounded-md shadow ">
                    <span class="font-bold  text-sm text-primary">
                        {empresaStore.state!.address.city.region.name} -{" "}
                        {empresaStore.state!.address.city.name}
                    </span>
                    <p class="text-xs font-semibold text-white">
                        {empresaStore.state!.address.direccion}
                    </p>
                    <AdminEdit uri="/admin/horario" />
                </div>
                {/* <div class="md:w-[400px]  justify-center items-center flex-col flex md:gap-3 absolute md:right-2 right-0 left-0 md:left-auto mx-2 md:ml-0 bottom-2 bg-opacity-80 bg-background-dark p-4 rounded-md">
                    <i class="far fa-map-marker-alt text-2xl md:text-3xl text-white" />
                    <p class="font-semibold text-center dark:text-white text-sm md:text-base">
                        <span class="font-bold  text-sm text-primary">
                            {empresaStore.state!.address.city.region.name} -{" "}
                            {empresaStore.state!.address.city.name}
                        </span>
                        <p class="text-xs font-semibold  text-white">
                            {empresaStore.state!.address.direccion}
                        </p>
                        <p class="font-semibold text-center text-gray-200">
                            Estamos comprometidos en ofrecerte lo mejor.
                            Visítanos en nuestra ubicación y descubre una
                            experiencia única con nuestros productos. ¡Te
                            esperamos con los brazos abiertos! No dudes en
                            acercarte, ¡tu satisfacción es nuestra prioridad!
                        </p>
                    </p>
                </div> */}
            </div>

            {/* <div class="md:w-1/2 w-full relative">
                <MapValue
                    zoom={16}
                    value={empresaStore.state!.map_marker}
                    style={{
                        height: query ? "400px" : "200px",
                        width: "100%",
                    }}
                />{" "}
                <div class="flex flex-col absolute bottom-0 m-1 bg-white z-10 p-2 gap-2 max-w-[250px] rounded-md shadow ">
                    <span class="font-bold  text-sm">
                        {empresaStore.state!.address.city.region.name} -{" "}
                        {empresaStore.state!.address.city.name}
                    </span>
                    <p class="text-xs font-semibold ">
                        {empresaStore.state!.address.direccion}
                    </p>
                    <AdminEdit uri="/admin/horario" />
                </div>
            </div>
            <div class="md:w-1/2 py-7 md:py-0  justify-center items-center flex-col flex md:gap-3">
                <i class="far fa-map-marker-alt text-2xl md:text-3xl dark:text-white" />
                <h3 class="text-xl md:text-3xl font-bold text-primary text-center dark:text-white">
                    Encuentranos cerca de ti!
                </h3>
                <p class="font-semibold text-center dark:text-white">
                    Estamos comprometidos en ofrecerte lo mejor. Visítanos en
                    nuestra ubicación y descubre una experiencia única con
                    nuestros productos. ¡Te esperamos con los brazos abiertos!
                    No dudes en acercarte, ¡tu satisfacción es nuestra
                    prioridad!
                </p>
            </div> */}
        </section>
    );
}

export default FindSection;
