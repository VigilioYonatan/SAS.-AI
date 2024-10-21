import { Validator } from "@vigilio/express-core/valibot";
import {
    ordersStoreDto,
    type OrdersStoreDto,
} from "@/orders/dtos/orders.store.dto";
import { Body, Controller, Injectable, Post, Req } from "@vigilio/express-core";
import type { RequestVigilio } from "~/config/types";
import { IzipayApiService } from "../services/izipay.api.service";
import type { Empresas } from "@/empresas/entities/empresas.entity";

@Injectable()
@Controller("/izipay")
export class IzipayApiController {
    constructor(private readonly izipayApiService: IzipayApiService) {}

    @Validator(ordersStoreDto)
    @Post("/order")
    async izipay(
        @Body() body: OrdersStoreDto,
        @Req("empresa") empresa: Empresas
    ) {
        const result = await this.izipayApiService.izipay(body, empresa);
        return result;
    }

    @Post("/validate")
    async izipayValidate(
        @Body() body: KRIzipayResponse,
        @Req() req: RequestVigilio
    ) {
        const information = req.empresa!;
        const result = await this.izipayApiService.izipayValidate(
            body,
            information,
            req
        );
        return result;
    }
}
export interface KRIzipayResponse {
    _name: string;
    clientAnswer: {
        shopId: string;
        cardOrderCycle: string;
        orderCycle: string;
        orderStatus: "PAID";
        serverDate: string;
        orderDetails: {
            orderTotalAmount: number;
            orderEffectiveAmount: number;
            orderCurrency: string;
            mode: string;
            orderId: string;
            metadata: null;
            _type: string;
        };
        customer: {
            billingDetails: {
                address: null;
                category: null;
                cellPhoneNumber: null;
                city: null;
                country: null;
                district: null;
                firstName: null;
                identityCode: null;
                identityType: null;
                language: string;
                lastName: null;
                phoneNumber: null;
                state: null;
                streetNumber: null;
                title: null;
                zipCode: null;
                legalName: null;
                _type: string;
            };
            email: null;
            reference: null;
            shippingDetails: {
                address: null;
                address2: null;
                category: null;
                city: null;
                country: null;
                deliveryCompanyName: null;
                district: null;
                firstName: null;
                identityCode: null;
                lastName: null;
                legalName: null;
                phoneNumber: null;
                shippingMethod: null;
                shippingSpeed: null;
                state: null;
                streetNumber: null;
                zipCode: null;
                _type: string;
            };
            extraDetails: {
                browserAccept: null;
                fingerPrintId: null;
                ipAddress: string;
                browserUserAgent: string;
                _type: string;
            };
            shoppingCart: {
                insuranceAmount: null;
                shippingAmount: null;
                taxAmount: null;
                cartItemInfo: null;
                _type: string;
            };
            _type: string;
        };
        transactions: [
            {
                shopId: string;
                uuid: string;
                amount: number;
                currency: string;
                izipayMethodType: string;
                izipayMethodToken: null;
                status: "PAID";
                detailedStatus: string;
                operationType: string;
                effectiveStrongAuthentication: string;
                creationDate: string;
                errorCode: null;
                errorMessage: null;
                detailedErrorCode: null;
                detailedErrorMessage: null;
                metadata: null;
                transactionDetails: {
                    liabilityShift: string;
                    effectiveAmount: number;
                    effectiveCurrency: string;
                    creationContext: string;
                    cardDetails: {
                        izipaySource: string;
                        manualValidation: string;
                        expectedCaptureDate: string;
                        effectiveBrand: string;
                        pan: string;
                        expiryMonth: number;
                        expiryYear: number;
                        country: string;
                        issuerCode: null;
                        issuerName: string;
                        effectiveProductCode: string;
                        legacyTransId: string;
                        legacyTransDate: string;
                        izipayMethodSource: string;
                        authorizationResponse: {
                            amount: number;
                            currency: string;
                            authorizationDate: string;
                            authorizationNumber: string;
                            authorizationResult: string;
                            authorizationMode: string;
                            _type: string;
                        };
                        captureResponse: {
                            refundAmount: null;
                            refundCurrency: null;
                            captureDate: null;
                            captureFileNumber: null;
                            effectiveRefundAmount: null;
                            effectiveRefundCurrency: null;
                            _type: string;
                        };
                        threeDSResponse: {
                            authenticationResultData: {
                                transactionCondition: null;
                                enrolled: null;
                                status: null;
                                eci: null;
                                xid: null;
                                cavvAlgorithm: null;
                                cavv: null;
                                signValid: null;
                                brand: null;
                                _type: string;
                            };
                            _type: string;
                        };
                        authenticationResponse: null;
                        installmentNumber: number;
                        installmentCode: string;
                        markAuthorizationResponse: {
                            amount: null;
                            currency: null;
                            authorizationDate: null;
                            authorizationNumber: null;
                            authorizationResult: null;
                            _type: string;
                        };
                        cardHolderName: null;
                        cardHolderPan: string;
                        cardHolderExpiryMonth: number;
                        cardHolderExpiryYear: number;
                        identityDocumentNumber: null;
                        identityDocumentType: null;
                        initialIssuerTransactionIdentifier: null;
                        productCategory: string;
                        nature: string;
                        _type: string;
                    };
                    izipayMethodDetails: {
                        id: string;
                        izipaySource: string;
                        manualValidation: string;
                        expectedCaptureDate: string;
                        effectiveBrand: string;
                        expiryMonth: number;
                        expiryYear: number;
                        country: string;
                        issuerCode: null;
                        issuerName: string;
                        effectiveProductCode: string;
                        legacyTransId: string;
                        legacyTransDate: string;
                        izipayMethodSource: string;
                        authorizationResponse: {
                            amount: number;
                            currency: string;
                            authorizationDate: string;
                            authorizationNumber: string;
                            authorizationResult: string;
                            authorizationMode: string;
                            _type: string;
                        };
                        captureResponse: {
                            refundAmount: null;
                            refundCurrency: null;
                            captureDate: null;
                            captureFileNumber: null;
                            effectiveRefundAmount: null;
                            effectiveRefundCurrency: null;
                            _type: string;
                        };
                        authenticationResponse: null;
                        installmentNumber: number;
                        installmentCode: string;
                        markAuthorizationResponse: {
                            amount: null;
                            currency: null;
                            authorizationDate: null;
                            authorizationNumber: null;
                            authorizationResult: null;
                            _type: string;
                        };
                        cardHolderName: null;
                        cardHolderPan: string;
                        cardHolderExpiryMonth: number;
                        cardHolderExpiryYear: number;
                        identityDocumentNumber: null;
                        identityDocumentType: null;
                        initialIssuerTransactionIdentifier: null;
                        _type: string;
                    };
                    acquirerDetails: null;
                    fraudManagement: {
                        _type: string;
                    };
                    subscriptionDetails: {
                        subscriptionId: null;
                        _type: string;
                    };
                    parentTransactionUuid: null;
                    mid: string;
                    sequenceNumber: number;
                    taxAmount: null;
                    preTaxAmount: null;
                    taxRate: null;
                    externalTransactionId: string;
                    nsu: null;
                    tid: null;
                    acquirerNetwork: string;
                    taxRefundAmount: null;
                    userInfo: string;
                    izipayMethodTokenPreviouslyRegistered: null;
                    occurrenceType: string;
                    archivalReferenceId: string;
                    useCase: null;
                    wallet: null;
                    _type: string;
                };
                _type: string;
            }
        ];
        subMerchantDetails: null;
        _type: string;
    };
    hash: string;
    hashAlgorithm: string;
    hashKey: string;
    serverDate: null;
    _type: string;
    form: object;
    extra: object;
    rawClientAnswer: string;
    formId: string;
    __store: boolean;
}
