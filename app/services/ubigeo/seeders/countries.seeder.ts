import enviroments from "~/config/enviroments.config";
import { Countries } from "../entities/countries.entity";
import { departmentsSeeder } from "./peru/departments.seeder";
import { districtsSeeder } from "./peru/districts.seeder";
import { regionesSeederChile } from "./chile/regiones.seeder";
import { provinceSeederChile } from "./chile/province.seeder";
import { communesSeederChile } from "./chile/communes.seeder";
import { estadosSeeder } from "./argentina/estados.seeder";
import { localidadesArgentinaSeeder } from "./argentina/localidades.seeder";
import { todoSeederColombia } from "./colombia/todo.seeder";
import { estadosSeederMexico } from "./mexico/estados.seeder";
import { ciudadesSeederMexico } from "./mexico/ciudades.seeder";
import { estadosSeederBrasil } from "./brazil/estados.seeder";
import { ciudadesSeederBrazil } from "./brazil/ciudades.seeder";
import { uruguaySeeder } from "./uruguay/uruguay.seeder";
import { provinciasSeederEcuador } from "./ecuador/provincias.seeder";
import { cantonesSeederEcuador } from "./ecuador/cantones.seeder";
import { parroquiasSeederEcuador } from "./ecuador/parroquias.seeder";

