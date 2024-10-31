// src/services/okxService.ts
import axios from "axios";

interface OrdinalData {
    slug: string;
    floorPrice: string | number;
    inscriptionNumRange: string;
    totalVolume: string | number;
    volume24h: string | number;
    isBrc20: boolean;
}

interface OrdinalParams {
    slug?: string;
    limit?: string;
    isBrc20?: boolean;
}


interface InscriptionInfo {
    inscriptionId: string;
    nftId: string;
    amount: string;
    ticker?: string;
    tickerId?: string;
}

interface ApiResponse<T> {
    code: number;
    msg: string;
    data: T;
}

interface InscriptionData {
    cursor: string;
    inscriptionInfos: InscriptionInfo[];
}

interface InscriptionParams {
    slug: string;
    walletAddress: string;
    limit: string;
    isBrc20: boolean;
    cursor?: string;
    sort?: string;
}

interface TradeHistoryParams {
    slug: string;
    cursor?: string;
    limit?: string;
    sort?: "desc" | "asc";
    isBrc20?: boolean;
    orderSource?: number[];
    tradeWalletAddress?: string;
    type?: string;
}

interface TradeActivity {
    amount: string;
    fromAddress: string;
    inscriptionId: string;
    inscriptionNumber: string;
    isBrc20: boolean;
    price: string;
    slug: string;
    timestamp: number;
    toAddress: string;
    unitPrice: string;
    orderSource: number;
    orderSourceName: string;
    type: string;
}

interface TradeHistoryResponse {
    code: number;
    msg: string;
    data: {
        cursor: string;
        data: TradeActivity[];
    };
}

class OKXService {
    async getOrdinals(params: OrdinalParams = {}): Promise<ApiResponse<{ data: OrdinalData[] }>> {
        try {
            console.log("getOrdinals: Requesting with params:", params);
            const response = await axios.get("/api/ordinals", { params });
            console.log("getOrdinals Response:", response.data);
            return response.data;
        } catch (error) {
            console.error("getOrdinals Error:", error);
            throw error;
        }
    }


    async getInscriptions(
        params: InscriptionParams,
    ): Promise<ApiResponse<InscriptionData>> {
        try {
            console.log("getInscriptions: Requesting with params:", params);
            const response = await axios.post<ApiResponse<InscriptionData>>(
                "/api/inscriptions",
                params,
            );
            console.log("getInscriptions Response:", response.data);

            if (response.data.code !== 0) {
                throw new Error(response.data.msg || "API Error");
            }

            return response.data;
        } catch (error) {
            console.error("getInscriptions Error:", error);
            throw error;
        }
    }
    async getTradeHistory(
        params: TradeHistoryParams,
    ): Promise<TradeHistoryResponse> {
        try {
            console.log("Getting trade history with params:", params);
            const response = await axios.post("/api/trade-history", params);
            console.log("Trade history response:", response.data);
            return response.data;
        } catch (error) {
            console.error("Error fetching trade history:", error);
            throw error;
        }
    }
}

export const okxService = new OKXService();
export default okxService;
