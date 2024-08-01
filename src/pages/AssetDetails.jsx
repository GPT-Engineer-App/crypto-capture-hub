import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import DOMPurify from 'dompurify';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { useFavorites } from '@/hooks/useFavorites';

const AssetDetails = () => {
  const { id } = useParams();
  const [asset, setAsset] = useState(null);
  const [historicalData, setHistoricalData] = useState([]);
  const { favorites, toggleFavorite } = useFavorites();

  useEffect(() => {
    const fetchAssetDetails = async () => {
      try {
        const [assetResponse, historyResponse, metadataResponse] = await Promise.all([
          axios.get(`https://api.coincap.io/v2/assets/${id}`),
          axios.get(`https://api.coincap.io/v2/assets/${id}/history?interval=d1`),
          axios.get(`https://api.coingecko.com/api/v3/coins/${id}?localization=false&tickers=false&market_data=false&community_data=false&developer_data=false&sparkline=false`)
        ]);
        const assetData = assetResponse.data.data;
        const metadataData = metadataResponse.data;
        setAsset({
          ...assetData,
          description: metadataData.description?.en || 'No description available.'
        });
        setHistoricalData(historyResponse.data.data.map(item => ({
          date: new Date(item.time).toLocaleDateString(),
          price: parseFloat(item.priceUsd)
        })));
      } catch (error) {
        console.error('Error fetching asset details:', error);
      }
    };

    fetchAssetDetails();
  }, [id]);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAssetDetails = async () => {
      setIsLoading(true);
      try {
        // ... (keep the existing fetch logic)
      } catch (error) {
        console.error('Error fetching asset details:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAssetDetails();
  }, [id]);

  if (isLoading) return <div className="container mx-auto px-4 py-8 text-primary">Loading asset details...</div>;
  if (!asset) return <div className="container mx-auto px-4 py-8 text-primary">Asset not found</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-primary hacker-glow">{asset.name} ({asset.symbol})</h1>
        <Button
          variant="outline"
          size="icon"
          onClick={() => toggleFavorite(asset.id)}
          className="hacker-border"
        >
          <Star
            className={`h-6 w-6 ${
              favorites.includes(asset.id) ? 'fill-yellow-500 text-yellow-500' : 'text-primary'
            }`}
          />
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <Card className="bg-secondary text-primary">
          <CardHeader>
            <CardTitle>Asset Information</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Rank: {asset.rank}</p>
            <p>Price: ${parseFloat(asset.priceUsd).toFixed(2)}</p>
            <p>Market Cap: ${(parseFloat(asset.marketCapUsd) / 1e9).toFixed(2)} billion</p>
            <p>24h Change: {parseFloat(asset.changePercent24Hr).toFixed(2)}%</p>
            <p>24h Volume: ${(parseFloat(asset.volumeUsd24Hr) / 1e6).toFixed(2)} million</p>
            <p>Supply: {(parseFloat(asset.supply) / 1e6).toFixed(2)} million {asset.symbol}</p>
            <p>Max Supply: {asset.maxSupply ? `${(parseFloat(asset.maxSupply) / 1e6).toFixed(2)} million ${asset.symbol}` : 'Unlimited'}</p>
          </CardContent>
        </Card>
        <Card className="bg-secondary text-primary">
          <CardHeader>
            <CardTitle>Price History</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={historicalData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="price" stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
      <Card className="bg-secondary text-primary">
        <CardHeader>
          <CardTitle>Asset Description</CardTitle>
        </CardHeader>
        <CardContent>
          {asset.description ? (
            <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(asset.description) }} />
          ) : (
            <p>No description available.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AssetDetails;
