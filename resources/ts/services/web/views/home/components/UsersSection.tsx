import { printFileUser } from "@/users/libs/helpers";
import { UsersSchema } from "@/users/schemas/users.schema";
import {
    SampleNextArrow,
    SamplePrevArrow,
} from "@/web/components/ArrowsSlider";
import TitleSection from "@/web/components/TitleSection";
import Slider from "react-slick";
import { formatDateTwo, NOW, TimePeru } from "~/libs/helpers";
import confetti from "canvas-confetti";
import { storageEmpresa } from "@/empresas/stores/empresa.store";

interface UsersSection {
    users: Pick<
        UsersSchema,
        "id" | "name" | "speciality" | "photo" | "birthday"
    >[];
}
function UsersSection({ users }: UsersSection) {
    if (users.length < 3) return null;
    return (
        <section
            data-aos={`${
                storageEmpresa?.setting.isScrolling
                    ? storageEmpresa.setting.type_animation
                    : ""
            } `}
            class="max-w-6xl mx-auto px-2 my-4 md:my-8 flex flex-col gap-4  users-section"
        >
            <TitleSection>Nuestro Equipo</TitleSection>
            <Slider
                className="w-full rounded-lg team"
                {...{
                    dots: false,
                    infinite: true,
                    speed: 500,
                    slidesToShow: 4,
                    slidesToScroll: 1,
                    autoplay: true,
                    adaptiveHeight: true,
                    nextArrow: <SampleNextArrow />,
                    prevArrow: <SamplePrevArrow />,
                    responsive: [
                        {
                            breakpoint: 1024,
                            settings: {
                                slidesToShow: 3,
                            },
                        },
                        {
                            breakpoint: 600,
                            settings: {
                                slidesToShow: 2,
                            },
                        },
                        {
                            breakpoint: 480,
                            settings: {
                                slidesToShow: 1,
                            },
                        },
                    ],
                }}
            >
                {users.map((user) => (
                    <div
                        class={`bg-background-light dark:bg-background-dark card-user  relative ${
                            storageEmpresa?.setting.type_border === "circle"
                                ? "rounded-md"
                                : ""
                        }  ${
                            storageEmpresa!.setting.bg_color_paper !==
                            storageEmpresa!.setting.bg_color_background
                                ? "shadow"
                                : ""
                        } `}
                        key={user.id}
                    >
                        <div class="flex justify-center items-center p-6 group overflow-hidden">
                            <img
                                class="rounded-full  "
                                width={200}
                                height={200}
                                src={printFileUser(user.photo, 300)[0]}
                                alt=""
                            />
                        </div>

                        <div class="flex flex-col gap-1 justify-center items-center py-3 dark:text-white">
                            <h3 class="font-bold">{user.name}</h3>
                            {user.speciality ? (
                                <span class="font-semibold">
                                    {user.speciality}
                                </span>
                            ) : null}

                            {user.birthday ? (
                                <div class="flex flex-col justify-center items-center gap-1">
                                    <i class="fa-solid fa-cake-candles" />
                                    <span class="font-semibold">
                                        {formatDateTwo(user.birthday)}
                                    </span>
                                </div>
                            ) : null}
                            {user.birthday &&
                            NOW().isSame(TimePeru(user.birthday), "day") ? (
                                <button
                                    type="button"
                                    onClick={() => {
                                        confetti({
                                            particleCount: 100,
                                            spread: 70,
                                            origin: { y: 0.6 },
                                        });
                                    }}
                                    class="font-bold animate-bounce text-primary "
                                >
                                    <i class="far fa-balloons" /> Feliz
                                    Cumpleaños <i class="far fa-balloons" />
                                </button>
                            ) : null}
                        </div>
                    </div>
                ))}
            </Slider>
            <style jsx>{`
                .team .slick-slide > div {
                    padding: 0 10px;
                }
            `}</style>
        </section>
    );
}

export default UsersSection;
