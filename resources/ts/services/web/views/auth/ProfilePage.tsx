import WebLayout, { type HeaderType } from "@/web/components/WebLayout";
import AuthProfile from "./AuthProfile";

interface ProfileProps {
    header: HeaderType;
}
function Profile({ header }: ProfileProps) {
    return (
        <WebLayout header={header}>
            <section class="flex justify-center items-center py-12 mt-10 lg:mt-0">
                <AuthProfile />
            </section>
        </WebLayout>
    );
}

export default Profile;
