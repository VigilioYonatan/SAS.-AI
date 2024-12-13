import type { PostsSchemaFromServer } from "@/posts/schemas/posts.schema";
import {
    SampleNextArrow,
    SamplePrevArrow,
} from "@/web/components/ArrowsSlider";
import TitleSection from "@/web/components/TitleSection";
import Slider from "react-slick";
import enviroments from "~/config";
import useShowImage from "~/hooks/useShowImage";
import { showTime } from "~/libs/helpers";
import { printFileWithDimension } from "~/libs/upload";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { storageEmpresa } from "@/empresas/stores/empresa.store";
import { postsUpdateApi } from "@/posts/apis/posts.update.api";
import { getId } from "~/stores/socket.store";
import { useSignal } from "@preact/signals";
import { sweetAlert } from "@vigilio/sweet";

interface PostsSectionProps {
    posts: PostsSchemaFromServer[];
}
function PostsSection({ posts }: PostsSectionProps) {
    if (!posts.length) return null;
    const { ShowImage, state, changeShowImage } = useShowImage();
    return (
        <section class="post-section  max-w-6xl mx-auto  my-4 md:my-8 px-4 flex flex-col gap-4 group ">
            <TitleSection>Novedades</TitleSection>
            <div class="">
                {posts.length ? (
                    <Slider
                        className="posts-section-slide"
                        {...{
                            dots: false,
                            arrows: true,
                            infinite: false,
                            speed: 500,
                            slidesToShow: 3,
                            slidesToScroll: 1,
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
                            nextArrow: <SampleNextArrow />,
                            prevArrow: <SamplePrevArrow />,
                        }}
                    >
                        {posts.map((post, i) => (
                            <div
                                key={post.id}
                                class={`group overflow-hidden ${
                                    storageEmpresa?.setting
                                        .bg_color_background !==
                                    storageEmpresa?.setting.bg_color_paper
                                        ? "shadow"
                                        : ""
                                }  ${
                                    enviroments.TYPE_BORDER === "circle"
                                        ? "rounded-md"
                                        : ""
                                } bg-background-light dark:bg-background-dark min-h-[400px]`}
                                onClick={() => {
                                    changeShowImage(i + 1);
                                }}
                            >
                                <div class="flex flex-col">
                                    <div class="overflow-hidden">
                                        <img
                                            src={
                                                printFileWithDimension(
                                                    post.image,
                                                    800
                                                )[0]
                                            }
                                            class="group-hover:scale-110 delay-custom-1 h-full"
                                            width={800}
                                            height={800}
                                            alt={post.title}
                                            title={post.title}
                                        />
                                    </div>

                                    <div class=" p-2 flex flex-col gap-1">
                                        <h4 class="line-clamp-2 font-bold  dark:text-white ">
                                            {post.title}
                                        </h4>
                                        <p class="line-clamp-5 text-gray-400 font-normal h-[80px] text-sm">
                                            {post.content}
                                        </p>
                                        <div class="flex justify-between items-center ">
                                            <div class="flex gap-1 items-center text-primary">
                                                <i class="fa-regular fa-thumbs-up text-sm" />
                                                <span class="font-bold text-xs">
                                                    {post.likes.length}
                                                </span>
                                            </div>
                                            <span class="self-end  text-primary font-bold text-xs">
                                                <i class="fa-regular fa-calendar-days mr-1" />{" "}
                                                {showTime(post.createdAt!)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </Slider>
                ) : (
                    <span class="text-primary dark:text-white block text-center font-bold">
                        No hay posts
                    </span>
                )}{" "}
                <style jsx>{`
                    .posts-section-slide .slick-slide > div {
                        padding: 0 10px;
                    }
                `}</style>
                <ShowImage length={posts.length}>
                    <Slider
                        className="md:w-[800px] w-full "
                        {...{
                            dots: true,
                            speed: 500,
                            slidesToShow: 1,
                            slidesToScroll: 1,
                            arrows: false,
                            adaptiveHeight: true,
                            initialSlide: state! - 1,
                            afterChange(currentSlide) {
                                changeShowImage(currentSlide + 1);
                            },
                        }}
                    >
                        {posts.map((post) => {
                            const postsUpdateMutation = postsUpdateApi(post.id);
                            const postSignal =
                                useSignal<PostsSchemaFromServer>(post);
                            const existLike = (
                                postSignal.value.likes ?? []
                            ).find((p) => p === getId()!);
                            return (
                                <div
                                    class={`flex-col dark:bg-paper-dark bg-paper-light  relative  ${
                                        storageEmpresa?.setting.type_border ===
                                        "circle"
                                            ? "rounded-md overflow-hidden"
                                            : ""
                                    }`}
                                    key={post.title}
                                >
                                    <img
                                        class="object-contain w-full h-full"
                                        src={
                                            printFileWithDimension(
                                                post.image,
                                                800
                                            )[0]
                                        }
                                        width={800}
                                        height={800}
                                        alt={post.title}
                                        title={post.title}
                                    />
                                    <button
                                        type="button"
                                        class={`absolute border-2 border-primary top-2 right-2 ${
                                            existLike ? "bg-primary" : ""
                                        }  w-[50px] h-[50px] rounded-full shadow`}
                                        onClick={() => {
                                            const likes = !existLike
                                                ? [
                                                      ...(postSignal.value
                                                          .likes ?? []),
                                                      getId()!,
                                                  ]
                                                : postSignal.value.likes.filter(
                                                      (p) => p !== getId()!
                                                  );
                                            postSignal.value = {
                                                ...postSignal.value,
                                                likes,
                                            };
                                            postsUpdateMutation.mutate(
                                                {
                                                    ...postSignal.value,
                                                    likes,
                                                },
                                                {
                                                    onSuccess() {},
                                                    onError(err) {
                                                        sweetAlert({
                                                            icon: "danger",
                                                            title: err.message,
                                                        });
                                                    },
                                                }
                                            );
                                        }}
                                    >
                                        <i
                                            class={`fa-regular fa-thumbs-up text-lg  ${
                                                existLike ? "" : "text-primary"
                                            }`}
                                        />
                                    </button>
                                    <div class="flex flex-col gap-2 p-4">
                                        <span class="font-bold dark:text-primary text-center   md:text-xl">
                                            {post.title}
                                        </span>
                                        <p class="  text-center  text-sm md:text-base  dark:text-gray-300">
                                            {post.content}
                                        </p>
                                        <div class="flex justify-between items-center">
                                            <div class="flex gap-1 items-center text-primary">
                                                <i class="fa-regular fa-thumbs-up text-sm" />
                                                <span class="font-bold text-xs">
                                                    {
                                                        postSignal.value.likes
                                                            .length
                                                    }
                                                </span>
                                            </div>{" "}
                                            <span class="text-xs justify-end text-end text-primary font-bold flex gap-2 items-center ">
                                                <i class="fa-regular fa-calendar-days" />{" "}
                                                {showTime(post.createdAt!)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </Slider>
                </ShowImage>
            </div>
        </section>
    );
}

export default PostsSection;