export const countriesSeeder = [
    {
        value: "Perú",
        key: "pe",
        dial_code: "51",
        map_marker: { lat: -12.053221, lng: -77.044861 },
        money: "Sol Peruano",
        simbolo: "PEN",
        international_simbolo: "es-PE",
        image: "https://flagcdn.com/w320/pe.png",
        impuesto: 18,
        bancos: [
            {
                key: "bcp",
                value: "BCP",
                image: `${enviroments.VITE_URL}/images/settings/others/bancos/bcp.png`,
            },
            {
                key: "interbank",
                value: "Interbank",
                image: `${enviroments.VITE_URL}/images/settings/others/bancos/interbank.png`,
            },
            {
                key: "bbva",
                value: "BBVA",
                image: `${enviroments.VITE_URL}/images/settings/others/bancos/bbva.png`,
            },
        ],
    },
    {
        value: "Chile",
        key: "cl",
        dial_code: "56",
        map_marker: { lat: -33.4489, lng: -70.6693 },
        impuesto: 19,
        money: "Peso Chileno",
        simbolo: "CLP",
        image: "https://flagcdn.com/w320/cl.png",
        international_simbolo: "es-CL",
        bancos: [
            {
                key: "banco_de_chile",
                value: "Banco de Chile",
                image: `${enviroments.VITE_URL}/images/settings/others/bancos/bancochile.png`,
            },
            {
                key: "banco_santander_chile",
                value: "Banco Santander Chile",
                image: `${enviroments.VITE_URL}/images/settings/others/bancos/santander.png`,
            },
            {
                key: "bci",
                value: "BCI",
                image: `${enviroments.VITE_URL}/images/settings/others/bancos/bci.png`,
            },
        ],
    },
    {
        value: "Argentina",
        key: "ar",
        dial_code: "54",
        map_marker: { lat: -34.6037, lng: -58.3816 },
        money: "Peso Argentino",
        simbolo: "ARS",
        international_simbolo: "es-AR",
        image: "https://flagcdn.com/w320/ar.png",

        impuesto: 21,
        bancos: [
            {
                key: "banco_nacion",
                value: "Banco Nación",
                image: `${enviroments.VITE_URL}/images/settings/others/bancos/banconacion.png`,
            },
            {
                key: "banco_galicia",
                value: "Banco Galicia",
                image: `${enviroments.VITE_URL}/images/settings/others/bancos/galicia.png`,
            },
            {
                key: "banco_santander_rio",
                value: "Banco Santander Río",
                image: `${enviroments.VITE_URL}/images/settings/others/bancos/santander.png`,
            },
        ],
    },
    {
        value: "Colombia",
        key: "co",
        dial_code: "57",
        map_marker: { lat: 4.611, lng: -74.081 },
        impuesto: 19,
        money: "Peso Colombiano",
        simbolo: "COP",
        international_simbolo: "es-CO",
        image: "https://flagcdn.com/w320/co.png",

        bancos: [
            {
                key: "bancolombia",
                value: "Bancolombia",
                image: `${enviroments.VITE_URL}/images/settings/others/bancos/bancolombia.webp`,
            },
            {
                key: "banco_de_bogota",
                value: "Banco de Bogotá",
                image: `${enviroments.VITE_URL}/images/settings/others/bancos/bancobogota.webp`,
            },
            {
                key: "davivienda",
                value: "Davivienda",
                image: `${enviroments.VITE_URL}/images/settings/others/bancos/davivienda.webp`,
            },
        ],
    },
    {
        value: "México",
        key: "mx",
        dial_code: "52",
        map_marker: { lat: 19.4326, lng: -99.1332 },
        impuesto: 16,
        money: "Peso Mexicano",
        simbolo: "MXN",
        international_simbolo: "es-MX",
        image: "https://flagcdn.com/w320/mx.png",

        bancos: [
            {
                key: "bbva",
                value: "BBVA",
                image: `${enviroments.VITE_URL}/images/settings/others/bancos/bbva.png`,
            },
            {
                key: "citibanamex",
                value: "Citibanamex",
                image: `${enviroments.VITE_URL}/images/settings/others/bancos/citibanamex.png`,
            },
            {
                key: "banco_santander",
                value: "Santander",
                image: `${enviroments.VITE_URL}/images/settings/others/bancos/santander.png`,
            },
        ],
    },
    {
        value: "Brazil",
        key: "br",
        dial_code: "55",
        map_marker: { lat: -15.7801, lng: -47.9292 },
        impuesto: 17,
        money: "Real Brasileño",
        simbolo: "BRL",
        international_simbolo: "pt-BR",
        image: "https://flagcdn.com/w320/br.png",

        bancos: [
            {
                key: "itau",
                value: "Itaú ",
                image: `${enviroments.VITE_URL}/images/settings/others/bancos/itau.svg`,
            },
            {
                key: "bradesco",
                value: "Bradesco",
                image: `${enviroments.VITE_URL}/images/settings/others/bancos/bradesco.png`,
            },
            {
                key: "santander",
                value: "Santander",
                image: `${enviroments.VITE_URL}/images/settings/others/bancos/santander.png`,
            },
        ],
    },
    {
        value: "Uruguay",
        key: "uy",
        dial_code: "598",
        map_marker: { lat: -34.9036, lng: -56.1882 },
        impuesto: 22,
        money: "Peso Uruguayo",
        simbolo: "UYU",
        international_simbolo: "es-UY",
        image: "https://flagcdn.com/w320/uy.png",

        bancos: [
            {
                key: "Banco_republica",
                value: "Banco República",
                image: `${enviroments.VITE_URL}/images/settings/others/bancos/brou.png`,
            },

            {
                key: "santander",
                value: "Santander",
                image: `${enviroments.VITE_URL}/images/settings/others/bancos/santander.png`,
            },
            {
                key: "bbva",
                value: "BBVA",
                image: `${enviroments.VITE_URL}/images/settings/others/bancos/bbva.png`,
            },
        ],
    },
    {
        value: "Ecuador",
        key: "ec",
        dial_code: "593",
        map_marker: { lat: -0.2316, lng: -78.5283 },
        impuesto: 12,
        money: "Dólar Estadounidense",
        simbolo: "USD",
        international_simbolo: "es-EC",
        image: "https://flagcdn.com/w320/ec.png",

        bancos: [
            {
                key: "pichincha",
                value: "Pichincha",
                image: `${enviroments.VITE_URL}/images/settings/others/bancos/pichincha.png`,
            },

            {
                key: "banco_del_pacifico",
                value: "Banco del Pacífico",
                image: `${enviroments.VITE_URL}/images/settings/others/bancos/bancopacifico.png`,
            },
            {
                key: "produbanco",
                value: "Produbanco",
                image: `${enviroments.VITE_URL}/images/settings/others/bancos/produbanco.png`,
            },
        ],
    },
];
export async function ubigeoSeeder() {
    await Promise.all(
        countriesSeeder.map(async (c) => {
            const country = await Countries.create({
                code: c.dial_code,
                name: c.value,
            });
            if (c.dial_code === "51")
                await Promise.all(
                    departmentsSeeder.map(async (department) => {
                        const region = await country.$create("region", {
                            code: department.ubigeo,
                            name: department.name,
                            priceShipping: 0,
                            enabled: true,
                            days: 3,
                        });
                        const distritos = districtsSeeder.filter(
                            (dist) => dist.department_id === department.ubigeo
                        );

                        await Promise.all(
                            distritos.map(async (district) => {
                                return await region.$create("city", {
                                    code: district.ubigeo,
                                    name: district.name,
                                });
                            })
                        );
                    })
                );
            if (c.dial_code === "56") {
                await Promise.all(
                    regionesSeederChile.map(async (re) => {
                        const region = await country.$create("region", {
                            code: re.code,
                            name: re.name.short,
                            priceShipping: 0,
                            enabled: true,
                            days: 3,
                        });

                        const communesSeeder = provinceSeederChile.filter(
                            (pro) => {
                                const findCommunes = communesSeederChile.find(
                                    (c) =>
                                        c.province === pro.code &&
                                        pro.region === re.code
                                );

                                return findCommunes!;
                            }
                        );

                        await Promise.all(
                            communesSeeder.map(async (com) => {
                                await region.$create("city", {
                                    code: com.code,
                                    name: com.name,
                                });
                            })
                        );
                    })
                );
            }
            if (c.dial_code === "54") {
                await Promise.all(
                    estadosSeeder.map(async (estado) => {
                        const region = await country.$create("region", {
                            code: estado.code,
                            name: estado.name,
                            priceShipping: 0,
                            enabled: true,
                            days: 3,
                        });
                        const localidades = localidadesArgentinaSeeder.filter(
                            (localidad) => localidad.code === estado.code
                        );
                        await Promise.all(
                            localidades.map(async (local, i) => {
                                await region.$create("city", {
                                    code: String(i + 1),
                                    name: local.name,
                                });
                            })
                        );
                    })
                );
            }
            if (c.dial_code === "57") {
                await Promise.all(
                    todoSeederColombia.map(async (todo) => {
                        const region = await country.$create("region", {
                            code: String(todo.id),
                            name: todo.departamento,
                            priceShipping: 0,
                            enabled: true,
                            days: 3,
                        });
                        await Promise.all(
                            todo.ciudades.map(async (ciudad, i) => {
                                await region.$create("city", {
                                    code: `${todo.id}${i}`,
                                    name: ciudad,
                                });
                            })
                        );
                    })
                );
            }
            if (c.dial_code === "52") {
                await Promise.all(
                    estadosSeederMexico.map(async (estado) => {
                        const region = await country.$create("region", {
                            code: String(estado.key),
                            name: estado.name,
                            priceShipping: 0,
                            enabled: true,
                            days: 3,
                        });

                        const citites = ciudadesSeederMexico.filter(
                            (c) => c.state_id === estado.key
                        );
                        await Promise.all(
                            citites.map(async (city) => {
                                await region.$create("city", {
                                    code: city.key,
                                    name: city.name,
                                });
                            })
                        );
                    })
                );
            }
            if (c.dial_code === "55") {
                await Promise.all(
                    estadosSeederBrasil.map(async (estado) => {
                        const region = await country.$create("region", {
                            code: String(estado.ID),
                            name: estado.Nome,
                            priceShipping: 0,
                            enabled: true,
                            days: 3,
                        });

                        const cities = ciudadesSeederBrazil.filter(
                            (c) => c.Estado === estado.ID
                        );
                        await Promise.all(
                            cities.map(async (city) => {
                                await region.$create("city", {
                                    code: city.ID,
                                    name: city.Nome,
                                });
                            })
                        );
                    })
                );
            }
            if (c.dial_code === "598") {
                await Promise.all(
                    uruguaySeeder.map(async (uru, i) => {
                        const region = await country.$create("region", {
                            code: String(i + 1),
                            name: uru.departamento,
                            priceShipping: 0,
                            enabled: true,
                            days: 3,
                        });

                        await Promise.all(
                            uru.ciudades.map(async (city, i) => {
                                await region.$create("city", {
                                    code: `${i + 1}${i}`,
                                    name: city,
                                });
                            })
                        );
                    })
                );
            }
            if (c.dial_code === "593") {
                await Promise.all(
                    provinciasSeederEcuador.map(async (uru) => {
                        const region = await country.$create("region", {
                            code: String(uru.id),
                            name: uru.name,
                            priceShipping: 0,
                            enabled: true,
                            days: 3,
                        });

                        const parroquias = cantonesSeederEcuador.filter((c) =>
                            parroquiasSeederEcuador.find(
                                (p) => p.cantone_id === c.id
                            )
                        );
                        await Promise.all(
                            parroquias.map(async (parroquia) => {
                                await region.$create("city", {
                                    code: parroquia.id,
                                    name: parroquia.name,
                                });
                            })
                        );
                    })
                );
            }
        })
    );
}
