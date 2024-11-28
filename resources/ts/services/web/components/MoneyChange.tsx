import useMoneyStore from "~/stores/money.store";
import WebDropdown from "./WebDropdown";
import useEmpresastore, {
    storageEmpresa,
} from "@/empresas/stores/empresa.store";
import { isColorLight } from "~/libs/helpers";
import { DIALCODE } from "@/empresas/libs/helpers";

function MoneyChange() {
    const moneyStore = useMoneyStore();
    const empresaStore = useEmpresastore();
    if (!empresaStore.state?.isDolar) return null;
    return (
        <WebDropdown
            triggerChildren={({ trigger, onOpenClose }) => (
                <button
                    ref={trigger}
                    onClick={() => onOpenClose()}
                    type="button"
                    aria-label="change money"
                >
                    {moneyStore.state.money === "DOLARES" ? (
                        <i class="fas fa-dollar-sign" />
                    ) : (
                        <div class="text-xs font-semibold flex flex-col  justify-center items-center">
                            <span>
                                {storageEmpresa?.dial_code === DIALCODE.peru
                                    ? "S/."
                                    : Number(1).toLocaleString(
                                          storageEmpresa!.money
                                              .international_simbolo,
                                          {
                                              style: "currency",
                                              currency:
                                                  storageEmpresa!.money.simbolo,
                                          }
                                      )[0]}
                            </span>
                            <span>{storageEmpresa?.money.simbolo}</span>
                        </div>
                    )}
                </button>
            )}
            className="!max-w-[160px] !min-w-[160px]  overflow-hidden"
        >
            <div class="flex flex-col">
                <a
                    class={`py-2 ${
                        moneyStore.state.money === "DOLARES"
                            ? `bg-primary ${
                                  isColorLight(
                                      empresaStore.state!.setting.bg_color
                                  )
                                      ? ""
                                      : "text-white"
                              }`
                            : ""
                    }  px-2 font-semibold text-xs text-center`}
                    href="/change-money/DOLARES"
                >
                    USD - Dólares
                </a>
                <a
                    class={`py-2 px-2 font-semibold text-xs text-center ${
                        moneyStore.state.money === "LOCAL"
                            ? `bg-primary ${
                                  isColorLight(
                                      empresaStore.state!.setting.bg_color
                                  )
                                      ? ""
                                      : "text-white"
                              }`
                            : ""
                    } `}
                    href="/change-money/LOCAL"
                >
                    {storageEmpresa?.money.simbolo}
                    {" - "}
                    {storageEmpresa?.money.money}
                </a>
            </div>
        </WebDropdown>
    );
}

export default MoneyChange;
