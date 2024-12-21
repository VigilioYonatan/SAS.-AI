import { type UseQuery, useQuery } from "@vigilio/preact-fetching";

export function emailsAccountsApi(): UseQuery<
    EmailsAccountAPI,
    EmailsAccountsErrorAPI
> {
    return useQuery<EmailsAccountAPI, EmailsAccountsErrorAPI>(
        "/emails/accounts",
        async (url) => {
            const response = await fetch(`/api${url}`);
            const result = await response.json();
            if (!response.ok) throw result;
            return result;
        }
    );
}

export interface EmailsAccountsErrorAPI {
    success: boolean;
    message: string;
}
export interface EmailsAccountAPI {
    status: Status;
    data: Datum[];
}

export interface Datum {
    country: string;
    lastLogin: number;
    mxStatus: boolean;
    activeSyncEnabled: boolean;
    incomingBlocked: boolean;
    language: string;
    type: string;
    extraStorage: object;
    incomingUserName: string;
    emailAddress: EmailAddress[];
    mailboxStatus: string;
    popBlocked: boolean;
    usedStorage: number;
    spamcheckEnabled: boolean;
    imapAccessEnabled: boolean;
    timeZone: string;
    accountCreationTime: number;
    zuid: number;
    webBlocked: boolean;
    planStorage: number;
    firstName: string;
    accountId: string;
    sequence: number;
    mailboxAddress: string;
    lastPasswordReset: number;
    tfaEnabled: boolean;
    iamStatus: number;
    status: boolean;
    lastName: string;
    accountDisplayName: string;
    role: string;
    gender: string;
    accountName: string;
    displayName: string;
    isLogoExist: boolean;
    URI: string;
    primaryEmailAddress: string;
    enabled: boolean;
    mailboxCreationTime: number;
    basicStorage: string;
    lastClient: string;
    allowedStorage: number;
    sendMailDetails: SendMailDetail[];
    popFetchTime: number;
    address: object;
    planType: number;
    userExpiry: number;
    popAccessEnabled: boolean;
    imapBlocked: boolean;
    iamUserRole: string;
    outgoingBlocked: boolean;
    policyId: PolicyID;
    smtpStatus: boolean;
    extraEDiscoveryStorage: object;
}

export interface EmailAddress {
    isAlias: boolean;
    isPrimary: boolean;
    mailId: string;
    isConfirmed: boolean;
}

export interface PolicyID {
    "1082700000274763769": string;
    zoid: number;
}

export interface SendMailDetail {
    sendMailId: string;
    displayName: string;
    serverName: string;
    signatureId: string;
    serverPort: number;
    userName: string;
    connectionType: string;
    mode: string;
    validated: boolean;
    fromAddress: string;
    smtpConnection: number;
    validationRequired: boolean;
    validationState: number;
    status: boolean;
}

export interface Status {
    code: number;
    description: string;
}
