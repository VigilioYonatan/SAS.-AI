import FormContact from "@/emails/views/FormContact";
import useEmpresastore, {
    storageEmpresa,
} from "@/empresas/stores/empresa.store";
import MapValue from "~/components/MapValue";

function FindSection() {
    const empresaStore = useEmpresastore();

    return (
        <section
            class={`find-section  h-[400px] md:h-[500px]  px-2  rounded-md   flex  gap-4  py-4 md:py-8 ${
                storageEmpresa?.setting.isScrolling ? "animation-box" : ""
            }`}
        >
            <div class="w-full">
                <FormContact />
            </div>
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
