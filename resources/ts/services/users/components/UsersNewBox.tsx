import { Link } from "wouter-preact";
import { printFileUser } from "../libs/helpers";
import AdminHr from "~/components/AdminHr";
import { showTime } from "~/libs/helpers";
import type { UsersLimit30 } from "@/admin/apis/admin.dashboard.api";
import ContainerBox from "@/admin/components/ContainerBox";
interface UsersNewBoxProps {
	users: UsersLimit30[];
}
function UsersNewBox({ users }: UsersNewBoxProps) {
	return (
		<ContainerBox>
			<span class="dark:text-secondary-light text-secondary-dark font-bold text-2xl mx-auto block mt-2">
				Nuevos usuarios
			</span>
			<AdminHr />
			<div class="w-full max-h-[500px] overflow-auto">
				{users.map((user) => (
					<Link
						key={user.id}
						to={`/usuarios/${user.slug}`}
						className="flex gap-3 w-full p-2 hover:dark:bg-admin-terciary hover:bg-paper-light"
					>
						{user.id}
						<img
							width={50}
							height={50}
							src={printFileUser(user.photo, 100)[0]}
							alt={user.slug}
							class="w-[50px] h-[50px] rounded-full object-cover"
						/>
						<div class="flex flex-col gap-1  w-full">
							<span class="dark:text-secondary-light text-secondary-darktext-sm font-semibold">
								{user.username}
							</span>
							<div class="flex gap-1 justify-between text-xs dark:text-secondary-light flex-wrap">
								<span class="whitespace-nowrap">{user.email}</span>
								<span class="bg-blue-600 py-1 px-3 rounded-md text-white">
									<i class="fas fa-calendar-week mr-1" />
									{showTime(user.createdAt!)}
								</span>
							</div>
						</div>
					</Link>
				))}
			</div>
		</ContainerBox>
	);
}

export default UsersNewBox;
