import { formatDateTwo } from "~/libs/helpers";
import { usersShowApi } from "../apis/users.show.api";
import { printFileUser } from "../libs/helpers";

interface ShowUserProps {
	id: number;
}
function UserShow(props: ShowUserProps) {
	const userShowQuery = usersShowApi(props.id);
	let component = null;
	if (userShowQuery.isLoading) {
	}
	if (userShowQuery.isError) {
	}
	if (userShowQuery.isSuccess) {
		const user = userShowQuery.data!.user;
		component = (
			<div class="absolute top-10 p-2 rounded-md bg-background-light dark:bg-background-dark flex flex-col z-10 shadow gap-2 w-[120px]">
				<div>
					<img
						width={150}
						height={150}
						src={printFileUser(user.photo, 300)[0]}
						alt={user.username}
					/>
				</div>
				<div class="flex flex-col">
					<span class="text-sm font-bold dark:text-white ">
						{user.username}
					</span>
					<span class="text-sm dark:text-white ">
						Se unió {formatDateTwo(user.createdAt!)}
					</span>
				</div>
			</div>
		);
	}
	return component;
}
export default UserShow;
