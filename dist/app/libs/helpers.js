"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateCodeEntity = generateCodeEntity;
exports.getIp = getIp;
exports.delay = delay;
exports.randomNumber = randomNumber;
exports.removeTextHTML = removeTextHTML;
exports.distanciaDeLevenshtein = distanciaDeLevenshtein;
exports.createIncrementArray = createIncrementArray;
exports.NoImage = NoImage;
exports.terminal = terminal;
exports.datetime = datetime;
exports.downloadAndSaveFile = downloadAndSaveFile;
const express_core_1 = require("@vigilio/express-core");
const valibot_1 = require("@vigilio/valibot");
const node_child_process_1 = require("node:child_process");
const node_stream_1 = require("node:stream");
const node_util_1 = __importStar(require("node:util"));
const fs = __importStar(require("node:fs"));
const pipelineAsync = (0, node_util_1.promisify)(node_stream_1.pipeline);
function generateCodeEntity(Item, latestCode, start, empresa) {
    return __awaiter(this, void 0, void 0, function* () {
        const latestUser = yield Item.findOne({
            order: [["createdAt", "DESC"]],
            where: {
                empresa_id: empresa.id,
            },
        });
        let code = null;
        if (latestUser) {
            const ultimoNumero = Number.parseInt(latestUser[latestCode].split("-")[1]);
            code = `${start.toUpperCase()}-${String(ultimoNumero + 1).padStart(6, "0")}`;
        }
        else {
            code = `${start.toUpperCase()}-000001`;
        }
        return code;
    });
}
function getIp() {
    return __awaiter(this, void 0, void 0, function* () {
        const ipResponse = yield fetch("https://api.ipify.org");
        const ipResult = yield ipResponse.text();
        return ipResult;
    });
}
function delay() {
    return __awaiter(this, arguments, void 0, function* (seg = 10) {
        return new Promise((res) => setTimeout(() => res(true), seg * 1000));
    });
}
function randomNumber(start, end) {
    return Math.floor(Math.random() * (end - start + 1)) + start;
}
function removeTextHTML(value) {
    return value
        ? value
            .replace(/<img[^>]*src="[^"]*"[^>]*>/gi, "")
            .replace(/(<([^>]+)>)/gi, "")
        : null;
}
function distanciaDeLevenshtein(a, b) {
    const lenA = a.length;
    const lenB = b.length;
    const matrix = Array(lenA + 1);
    for (let i = 0; i <= lenA; i++) {
        matrix[i] = Array(lenB + 1).fill(0);
    }
    for (let i = 0; i <= lenA; i++) {
        matrix[i][0] = i;
    }
    for (let j = 0; j <= lenB; j++) {
        matrix[0][j] = j;
    }
    for (let i = 1; i <= lenA; i++) {
        for (let j = 1; j <= lenB; j++) {
            const cost = a[i - 1] === b[j - 1] ? 0 : 1;
            matrix[i][j] = Math.min(matrix[i - 1][j] + 1, matrix[i][j - 1] + 1, matrix[i - 1][j - 1] + cost);
        }
    }
    return matrix[lenA][lenB];
}
function createIncrementArray(numbers) {
    const resultado = new Set();
    for (const num of numbers) {
        const multiploMasCercano = Math.floor(num / 5) * 5;
        resultado.add(multiploMasCercano);
    }
    return Array.from(resultado).sort((a, b) => a - b);
}
function NoImage() {
    return "/images/settings/others/no-image.webp";
}
const execAsync = node_util_1.default.promisify(node_child_process_1.exec);
function terminal(comando_1) {
    return __awaiter(this, arguments, void 0, function* (comando, ignore = false) {
        try {
            const { stdout, stderr } = yield execAsync(comando);
            if (stderr && !ignore) {
                throw new express_core_1.InternalServerErrorException(`Error en el comando, ${stderr}`);
            }
            return stdout;
        }
        catch (error) {
            throw new express_core_1.InternalServerErrorException(`Error server, ${error.message}`);
        }
    });
}
function datetime() {
    return (0, valibot_1.string)([
        (0, valibot_1.custom)((val) => {
            return /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(val);
        }, "Fecha no válida"),
    ]);
}
function downloadAndSaveFile(url, outputPath) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetch(url);
            if (!response.ok)
                throw new Error(`HTTP error! status: ${response.status}`);
            const body = response.body;
            if (!body) {
                throw new Error("La respuesta no contiene un cuerpo legible.");
            }
            yield pipelineAsync(response.body, fs.createWriteStream(outputPath));
            console.log("Archivo descargado y guardado exitosamente.");
        }
        catch (error) {
            console.error("Error al descargar el archivo:", error);
        }
    });
}
