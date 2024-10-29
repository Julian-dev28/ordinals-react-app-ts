// src/components/TradeHistory.tsx
import { useState } from 'react';
import okxService from '../services/okxService';

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
    msg: any;
    code: number;
    data: {
        cursor: string;
        data: TradeActivity[];
    };
}

const TradeHistory: React.FC = () => {
    const [slug, setSlug] = useState('fractal-pepe-1');
    const [limit, setLimit] = useState('10');
    const [sort, setSort] = useState<'desc' | 'asc'>('desc');
    const [isBrc20, setIsBrc20] = useState(false);
    const [tradeWalletAddress, setTradeWalletAddress] = useState('');
    const [type, setType] = useState('SALE');
    const [result, setResult] = useState<TradeHistoryResponse | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const formatTimestamp = (timestamp: number) => {
        return new Date(timestamp * 1000).toLocaleString();
    };

    const formatAddress = (address: string) => {
        return `${address.slice(0, 6)}...${address.slice(-6)}`;
    };

    const fetchTradeHistory = async () => {
        if (!slug.trim()) {
            setError('Slug is required');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await okxService.getTradeHistory({
                slug,
                limit,
                sort,
                isBrc20,
                ...(tradeWalletAddress && { tradeWalletAddress }),
                ...(type && { type })
            });

            setResult(response);
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Error fetching trade history');
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container">
            <h2>Ordinals Trade History</h2>

            <div className="form-section">
                <div className="input-container">
                    <label>Collection Slug:</label>
                    <input
                        type="text"
                        value={slug}
                        onChange={(e) => setSlug(e.target.value)}
                        placeholder="Enter collection slug"
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
                    <label>Sort Order:</label>
                    <select value={sort} onChange={(e) => setSort(e.target.value as 'desc' | 'asc')} className="sort-select">
                        <option value="desc">Latest First</option>
                        <option value="asc">Oldest First</option>
                    </select>
                </div>

                <div className="input-container">
                    <label className="checkbox-label">
                        <input
                            type="checkbox"
                            checked={isBrc20}
                            onChange={(e) => setIsBrc20(e.target.checked)}
                        />
                        BRC-20
                    </label>
                </div>
                <div className="input-container">
                    <label>Wallet Address (Optional):</label>
                    <input
                        type="text"
                        value={tradeWalletAddress}
                        onChange={(e) => setTradeWalletAddress(e.target.value)}
                        placeholder="Enter wallet address"
                    />
                </div>

                <div className="input-container">
                    <label>Transaction Type:</label>
                    <select value={type} onChange={(e) => setType(e.target.value)} className="transaction-select">
                        <option value="SALE">Sale</option>
                        <option value="LIST">List</option>
                        <option value="TRANSFER">Transfer</option>
                        <option value="CANCEL_LIST">Cancel List</option>
                        <option value="UPDATE_PRICE">Update Price</option>
                    </select>
                </div>

                <button
                    onClick={fetchTradeHistory}
                    disabled={loading}
                    className={`fetch-button ${loading ? 'disabled' : ''}`}
                >
                    {loading ? 'Loading...' : 'Fetch Trade History'}
                </button>
            </div>

            {error && <div className="error-message">{error}</div>}

            {result && (
                <div className="results-section">
                    <div className="quote-details">
                        <h3>Response Status: {result.code === 0 ? 'Success' : 'Error'}</h3>
                        {result.msg && <p className="response-message">{result.msg}</p>}

                        {result.code === 0 && result.data?.data && (
                            <>
                                <div className="results-info">
                                    <p>Found {result.data.data.length} trade activities</p>
                                    {result.data.cursor && (
                                        <p>Next Page Cursor: {result.data.cursor}</p>
                                    )}
                                </div>

                                <div className="quote-compare-list">
                                    {result.data.data.map((activity, index) => (
                                        <div key={`${activity.inscriptionId}-${index}`} className="data-item">
                                            <div className="trade-header">
                                                <strong>Trade #{index + 1}</strong>
                                                <span className={`trade-type ${activity.type.toLowerCase()}`}>
                                                    {activity.type}
                                                </span>
                                            </div>
                                            <div className="trade-grid">
                                                <div className="trade-field">
                                                    <strong>Price:</strong>
                                                    <span>{activity.price} BTC</span>
                                                </div>
                                                <div className="trade-field">
                                                    <strong>Amount:</strong>
                                                    <span>{activity.amount}</span>
                                                </div>
                                                <div className="trade-field">
                                                    <strong>From:</strong>
                                                    <span title={activity.fromAddress}>
                                                        {formatAddress(activity.fromAddress)}
                                                    </span>
                                                </div>
                                                <div className="trade-field">
                                                    <strong>To:</strong>
                                                    <span title={activity.toAddress}>
                                                        {formatAddress(activity.toAddress)}
                                                    </span>
                                                </div>
                                                <div className="trade-field">
                                                    <strong>Time:</strong>
                                                    <span>{formatTimestamp(activity.timestamp)}</span>
                                                </div>
                                                <div className="trade-field">
                                                    <strong>Platform:</strong>
                                                    <span>{activity.orderSourceName}</span>
                                                </div>
                                                <div className="trade-field">
                                                    <strong>Unit Price:</strong>
                                                    <span>{activity.unitPrice} FB</span>
                                                </div>
                                                <div className="trade-field">
                                                    <strong>Inscription:</strong>
                                                    <span title={activity.inscriptionId}>
                                                        #{activity.inscriptionNumber}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="trade-footer">
                                                <span className={`brc20-badge ${activity.isBrc20 ? 'active' : ''}`}>
                                                    BRC-20
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {result.data.cursor && (
                                    <div className="pagination">
                                        <button
                                            onClick={() => {
                                                // Implement cursor pagination here
                                                console.log('Loading next page with cursor:', result.data.cursor);
                                            }}
                                            className="load-more-button"
                                        >
                                            Load More Trades
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

export default TradeHistory;