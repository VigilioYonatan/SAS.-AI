import Loader from "~/components/Loader";
interface LoadingProps {
	className?: string;
}
function Loading({ className = "h-[calc(100vh-100px)]" }: LoadingProps) {
	return (
		<div class={`w-full ${className}  flex justify-center items-center`}>
			<Loader />
		</div>
	);
}

export default Loading;
