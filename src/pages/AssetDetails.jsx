import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const AssetDetails = () => {
  const { id } = useParams();
  const [asset, setAsset] = useState(null);
  const [historicalData, setHistoricalData] = useState([]);

  useEffect(() => {
    const fetchAssetDetails = async () => {
      try {
        const [assetResponse, historyResponse] = await Promise.all([
          axios.get(`https://api.coincap.io/v2/assets/${id}`),
          axios.get(`https://api.coincap.io/v2/assets/${id}/history?interval=d1`)
        ]);
        setAsset(assetResponse.data.data);
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

  if (!asset) return <div className="container mx-auto px-4 py-8">Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-primary hacker-glow">{asset.name} ({asset.symbol})</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="bg-secondary text-primary">
          <CardHeader>
            <CardTitle>Asset Information</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Rank: {asset.rank}</p>
            <p>Price: ${parseFloat(asset.priceUsd).toFixed(2)}</p>
            <p>Market Cap: ${parseFloat(asset.marketCapUsd).toFixed(2)}</p>
            <p>24h Change: {parseFloat(asset.changePercent24Hr).toFixed(2)}%</p>
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
    </div>
  );
};

export default AssetDetails;
