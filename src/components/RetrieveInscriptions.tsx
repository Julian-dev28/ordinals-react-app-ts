// src/components/RetrieveInscriptions.tsx
import React, { useState, useCallback } from "react";
import okxService from "../services/okxService";
import "../theme.css";

interface InscriptionInfo {
    inscriptionId: string;
    nftId: string;
    amount: string;
    ticker?: string;
    tickerId?: string;
}

interface ApiResponse {
    code: number;
    msg: string;
    data: {
        cursor: string;
        inscriptionInfos: InscriptionInfo[];
    };
}

const RetrieveInscriptions: React.FC = () => {
    const [slug, setSlug] = useState("fractal-pepe-1");
    const [walletAddress, setWalletAddress] = useState(
        "bc1p8gqcyljmuqa5rqaqyfdxv37ta47nzr2n2cr8sypmtvv0ylppn55sj3euxe",
    );
    const [limit, setLimit] = useState("20");
    const [isBrc20, setIsBrc20] = useState(false);
    const [cursor, setCursor] = useState("");
    const [sort, setSort] = useState("");
    const [result, setResult] = useState<ApiResponse | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const validateInputs = useCallback((): boolean => {
        if (!slug.trim()) {
            setError("Slug is required");
            return false;
        }

        if (!walletAddress.trim()) {
            setError("Wallet address is required");
            return false;
        }

        const limitNum = parseInt(limit);
        if (isNaN(limitNum) || limitNum < 1 || limitNum > 100) {
            setError("Limit must be between 1 and 100");
            return false;
        }

        return true;
    }, [slug, walletAddress, limit]);

    const fetchValidInscriptions = async () => {
        if (!validateInputs()) return;

        setLoading(true);
        setError(null);

        try {
            const response = await okxService.getInscriptions({
                slug,
                walletAddress,
                limit,
                isBrc20,
                ...(cursor && { cursor }),
                ...(sort && { sort }),
            });

            console.log("Response received:", response);
            setResult(response);
        } catch (error) {
            console.error("Error details:", error);
            setError(
                error instanceof Error
                    ? error.message
                    : "Error fetching inscriptions data",
            );
        } finally {
            setLoading(false);
        }
    };

    const handleNextPage = useCallback(() => {
        if (result?.data?.cursor) {
            setCursor(result.data.cursor);
            fetchValidInscriptions();
        }
    }, [result]);

    return (
        <div className="container">
            <h2>Retrieve Valid Inscriptions</h2>

            <div className="form-section">
                <div className="input-container">
                    <label>Slug: </label>
                    <input
                        type="text"
                        value={slug}
                        onChange={(e) => setSlug(e.target.value)}
                        placeholder="Enter collection slug"
                        required
                    />
                </div>

                <div className="input-container">
                    <label>Wallet Address: </label>
                    <input
                        type="text"
                        value={walletAddress}
                        onChange={(e) => setWalletAddress(e.target.value)}
                        placeholder="Enter Bitcoin wallet address"
                        required
                    />
                </div>

                <div className="input-container">
                    <label>Limit: </label>
                    <input
                        type="number"
                        value={limit}
                        onChange={(e) => setLimit(e.target.value)}
                        min="1"
                        max="100"
                        placeholder="Enter limit (1-100)"
                        required
                    />
                </div>

                <div className="input-container">
                    <label className="checkbox-label">
                        <input
                            type="checkbox"
                            checked={isBrc20}
                            onChange={(e) => setIsBrc20(e.target.checked)}
                        />
                        Is BRC20
                    </label>
                </div>

                <div className="input-container">
                    <label>Sort (optional): </label>
                    <select
                        value={sort}
                        onChange={(e) => setSort(e.target.value)}
                        className="sort-select"
                    >
                        <option value="">Select sorting</option>
                        <option value="listing_time_desc">
                            Listing Time (Descending)
                        </option>
                        <option value="listing_time_asc">
                            Listing Time (Ascending)
                        </option>
                        <option value="price_desc">Price (Descending)</option>
                        <option value="price_asc">Price (Ascending)</option>
                        <option value="unitprice_desc">
                            Unit Price (Descending)
                        </option>
                        <option value="unitprice_asc">
                            Unit Price (Ascending)
                        </option>
                    </select>
                </div>

                <div className="button-container">
                    <button
                        onClick={fetchValidInscriptions}
                        disabled={loading}
                        className={`fetch-button ${loading ? "disabled" : ""}`}
                    >
                        {loading ? "Loading..." : "Retrieve Inscriptions"}
                    </button>
                </div>
            </div>

            {error && <div className="error-message">{error}</div>}

            {loading && (
                <div className="loading-message">
                    Fetching inscriptions data...
                </div>
            )}

            {result && (
                <div className="results-section">
                    <div className="quote-details">
                        <h3>
                            Response Status:{" "}
                            {result.code === 0 ? "Success" : "Error"}
                        </h3>
                        {result.msg && (
                            <p className="response-message">{result.msg}</p>
                        )}

                        {result.code === 0 && result.data?.inscriptionInfos && (
                            <>
                                <div className="results-info">
                                    <p>
                                        Found{" "}
                                        {result.data.inscriptionInfos.length}{" "}
                                        inscriptions
                                    </p>
                                    {result.data.cursor && (
                                        <p>
                                            Next Page Cursor:{" "}
                                            {result.data.cursor}
                                        </p>
                                    )}
                                </div>

                                <div className="quote-compare-list">
                                    {result.data.inscriptionInfos.map(
                                        (info, index) => (
                                            <div
                                                key={`${info.inscriptionId}-${index}`}
                                                className="data-item"
                                            >
                                                <div className="inscription-header">
                                                    <strong>
                                                        Inscription #{index + 1}
                                                    </strong>
                                                </div>
                                                <div className="inscription-details">
                                                    <div>
                                                        <strong>ID:</strong>{" "}
                                                        {info.inscriptionId}
                                                    </div>
                                                    <div>
                                                        <strong>NFT ID:</strong>{" "}
                                                        {info.nftId}
                                                    </div>
                                                    <div>
                                                        <strong>Amount:</strong>{" "}
                                                        {info.amount}
                                                    </div>
                                                    {info.ticker && (
                                                        <div>
                                                            <strong>
                                                                Ticker:
                                                            </strong>{" "}
                                                            {info.ticker}
                                                        </div>
                                                    )}
                                                    {info.tickerId && (
                                                        <div>
                                                            <strong>
                                                                Ticker ID:
                                                            </strong>{" "}
                                                            {info.tickerId}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ),
                                    )}
                                </div>

                                {result.data.cursor && (
                                    <div className="pagination">
                                        <button
                                            onClick={handleNextPage}
                                            className="load-more-button"
                                        >
                                            Load More Inscriptions
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default RetrieveInscriptions;
