// src/components/OrdinalsFetcher.tsx
import { useState } from "react";
import okxService from "../services/okxService";
import "../theme.css";

interface OrdinalData {
    slug: string;
    floorPrice: string | number;
    inscriptionNumRange: string;
    totalVolume: string | number;
    volume24h: string | number;
    isBrc20: boolean;
}

interface APIResponse {
    data: {
        data: OrdinalData[];
    };
}

// Helper function to format numbers
const formatNumber = (value: string | number) => {
    if (typeof value === "undefined" || value === null) return "N/A";

    const num = typeof value === "string" ? parseFloat(value) : value;
    if (isNaN(num)) return "N/A";

    // For numbers less than 1, show up to 8 decimal places
    if (Math.abs(num) < 1) {
        return num.toFixed(8);
    }

    // For larger numbers, use standard formatting with commas
    return num.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
};

export function OrdinalsFetcher() {
    const [ordinalsData, setOrdinalsData] = useState<APIResponse | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [slug, setSlug] = useState("");
    const [limit, setLimit] = useState("20"); // Add limit state
    const [isBrc20, setIsBrc20] = useState(false); // Add isBrc20 state

    const fetchOrdinals = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await okxService.getOrdinals({
                slug,
                limit,
                isBrc20,
            });

            if (response.data?.data?.length === 0) {
                setError("No ordinals found for this collection");
                setOrdinalsData(null);
            } else {
                setOrdinalsData(response);
            }
        } catch (err) {
            console.error("Error fetching ordinals:", err);
            setError("Failed to fetch ordinals data");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="page-container">
            <div className="explorer-container">
                <div className="explorer-header">
                    <h2>Bitcoin Ordinals Explorer</h2>

                    <div className="form-section">
                        <div className="input-container">
                            <label>Collection Slug:</label>
                            <input
                                type="text"
                                value={slug}
                                onChange={(e) => setSlug(e.target.value)}
                                placeholder="Enter collection slug"
                                onKeyPress={(e) =>
                                    e.key === "Enter" && fetchOrdinals()
                                }
                            />
                        </div>

                        <div className="input-container">
                            <label>Limit:</label>
                            <input
                                type="number"
                                value={limit}
                                onChange={(e) => setLimit(e.target.value)}
                                min="1"
                                max="100"
                                placeholder="10-100"
                            />
                        </div>

                        <div className="input-container">
                            <label className="checkbox-label">
                                <input
                                    type="checkbox"
                                    checked={isBrc20}
                                    onChange={(e) =>
                                        setIsBrc20(e.target.checked)
                                    }
                                />
                                BRC-20
                            </label>
                        </div>

                        <button
                            onClick={fetchOrdinals}
                            className="fetch-button"
                            disabled={isLoading}
                        >
                            {isLoading ? "Loading..." : "Fetch Ordinals"}
                        </button>
                    </div>
                </div>

                {error && <div className="error-message">{error}</div>}

                {isLoading && (
                    <div className="loading-message">
                        Loading ordinals data...
                    </div>
                )}

                <div className="results-section">
                    {!isLoading &&
                    ordinalsData?.data &&
                    Array.isArray(ordinalsData.data.data) ? (
                        <div className="quote-compare-list">
                            {ordinalsData.data.data.map((ordinal, index) => (
                                <div key={index} className="data-item">
                                    <div className="ordinal-grid">
                                        <div className="ordinal-field">
                                            <strong>Collection:</strong>
                                            <span>{ordinal.slug || "N/A"}</span>
                                        </div>
                                        <div className="ordinal-field">
                                            <strong>Floor Price:</strong>
                                            <span>
                                                {formatNumber(
                                                    ordinal.floorPrice,
                                                )}{" "}
                                                BTC
                                            </span>
                                        </div>
                                        <div className="ordinal-field">
                                            <strong>Inscription Range:</strong>
                                            <span>
                                                {ordinal.inscriptionNumRange ||
                                                    "N/A"}
                                            </span>
                                        </div>
                                        <div className="ordinal-field">
                                            <strong>Total Volume:</strong>
                                            <span>
                                                {formatNumber(
                                                    ordinal.totalVolume,
                                                )}{" "}
                                                BTC
                                            </span>
                                        </div>
                                        <div className="ordinal-field">
                                            <strong>24h Volume:</strong>
                                            <span>
                                                {formatNumber(
                                                    ordinal.volume24h,
                                                )}{" "}
                                                BTC
                                            </span>
                                        </div>
                                        <div className="ordinal-field">
                                            <strong>BRC-20:</strong>
                                            <span
                                                className={
                                                    ordinal.isBrc20
                                                        ? "positive"
                                                        : "negative"
                                                }
                                            >
                                                {ordinal.isBrc20 ? "Yes" : "No"}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : !isLoading && !error ? (
                        <div className="empty-state">
                            Enter a collection slug to view ordinals data or
                            click "Fetch Ordinals"
                        </div>
                    ) : null}
                </div>
            </div>
        </div>
    );
}

export default OrdinalsFetcher;
