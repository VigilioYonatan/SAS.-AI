import AdminDropdown from "@/admin/components/AdminDropdown";
import useAuthStore from "@/auth/stores/auth.store";
import { storageEmpresa } from "@/empresas/stores/empresa.store";
import useNotifications from "@/notifications/hooks/useNotifications";

function WebNotificacion() {
    return (
        <div>
            {useAuthStore().state ? (
                <>
                    {(() => {
                        const { methods } = useNotifications();
                        return (
                            <AdminDropdown
                                className="top-4 absolute rounded-md shadow-md bg-background-light dark:bg-admin-paper-dark right-0 z-[19]"
                                triggerChildren={({ trigger, onOpen }) => (
                                    <button
                                        ref={trigger}
                                        type="button"
                                        aria-label="button to open user dropdown"
                                        class=" text-sm flex justify-center items-center relative"
                                        onClick={onOpen}
                                    >
                                        <i
                                            class={`fa${
                                                storageEmpresa?.setting
                                                    .type_icons_bars ===
                                                "normal"
                                                    ? "s"
                                                    : "r"
                                            } fa-bell text-lg  lg:dark:text-white`}
                                        />
                                        <methods.NotificationCountComponent />
                                    </button>
                                )}
                            >
                                {({ onClose }) => (
                                    <methods.Notifications
                                        onClose={onClose}
                                        isWeb
                                    />
                                )}
                            </AdminDropdown>
                        );
                    })()}
                </>
            ) : null}
        </div>
    );
}

export default WebNotificacion;
