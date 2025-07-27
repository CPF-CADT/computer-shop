import { createHash } from 'crypto';
import axios, { AxiosInstance, AxiosError } from 'axios';

const emv = {
    default_dynamic_qr: "010212",
    default_static_qr: "010211",
    transaction_currency_usd: "840",
    transaction_currency_khr: "116",
    transaction_currency: "53",
    payload_format_indicator: "00",
    default_payload_format_indicator: "01",
    point_of_initiation_method: "01",
    merchant_name: "59",
    merchant_city: "60",
    default_merchant_city: "Phnom Penh",
    merchant_category_code: "52",
    default_merchant_category_code: "5999",
    merchant_account_information_individual: "29",
    transaction_amount: "54",
    country_code: "58",
    default_country_code: "KH",
    addtion_data_tag: "62",
    billnumber_tag: "01",
    addition_data_field_mobile_number: "02",
    store_label: "03",
    terminal_label: "07",
    timestamp_tag: "99",
    language_perference: "00",
    crc: "63",
    default_crc_tag: "6304",
    invalid_length_merchant_name: 25,
    invalid_length_bakong_account: 32,
    invalid_length_amount: 13,
    invalid_length_merchant_city: 15,
    invalid_length_bill_number: 25,
    invalid_length_store_label: 25,
    invalid_length_terminal_label: 25,
    invalid_length_mobile_number: 25,
} as const;

// --- Type Definitions ---

type Currency = 'USD' | 'KHR';
type PaymentStatus = 'PAID' | 'UNPAID';

interface CreateQRParams {
    bankAccount: string;
    merchantName: string;
    merchantCity: string;
    currency: Currency;
    amount?: string | number;
    storeLabel?: string;
    phoneNumber?: string;
    billNumber?: string;
    terminalLabel?: string;
    isStatic?: boolean;
}

interface DeeplinkOptions {
    callback?: string;
    appIconUrl?: string;
    appName?: string;
}

// API Response Interfaces
interface BakongDeeplinkResponse {
    responseCode: number;
    data?: {
        shortLink: string;
    };
    message?: string;
}

interface BakongTransactionResponse {
    responseCode: number;
    data?: Record<string, any>;
    message?: string;
}

interface BakongBulkStatus {
    status: "SUCCESS" | "FAILED";
    md5: string;
}

interface BakongBulkResponse {
    responseCode: number;
    data?: BakongBulkStatus[];
    message?: string;
}


// --- SDK Classes ---

class TransactionCurrency {
    public value(currency: Currency): string {
        const normalizedCurrency = currency.toUpperCase();
        let currencyValue: string;

        if (normalizedCurrency === "USD") {
            currencyValue = emv.transaction_currency_usd;
        } else if (normalizedCurrency === "KHR") {
            currencyValue = emv.transaction_currency_khr;
        } else {
            throw new Error(`Invalid currency code '${currency}'. Supported codes are 'USD' and 'KHR'.`);
        }

        const lengthOfCurrency = String(currencyValue.length).padStart(2, '0');
        return `${emv.transaction_currency}${lengthOfCurrency}${currencyValue}`;
    }
}

class TimeStamp {
    public value(): string {
        const timestamp = String(Date.now());
        const lengthOfTimestamp = String(timestamp.length).padStart(2, '0');
        const result = `${emv.language_perference}${lengthOfTimestamp}${timestamp}`;
        const lengthResult = String(result.length).padStart(2, '0');
        return `${emv.timestamp_tag}${lengthResult}${result}`;
    }
}

class PointOfInitiation {
    public dynamic(): string { return emv.default_dynamic_qr; }
    public static(): string { return emv.default_static_qr; }
}

class PayloadFormatIndicator {
    public value(): string {
        const length = emv.default_payload_format_indicator.length;
        const lengthStr = String(length).padStart(2, '0');
        return `${emv.payload_format_indicator}${lengthStr}${emv.default_payload_format_indicator}`;
    }
}

class MerchantName {
    public value(merchantName: string): string {
        if (!merchantName) throw new Error("Merchant Name cannot be empty.");
        if (merchantName.length > emv.invalid_length_merchant_name) {
            throw new Error(`Merchant Name cannot exceed ${emv.invalid_length_merchant_name} characters.`);
        }
        const lengthStr = String(merchantName.length).padStart(2, '0');
        return `${emv.merchant_name}${lengthStr}${merchantName}`;
    }
}

class MerchantCity {
    public value(merchantCity: string): string {
        if (!merchantCity) throw new Error("Merchant city cannot be empty.");
        if (merchantCity.length > emv.invalid_length_merchant_city) {
            throw new Error(`Merchant City cannot exceed ${emv.invalid_length_merchant_city} characters.`);
        }
        const lengthStr = String(merchantCity.length).padStart(2, '0');
        return `${emv.merchant_city}${lengthStr}${merchantCity}`;
    }
}

