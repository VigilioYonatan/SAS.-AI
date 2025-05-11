export const usersPhotoQualities = [100, 300];
// cache
export const ROLES = { admin: 1, trabajador: 2, user: 3 };

//
export function getOS(userAgent: string) {
    let os = "Unknown OS";

    if (userAgent.includes("Windows")) os = "Windows";
    else if (userAgent.includes("Mac OS")) os = "Mac OS";
    else if (userAgent.includes("Linux")) os = "Linux";
    else if (userAgent.includes("Android")) os = "Android";
    else if (userAgent.includes("iPhone") || userAgent.includes("iPad"))
        os = "iOS";
    return os;
}

export function getBrowser(userAgent: string) {
    let browser = "Desconocido";

    if (/edg/i.test(userAgent)) {
        browser = "Edge";
    } else if (/opr|opera/i.test(userAgent)) {
        browser = "Opera";
    } else if (/chrome/i.test(userAgent)) {
        browser = "Chrome";
    } else if (/safari/i.test(userAgent)) {
        browser = "Safari";
    } else if (/firefox/i.test(userAgent)) {
        browser = "Firefox";
    } else if (/msie|trident/i.test(userAgent)) {
        browser = "Internet Explorer";
    }
    return browser;
}

export async function getInformationWithIP() {
    let country: string | null = null;
    let city: string | null = null;
    const response = await fetch("http://ip-api.com/json/");
    const result = (await response.json()) as {
        status: string;
        country: string;
        countryCode: string;
        region: string;
        regionName: string;
        city: string;
        zip: string;
        lat: number;
        lon: number;
        timezone: string;
        isp: string;
        org: string;
        as: string;
        query: string;
    };
    if (result.status === "success") {
        country = result.country.toUpperCase();
        city = result.city.toUpperCase();
    } else {
        const response = await fetch("https://api.ipbase.com/v1/json/");
        const result = (await response.json()) as {
            ip: string;
            country_code: string;
            country_name: string;
            region_code: string;
            region_name: string;
            city: string;
            zip_code: string;
            time_zone: string;
            latitude: number;
            longitude: number;
            metro_code: number;
        };
        if (result.country_name.length) {
            country = result.country_name.toUpperCase();
            city = result.city.toUpperCase();
        } else {
            const response = await fetch("https://freegeoip.app/json/");
            const result = (await response.json()) as {
                ip: string;
                country_code: string;
                country_name: string;
                region_code: string;
                region_name: string;
                city: string;
                zip_code: string;
                time_zone: string;
                latitude: number;
                longitude: number;
                metro_code: number;
            };
            country = result.country_name.toUpperCase();
            city = result.city.toUpperCase();
        }
    }
    return `${country} - ${city}`;
}
