import useAuthStore from "@/auth/stores/auth.store";

interface AdminEditProps {
    uri: string;
    isLeft?: boolean;
}
function AdminEdit({ uri, isLeft = true }: AdminEditProps) {
    const useAuth = useAuthStore();

    if (useAuth.state!.role_id !== 1) {
        return null;
    }
    return (
        <a
            href={uri}
            class={`absolute ${
                isLeft ? "left-0" : "right-0"
            }  z-[9] bg-primary px-2 py-1 rounded-md text-white`}
        >
            <i class="far fa-pen text-xs" />
        </a>
    );
}

export default AdminEdit;