class MCC {
    public value(categoryCode?: string): string {
        const code = categoryCode || emv.default_merchant_category_code;
        if (!/^\d{4,}$/.test(code)) {
            throw new Error("Category code must be a numeric string with at least 4 digits.");
        }
        const lengthStr = String(code.length).padStart(2, '0');
        return `${emv.merchant_category_code}${lengthStr}${code}`;
    }
}

class HASH {
    public md5(data: string): string {
        return createHash('md5').update(data, 'utf-8').digest('hex');
    }
}

class GlobalUniqueIdentifier {
    public value(bankAccount: string): string {
        if (bankAccount.length > emv.invalid_length_bakong_account) {
            throw new Error(`Bank account cannot exceed ${emv.invalid_length_bakong_account} characters.`);
        }
        const lengthOfBankAccount = String(bankAccount.length).padStart(2, '0');
        const result = `${emv.payload_format_indicator}${lengthOfBankAccount}${bankAccount}`;
        const lengthResult = String(result.length).padStart(2, '0');
        return `${emv.merchant_account_information_individual}${lengthResult}${result}`;
    }
}

class CRC {
    private calculateCRC16(data: string): number {
        let crc = 0xFFFF;
        const polynomial = 0x1021;
        const buffer = Buffer.from(data, 'utf-8');

        for (const byte of buffer) {
            crc ^= (byte << 8);
            for (let i = 0; i < 8; i++) {
                if ((crc & 0x8000) !== 0) {
                    crc = ((crc << 1) ^ polynomial);
                } else {
                    crc <<= 1;
                }
            }
        }
        return crc & 0xFFFF;
    }

    private crc16Hex(data: string): string {
        const crcResult = this.calculateCRC16(data);
        return crcResult.toString(16).toUpperCase().padStart(4, '0');
    }

    public value(data: string): string {
        const crc16Hex = this.crc16Hex(data + emv.default_crc_tag);
        const lengthOfCrc = String(crc16Hex.length).padStart(2, '0');
        return `${emv.crc}${lengthOfCrc}${crc16Hex}`;
    }
}

class CountryCode {
    public value(countryCode?: string): string {
        const code = countryCode || emv.default_country_code;
        const lengthOfCountryCode = String(code.length).padStart(2, '0');
        return `${emv.country_code}${lengthOfCountryCode}${code}`;
    }
}

class Amount {
    public value(amount: string | number): string {
        const amountFloat = parseFloat(String(amount));
        if (isNaN(amountFloat)) {
             throw new Error(`Invalid amount value: ${amount}.`);
        }

        let amountStr = amountFloat.toFixed(2);
        if (amountStr.includes('.')) {
            amountStr = amountStr.replace(/\.?0+$/, "");
        }

        if (amountStr.length > emv.invalid_length_amount) {
            throw new Error(`Amount exceeds maximum length of ${emv.invalid_length_amount} characters.`);
        }

        const lengthOfAmount = String(amountStr.length).padStart(2, '0');
        return `${emv.transaction_amount}${lengthOfAmount}${amountStr}`;
    }
}

class AdditionalDataField {
    private formatValue(tag: string, value: string | number, maxLength: number, fieldName: string): string {
        const valueStr = String(value);
        if (valueStr.length > maxLength) {
            throw new Error(`${fieldName} cannot exceed ${maxLength} characters.`);
        }
        const lengthOfValue = String(valueStr.length).padStart(2, '0');
        return `${tag}${lengthOfValue}${valueStr}`;
    }

    public value(storeLabel: string, phoneNumber: string, billNumber: string, terminalLabel: string): string {
        const billNumberPart = this.formatValue(emv.billnumber_tag, billNumber, emv.invalid_length_bill_number, "Bill number");
        const mobileNumberPart = this.formatValue(emv.addition_data_field_mobile_number, phoneNumber, emv.invalid_length_mobile_number, "Phone number");
        const storeLabelPart = this.formatValue(emv.store_label, storeLabel, emv.invalid_length_store_label, "Store label");
        const terminalLabelPart = this.formatValue(emv.terminal_label, terminalLabel, emv.invalid_length_terminal_label, "Terminal label");

        const combinedData = billNumberPart + mobileNumberPart + storeLabelPart + terminalLabelPart;
        const lengthOfCombinedData = String(combinedData.length).padStart(2, '0');
        return `${emv.addtion_data_tag}${lengthOfCombinedData}${combinedData}`;
    }
}

