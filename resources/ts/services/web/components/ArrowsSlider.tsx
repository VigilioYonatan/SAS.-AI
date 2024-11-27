import { storageEmpresa } from "@/empresas/stores/empresa.store";
import type { HTMLAttributes } from "preact/compat";
import { getColorPrimary } from "~/libs/helpers";

export function SampleNextArrow(props: HTMLAttributes<HTMLDivElement>) {
	const { className, onClick } = props;
	const typeArrow = storageEmpresa?.setting.type_arrow;
	return (
		<div class="group-hover:opacity-100 opacity-0 delay-custom-1">
			<div className={className} onClick={onClick}>
				{typeArrow === "first" ? (
					<>
						<i class="fas fa-caret-right text-xl text-primary" />
						<style jsx>{`
                            .slick-arrow,
                            .slick-arrow {
                                display: flex !important;
                                justify-content: center !important;
                                align-items: center !important;
                                width: 30px !important;
                                height: 30px !important;
                                position: absolute !important;
                                z-index: 10;
                                border-radius: 0.5rem !important;
                            }
                            .slick-next {
                                right: 5px !important;
                            }
                            .slick-prev {
                                left: 5px !important;
                            }
                            .slick-prev::before,
                            .slick-next::before {
                                display: none !important;
                            }
                            .slick-prev:hover,
                            .slick-prev:focus,
                            .slick-next:hover,
                            .slick-next:focus {
                                scale: 1.1 !important;
                                background-color: rgba(0, 0, 0, 0.4) !important;
                                box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1),
                                    0 2px 4px -2px rgb(0 0 0 / 0.1);
                            }
                        `}</style>
					</>
				) : typeArrow === "second" ? (
					<>
						<i class="fal fa-long-arrow-right text-lg text-primary" />
						<style jsx>{`
                            .slick-arrow,
                            .slick-arrow {
                                display: flex !important;
                                justify-content: center !important;
                                align-items: center !important;
                                width: 35px !important;
                                height: 35px !important;
                                position: absolute !important;
                                z-index: 10;
                                ${
																	storageEmpresa?.setting.type_border ===
																	"circle"
																		? "border-radius: 0.5rem !important;"
																		: ""
																}

                                border: 1px solid ${getColorPrimary()};
                            }
                            .slick-next {
                                right: 5px !important;
                            }
                            .slick-prev {
                                left: 5px !important;
                            }
                            .slick-prev::before,
                            .slick-next::before {
                                display: none !important;
                            }
                        `}</style>
					</>
				) : typeArrow === "third" ? (
					<>
						<i class="far fa-chevron-right text-xl text-primary" />
						<style jsx>{`
                            .slick-arrow,
                            .slick-arrow {
                                display: flex !important;
                                justify-content: center !important;
                                align-items: center !important;
                                width: 35px !important;
                                height: 35px !important;
                                position: absolute !important;
                                z-index: 10;
                            }
                            .slick-next {
                                right: 5px !important;
                            }
                            .slick-prev {
                                left: 5px !important;
                            }
                            .slick-prev::before,
                            .slick-next::before {
                                display: none !important;
                            }
                        `}</style>
					</>
				) : null}{" "}
			</div>
		</div>
	);
}

export function SamplePrevArrow({
	isSetting,
	...props
}: HTMLAttributes<HTMLDivElement> & { isSetting?: string }) {
	const { className, onClick } = props;

	const typeArrow = isSetting ? isSetting : storageEmpresa?.setting.type_arrow;

	return (
		<div
			class={`${
				isSetting ? "" : "opacity-0  group-hover:opacity-100"
			} delay-custom-1`}
		>
			<div className={className} onClick={onClick} style={{}}>
				{typeArrow === "first" ? (
					<i class="fas fa-caret-left text-xl text-primary" />
				) : typeArrow === "second" ? (
					<i class="fal fa-long-arrow-left text-lg text-primary" />
				) : typeArrow === "third" ? (
					<i class="far fa-chevron-left text-xl text-primary" />
				) : null}
			</div>
		</div>
	);
}
