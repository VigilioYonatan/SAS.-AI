import TitleSection from "@/web/components/TitleSection";

function BestServiceSection() {
	return (
		<section class="max-w-6xl mx-auto  px-2">
			<TitleSection>Best customer service 🐶</TitleSection>
			<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-2">
				<div class="flex gap-4 hover:scale-110 delay-custom-1  dark:text-white border-[1px] p-10 rounded-md dark:border-white shadow border-primary">
					<i class="fa-sharp fa-light fa-bags-shopping text-4xl" />
					<div class="flex flex-col">
						<span class="font-bold text-lg">Free same-day delivery</span>
						<p class="text-sm">
							Lorem, ipsum dolor sit amet consectetur adipisicing elit.
						</p>
					</div>
				</div>
				<div class="flex gap-4  dark:text-white border-[1px] p-10 rounded-md dark:border-white shadow border-primary hover:scale-110 delay-custom-1">
					<i class="fa-sharp fa-light fa-bags-shopping text-4xl" />
					<div class="flex flex-col">
						<span class="font-bold text-lg">Free same-day delivery</span>
						<p class="text-sm">
							Lorem, ipsum dolor sit amet consectetur adipisicing elit.
						</p>
					</div>
				</div>
				<div class="flex gap-4  dark:text-white border-[1px] p-10 rounded-md dark:border-white shadow border-primary  hover:scale-110 delay-custom-1">
					<i class="fa-sharp fa-light fa-bags-shopping text-4xl" />
					<div class="flex flex-col">
						<span class="font-bold text-lg">Free same-day delivery</span>
						<p class="text-sm">
							Lorem, ipsum dolor sit amet consectetur adipisicing elit.
						</p>
					</div>
				</div>
			</div>
		</section>
	);
}

export default BestServiceSection;