class KHQR {
    private apiClient: AxiosInstance;
    private crc = new CRC();
    private mcc = new MCC();
    private hash = new HASH();
    private amount = new Amount();
    private timestamp = new TimeStamp();
    private countryCode = new CountryCode();
    private merchantCity = new MerchantCity();
    private merchantName = new MerchantName();
    private pointOfInitiation = new PointOfInitiation();
    private transactionCurrency = new TransactionCurrency();
    private additionalDataField = new AdditionalDataField();
    private payloadFormatIndicator = new PayloadFormatIndicator();
    private globalUniqueIdentifier = new GlobalUniqueIdentifier();

    constructor(bakongToken: string) {
        if (!bakongToken) {
            throw new Error("Bakong Developer Token is required. Initialize with: new KHQR('your_token_here')");
        }

        // Create an Axios instance specific to this KHQR instance
        this.apiClient = axios.create({
            baseURL: "https://api-bakong.nbc.gov.kh/v1",
            headers: {
                'Content-Type': 'application/json',
            }
        });

        this.apiClient.interceptors.request.use(
            (config) => {
                config.headers['Authorization'] = `Bearer ${bakongToken}`;
                return config;
            },
            (error) => Promise.reject(error)
        );
    }
    
    private handleApiError(error: unknown): never {
        if (axios.isAxiosError(error)) {
            const axiosError = error as AxiosError;
            if (axiosError.response) {
                const { status, data } = axiosError.response;
                if (status === 401) {
                    throw new Error("Your Developer Token is incorrect or expired.");
                }
                if (status === 504) {
                    throw new Error("Bakong server is busy, please try again later.");
                }
                // Use the error message from the API if available
                const message = (data as any)?.message || JSON.stringify(data);
                throw new Error(`API request failed with status ${status}: ${message}`);
            } else if (axiosError.request) {
                throw new Error("Network error: No response received from the server.");
            }
        }
        // For non-Axios errors
        throw error;
    }

    public createQR({
        bankAccount,
        merchantName,
        merchantCity,
        amount,
        currency,
        storeLabel = '',
        phoneNumber = '',
        billNumber = '',
        terminalLabel = '',
        isStatic = false
    }: CreateQRParams): string {
        if (!isStatic && (amount === undefined || amount === null)) {
            throw new Error("Amount is required for dynamic QR codes.");
        }

        let qrData = this.payloadFormatIndicator.value();
        qrData += isStatic ? this.pointOfInitiation.static() : this.pointOfInitiation.dynamic();
        qrData += this.globalUniqueIdentifier.value(bankAccount);
        qrData += this.mcc.value();
        qrData += this.countryCode.value();
        qrData += this.merchantName.value(merchantName);
        qrData += this.merchantCity.value(merchantCity);
        qrData += this.timestamp.value();
        if (!isStatic && amount !== undefined) {
            qrData += this.amount.value(amount);
        }
        qrData += this.transactionCurrency.value(currency);
        qrData += this.additionalDataField.value(storeLabel, phoneNumber, billNumber, terminalLabel);
        qrData += this.crc.value(qrData);
        return qrData;
    }

    public generateMD5(qr: string): string {
        return this.hash.md5(qr);
    }
    
    public async generateDeeplink(qr: string, {
        callback = "https://bakong.nbc.org.kh",
        appIconUrl = "https://bakong.nbc.gov.kh/images/logo.svg",
        appName = "MyAppName"
    }: DeeplinkOptions = {}): Promise<string | null> {
        const payload = {
            qr,
            sourceInfo: { appIconUrl, appName, appDeepLinkCallback: callback },
        };
        try {
            const response = await this.apiClient.post<BakongDeeplinkResponse>("/generate_deeplink_by_qr", payload);
            return response.data?.responseCode === 0 ? response.data.data?.shortLink ?? null : null;
        } catch (error) {
            this.handleApiError(error);
        }
    }

    public async checkPayment(md5: string): Promise<PaymentStatus> {
        const payload = { md5 };
        try {
            const response = await this.apiClient.post<BakongTransactionResponse>("/check_transaction_by_md5", payload);
            return response.data?.responseCode === 0 ? "PAID" : "UNPAID";
        } catch (error) {
            this.handleApiError(error);
        }
    }

    public async getPayment(md5: string): Promise<Record<string, any> | null> {
        const payload = { md5 };
        try {
            const response = await this.apiClient.post<BakongTransactionResponse>("/check_transaction_by_md5", payload);
            return response.data?.responseCode === 0 ? response.data.data ?? null : null;
        } catch (error) {
            this.handleApiError(error);
        }
    }
    
    public async checkBulkPayments(md5List: string[]): Promise<string[]> {
        try {
            const response = await this.apiClient.post<BakongBulkResponse>("/check_transaction_by_md5_list", { md5List });
            return response.data?.data
                ?.filter(item => item.status === "SUCCESS")
                .map(item => item.md5) || [];
        } catch (error) {
            this.handleApiError(error);
        }
    }
}

export default KHQR;
