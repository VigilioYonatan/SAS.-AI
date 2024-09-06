import useInformationStore from "@/information/stores/information.store";
import MapValue from "~/components/MapValue";

function FindSection() {
	const informationStore = useInformationStore();
	return (
		<section class="max-w-6xl mx-auto flex flex-col md:flex-row gap-3 px-2 bg-background-light  dark:bg-background-dark rounded-md  my-12  ">
			<div class="md:w-1/2 w-full relative">
				<MapValue
					zoom={16}
					value={informationStore.state!.map_marker}
					style={{ height: "400px", width: "100%" }}
				/>
				<div class="flex flex-col absolute bottom-0 m-1 bg-white z-10 p-2 gap-2 max-w-[250px] rounded-md shadow">
					<span class="font-bold text-black text-sm">
						{informationStore.state!.address.city.region.name} -{" "}
						{informationStore.state!.address.city.name}
					</span>
					<p class="text-xs font-semibold ">
						{informationStore.state!.address.direccion}
					</p>
				</div>
			</div>
			<div class="md:w-1/2 py-16 md:py-0  justify-center items-center flex-col flex gap-6">
				<h3 class="text-3xl font-bold text-primary text-center dark:text-white">
					Encuentranos cerca de ti!
				</h3>
				<i class="far fa-map-marker-alt text-3xl dark:text-white" />
			</div>
		</section>
	);
}

export default FindSection;
