import AuthLogin from "@/auth/views/AuthLogin";
import { storageEmpresa } from "@/empresas/stores/empresa.store";
import { authWallpaper } from "~/config/settings";
import { isColorLight } from "~/libs/helpers";

function LoginPage() {
	return (
		<section class="relative flex flex-col-reverse h-screen overflow-hidden sm:grid sm:grid-cols-5 lg:grid-cols-3">
			{" "}
			<style jsx>{`
                .bg-background-light {
                    ${
											isColorLight(storageEmpresa!.setting.bg_color_background)
												? "color: #000000 !important"
												: "color: #FFFFFF !important"
										};
                }
                .bg-background-paper {
                    ${
											isColorLight(storageEmpresa!.setting.bg_color_paper)
												? "color: #000000 !important"
												: "color: #FFFFFF !important"
										};
                }
                .bg-primary {
                    ${
											isColorLight(storageEmpresa!.setting.bg_color)
												? "color: #000000 !important"
												: "color: #FFFFFF !important"
										};
                }
            `}</style>
			<div class="sticky z-10  dark:bg-background-dark sm:static sm:col-span-3 lg:col-span-1">
				<div class="col-span-1 flex h-[85vh] flex-col items-start justify-center px-4 sm:h-[calc(100vh-34px)] sm:px-8">
					<AuthLogin />
				</div>
			</div>
			<img
				width={1200}
				height={1200}
				src={authWallpaper()}
				alt=""
				class="object-cover w-full h-screen translate-y-16 sm:col-span-2 sm:translate-y-0 gradient"
			/>
		</section>
	);
}

export default LoginPage;
