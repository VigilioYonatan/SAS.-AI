import { BASE_URL } from "~/config";
import QuillText from "~/components/QuillText";
import { PostsSchema } from "@/posts/schemas/posts.schema";
import WebLayout, { HeaderType } from "@/web/components/WebLayout";
import { formatDateTwo, getColorPrimary } from "~/libs/helpers";
import { printFileWithDimension } from "~/libs/upload";
import TitleSectionTwo from "@/web/components/TitleSectionTwo";
import TitleSection from "@/web/components/TitleSection";
import { storageEmpresa } from "@/empresas/stores/empresa.store";

interface BlogShowProps {
    post: PostsSchema;
    posts: PostsSchema[];
    header: HeaderType;
}
function BlogShow(props: BlogShowProps) {
    function printHTMLBlog(htmlString: string) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlString, "text/html");
        const headings = Array.from(doc.querySelectorAll("h2, h3"));
        let indexHtmlContent = `<div class="indice-editor" style="background-color: ${getColorPrimary()};padding: 1rem;border-radius: 1rem;white-space: nowrap;">
                                  <h2 style="color:white;font-size:1.3rem;margin-bottom:0rem !important;" class="font-bold text-2xl ">Tabla de Contenidos</h2>
                                  <ul class=" list-disc " style="margin:0.5rem 0em 0rem 1rem; padding:0;">`;
        headings.forEach((heading, index) => {
            const text = heading.innerHTML;
            const level = heading.tagName.toLowerCase(); // h2 o h3
            const uniqueId = `heading-${index}-${level}`;
            const div = document.createElement("div");
            div.style.height = "1px";
            div.id = uniqueId;
            heading.parentNode?.insertBefore(div, heading);
            indexHtmlContent += `<li class="ml-${
                level === "h3" ? 6 : 0
            }" style="color:white;padding:0.2rem 0rem;"><a href="#${uniqueId}" class="toc-link" style="color:white !important;font-weight: bold; text-decoration:none;font-size:1.1rem;text-wrap: wrap;background-color: transparent!;">${
                index + 1
            }. ${text}</a></li>`;
        });

        indexHtmlContent += "</ul></div>";

        const final = doc.body.innerHTML.replace(
            "---INDICE---",
            indexHtmlContent
        );

        return final;
    }

    return (
        <WebLayout header={props.header}>
            <section
                style={{
                    backgroundImage: `url(${
                        printFileWithDimension(props.post.image, 1600)[0]
                    })`,
                }}
                className="bg-center bg-no-repeat bg-cover h-[200px] md:h-[300px] p-6 flex flex-col items-center  relative   "
            >
                <div className="bg-black bg-opacity-50 inset-0 absolute w-full h-full" />
                <div className="max-w-6xl mx-auto  z-1 relative flex justify-center  h-full w-full px-4 flex-col">
                    <h1 className="text-xl md:text-3xl font-bold  md:leading-[3rem] font-semibold text-white mb-4 md:text-start uppercase tracking tracking-wider  ">
                        {props.post.title}
                    </h1>
                    <p className="font-semibold text-white">
                        {formatDateTwo(
                            props.post.date,
                            "D [de] MMMM [de] YYYY"
                        )}
                    </p>
                </div>
            </section>
            <section className="max-w-6xl mx-auto  mt-8">
                {/* <NavPage title={props.blog.title} /> */}
            </section>
            <section className="max-w-6xl mx-auto flex flex-col md:flex-row gap-6">
                <div className="w-full px-4">
                    <QuillText text={printHTMLBlog(props.post.content)} />
                    {props.post.links.length ? (
                        <div className="my-4">
                            <span className="font-bold">Enlaces:</span>
                            {props.post.links.map((link) => (
                                <a
                                    href={link.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    key={link.url}
                                    className="text-primary font-semibold my-1 block"
                                >
                                    {link.title}
                                </a>
                            ))}
                        </div>
                    ) : null}

                    <div className="flex justify-center items-center flex-col gap-4 mb-12 mt-8">
                        <TitleSection>¡Comparte el artículo!</TitleSection>
                        <div className="grid grid-cols-3 max-w-[200px] mx-auto w-full  ">
                            <a
                                href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(
                                    `${BASE_URL}/blog/${props.post.slug}`
                                )}&title=${`Te comparto este blog ${props.post.title}`}`}
                                target="_blank"
                                rel="noreferrer"
                            >
                                <i class="fab fa-linkedin text-primary text-3xl" />
                            </a>
                            <a
                                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                                    `${BASE_URL}/blog/${props.post.slug}`
                                )}`}
                                target="_blank"
                                rel="noreferrer"
                            >
                                <i class="fab fa-facebook text-primary text-3xl" />
                            </a>
                            <a
                                href={`https://wa.me/?text=${encodeURIComponent(
                                    `Te comparto este blog ${BASE_URL}/blog/${props.post.slug}`
                                )}`}
                                target="_blank"
                                rel="noreferrer"
                            >
                                <i class="fab fa-whatsapp text-primary text-3xl" />
                            </a>
                        </div>
                    </div>
                </div>
                <div className="md:w-[500px] px-2">
                    <div className="blog-add w-full flex flex-col gap-2 py-6">
                        <span className="text-primary font-bold text-lg text-center block">
                            ¿Tienes alguna controversia?
                        </span>
                        <a
                            href={`https://wa.me/${storageEmpresa!.dial_code}${
                                storageEmpresa!.telephoneFirst
                            }`}
                            className="flex gap-3 items-center bg-primary font-semibold text-white py-2 px-3 rounded-xl fill-white w-full   justify-center"
                        >
                            <i class="fab fa-whatsapp" />
                            Comunícate con nosotros
                        </a>
                    </div>
                    <div>
                        <TitleSectionTwo>Más artículos</TitleSectionTwo>
                        <div className="flex flex-col gap-6 mt-4">
                            {props.posts.map((blog) => (
                                <div
                                    className="rounded-2xl shadow-custom overflow-hidden"
                                    key={blog.id}
                                >
                                    <img
                                        src={
                                            printFileWithDimension(
                                                blog.image,
                                                600
                                            )[0]
                                        }
                                        alt={blog.title}
                                        height={600}
                                        width={600}
                                        className="w-full object-cover h-[200px]"
                                    />
                                    <div className="p-4 flex flex-col gap-4">
                                        <a
                                            href={`/blog/${blog.slug}`}
                                            className="font-bold  line-clamp-3"
                                        >
                                            {blog.title}
                                        </a>
                                        <span className="text-sm text-gray-500 font-semibold mt-4">
                                            {formatDateTwo(
                                                props.post.date,
                                                "D [de] MMMM [de] YYYY"
                                            )}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </WebLayout>
    );
}

export default BlogShow;
