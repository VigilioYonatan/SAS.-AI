import useEmpresastore, {
    storageEmpresa,
} from "@/empresas/stores/empresa.store";
import AdminEdit from "@/web/components/AdminEdit";
import MapValue from "~/components/MapValue";
import useMediaQuery from "~/hooks/useMediaQuery";

function FindSection() {
    const empresaStore = useEmpresastore();
    const query = useMediaQuery("(min-width: 800px)");

    return (
        <section
            data-aos={`${
                storageEmpresa?.setting.isScrolling ? "fade-up" : ""
            } `}
            class="max-w-6xl mx-auto flex flex-col md:flex-row gap-3 px-2 bg-background-light  dark:bg-background-dark rounded-md  mb-4"
        >
            <div class="md:w-1/2 w-full ">
                <MapValue
                    zoom={16}
                    value={empresaStore.state!.map_marker}
                    style={{
                        height: query ? "400px" : "200px",
                        width: "100%",
                    }}
                />{" "}
                <div class="flex flex-col absolute bottom-0 m-1 bg-white z-10 p-2 gap-2 max-w-[250px] rounded-md shadow ">
                    <span class="font-bold text-black text-sm">
                        {empresaStore.state!.address.city.region.name} -{" "}
                        {empresaStore.state!.address.city.name}
                    </span>
                    <p class="text-xs font-semibold ">
                        {empresaStore.state!.address.direccion}
                    </p>
                    <AdminEdit uri="/admin/horario" />
                </div>
            </div>
            <div class="md:w-1/2 py-7 md:py-0  justify-center items-center flex-col flex gap-6">
                <h3 class="text-xl md:text-3xl font-bold text-primary text-center dark:text-white">
                    Encuentranos cerca de ti!
                </h3>
                <i class="far fa-map-marker-alt text-2xl md:text-3xl dark:text-white" />
            </div>
        </section>
    );
}

export default FindSection;
