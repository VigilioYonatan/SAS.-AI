import useEmpresastore, {
    storageEmpresa,
} from "@/empresas/stores/empresa.store";
import MapValue from "~/components/MapValue";

function FindSection() {
    const empresaStore = useEmpresastore();

    return (
        <section
            data-aos={`${
                storageEmpresa?.setting.isScrolling
                    ? storageEmpresa.setting.type_animation
                    : ""
            } `}
            class="find-section  h-[400px] md:h-[500px]  px-2  rounded-md   flex flex-col gap-4  py-4 md:py-8"
        >
            <div
                class={`w-full relative h-full ${
                    storageEmpresa!.setting.type_border === "circle"
                        ? "rounded-md overflow-hidden"
                        : ""
                }`}
            >
                <MapValue
                    zoom={16}
                    value={empresaStore.state!.map_marker}
                    style={{
                        height: "100%",
                        width: "100%",
                    }}
                    scrollWheelZoom={false}
                />
            </div>
        </section>
    );
}

export default FindSection;
