import enviroments from "~/config/enviroments.config";
import type { Empresas } from "../entities/empresas.entity";
import type { Settings } from "../entities/settings.entity";
import { Regions } from "@/ubigeo/entities/regions.entity";
import { Countries } from "@/ubigeo/entities/countries.entity";
import { RegionsEmpresa } from "@/ubigeo/entities/regions_empresa.entity";
export enum DIALCODE {
    mexico = "52",
    peru = "51",
    españa = "34",
}

export function BASE_URL(empresa: Empresas) {
    return enviroments.NODE_ENV === "production"
        ? (empresa.setting as Settings)?.host.host &&
          (empresa.setting as Settings)?.host.enabled
            ? `https://www.${(empresa.setting as Settings)?.host.host}`
            : `https://www.${empresa.slug}.vigilio-services.com`
        : `http://www.${empresa.slug}.localhost:4003`;
}
export const empresasLogoQualities = [100, 300];
export const empresasLogoPWAQualities = [73, 94, 145, 153, 193, 513];
export const backgroundQualities = [100, 1600];
// TIPO EMPRESA

export type OtherServicio = 40 | 41 | 42;

export const otherServicio: OtherServicio[] = [40, 41, 42];
export const empresaOTROID = {
    1: 40,
    2: 41,
    3: 42,
};

export async function regionsCountry(empresa: Empresas) {
    const regions = await Regions.findAll({
        include: [
            {
                model: Countries,
                where: {
                    code: empresa.dial_code,
                },
                required: true,
                attributes: ["code"],
            },
        ],
    });

    const allData = await Promise.all(
        regions.map(async (data) => {
            const regionsEmpresa = await RegionsEmpresa.findOne({
                where: {
                    empresa_id: empresa.id,
                    region_id: data.id,
                },
            });
            return {
                ...data.toJSON(),
                priceShipping: regionsEmpresa?.priceShipping,
                enabled: regionsEmpresa?.enabled,
                days: regionsEmpresa?.days,
            };
        })
    );
    return allData.map((c) => ({
        name: c.name,
        price: c.priceShipping,
        days: c.days,
        enabled: c.enabled,
    }));
}

export type Money = "DOLARES" | "LOCAL";

export const MONEYLOCAL: Money = "LOCAL";
export const MONEYDOLARES: Money = "DOLARES";
export const paginatorHTML = `<div x-data="{ empresa: JSON.parse(localStorage.getItem(&#39;empresa&#39;) || &#39;{}&#39;), data: document.querySelector(&#39;others-page&#39;) ? JSON.parse(document.querySelector(&#39;others-page&#39;).getAttribute(&#39;:data&#39;) || &#39;[]&#39;) : [], paginator: document.querySelector(&#39;others-page&#39;) ? JSON.parse(document.querySelector(&#39;others-page&#39;).getAttribute(&#39;:paginator&#39;) || &#39;{}&#39;) : {} }" class="container-data">

  <div>
    <template x-for="sub in data" :key="sub.id">
      <div>
        <a :href="\`/subgeneros/\${sub.slug}\`" aria-label="music" x-text="sub.slug"></a>
      </div>
    </template>
  </div>

  <div>
    <ul class="pagination">
      <template x-if="paginator.currentPage > 1">
        <li>
          <a :href="paginator.onBackPage" aria-label="back" class="btn">&#8249;</a>
        </li>
      </template>

      <template x-if="paginator.startingBreakPointButtonIfCondition">
        <li class="ellipsis">
          <a :href="paginator.onInitialPage" class="btn"  aria-label="change">1</a>
          <span class="dots">...</span>
        </li>
      </template>

      <template x-for="page in paginator.pages" :key="page">
        <li>
          <template x-if="paginator.currentPage === page">
            <span class="active-page">
              <span x-text="page"></span>
            </span>
          </template>
          <template x-if="paginator.currentPage !== page">
            <a :href="\`/subgeneros?page=\${page}\`"  aria-label="current" class="btn">
              <span x-text="page"></span>
            </a>
          </template>
        </li>
      </template>

      <template x-if="paginator.endingBreakPointButtonIfCondition">
        <li class="ellipsis">
          <span class="dots">...</span>
          <a :href="\`/subgeneros?page=\${paginator.totalPages}\`"  aria-label="next" class="btn">
            <span x-text="paginator.totalPages"></span>
          </a>
        </li>
      </template>

      <template x-if="paginator.totalPages > paginator.currentPage">
        <li>
          <a :href="paginator.onNextPage" class="btn"  aria-label="next">&#8250;</a>
        </li>
      </template>
    </ul>
  </div>
</div>

<style>
  .container-data>div:nth-child(2) {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 3rem;
  }

  .container-data>div:nth-child(2)>div>a {
    background-color: var(--primary);
    color: white;
    padding: 0.8rem 1.5rem;
    border-radius: 0.8rem;
  }

  .container-data .pagination {
    display: flex;
    list-style: none;
    padding: 0;
    justify-content: center;
    margin: 3rem 0;
  }

  .container-data .btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2rem;
    height: 2rem;
    border: 1px solid #ccc;
    text-decoration: none;
    color: #555;
    background-color: #fff;
    margin: 0 0.2rem;
    cursor: pointer;
  }

  .container-data .btn:hover {
    background-color: #f0f0f0;
    color: #000;
  }

  .container-data .active-page {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2rem;
    height: 2rem;
    border: 1px solid var(--primary);
    background-color: var(--primary);
    color: #fff;
    margin: 0 0.2rem;
    cursor: default;
  }

  .container-data .ellipsis {
    display: flex;
    align-items: center;
  }

  .container-data .dots {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2rem;
    height: 2rem;
    color: #555;
  }
</style>`;
