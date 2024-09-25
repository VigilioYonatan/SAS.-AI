import { useSignal } from "@preact/signals";
import { useEffect, useRef } from "preact/hooks";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function useShowImage() {
    const showImage = useSignal<number | null>(null);
    const modal = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        document.body.classList.toggle("overflow-hidden", !!showImage.value);
    }, [showImage.value]);
    interface ShowImageProps {
        children: JSX.Element | JSX.Element[];
        length: number;
    }
    function changeShowImage(value: number) {
        showImage.value = value;
        return showImage.value;
    }
    function ShowImage({ children, length }: ShowImageProps) {
        return (
            <>
                {showImage.value ? (
                    <div
                        class="fixed  inset-0 bg-black bg-opacity-80 z-[999] flex justify-center items-center"
                        ref={modal}
                    >
                        <div class="absolute top-0 left-0 right-0 flex justify-between m-2 text-white">
                            <span>
                                {showImage.value}/{length}
                            </span>
                            <div class="flex gap-4 items-center">
                                <button
                                    type="button"
                                    aria-label="expand image"
                                    onClick={() => {
                                        if (!document.fullscreenElement) {
                                            if (
                                                modal.current?.requestFullscreen
                                            ) {
                                                modal.current.requestFullscreen();
                                            }
                                        } else {
                                            if (document.exitFullscreen) {
                                                document.exitFullscreen();
                                            }
                                        }
                                    }}
                                >
                                    <i class="far fa-expand" />
                                </button>
                                <button
                                    onClick={() => {
                                        showImage.value = null;
                                    }}
                                    aria-label="close image"
                                    type="button"
                                >
                                    <i class="fas fa-times text-xl" />
                                </button>
                            </div>
                        </div>
                        <div class="w-full flex justify-center items-center">
                            {children}
                        </div>
                    </div>
                ) : null}
            </>
        );
    }
    return {
        ShowImage,
        changeShowImage,
        state: showImage.value,
    };
}

export default useShowImage;
