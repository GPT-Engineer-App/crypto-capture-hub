import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useFavorites } from '@/hooks/useFavorites';

const Favorites = () => {
  const [favoriteAssets, setFavoriteAssets] = useState([]);
  const { favorites } = useFavorites();

  useEffect(() => {
    const fetchFavoriteAssets = async () => {
      try {
        const promises = favorites.map(id => axios.get(`https://api.coincap.io/v2/assets/${id}`));
        const responses = await Promise.all(promises);
        const assets = responses.map(response => response.data.data);
        setFavoriteAssets(assets);
      } catch (error) {
        console.error('Error fetching favorite assets:', error);
      }
    };

    fetchFavoriteAssets();
  }, [favorites]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-primary hacker-glow">Favorite Assets</h1>
      {favoriteAssets.length === 0 ? (
        <p className="text-primary">You haven't added any favorites yet.</p>
      ) : (
        <Table className="w-full">
          <TableHeader>
            <TableRow className="bg-secondary">
              <TableHead className="text-primary">Rank</TableHead>
              <TableHead className="text-primary">Name</TableHead>
              <TableHead className="text-primary">Symbol</TableHead>
              <TableHead className="text-primary">Price (USD)</TableHead>
              <TableHead className="text-primary">24h Change</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {favoriteAssets.map((asset) => (
              <TableRow key={asset.id} className="hover:bg-secondary/50 transition-colors cursor-pointer">
                <Link to={`/asset/${asset.id}`} className="contents">
                  <TableCell className="font-medium">{asset.rank}</TableCell>
                  <TableCell>{asset.name}</TableCell>
                  <TableCell className="text-accent">{asset.symbol}</TableCell>
                  <TableCell>${parseFloat(asset.priceUsd).toFixed(2)}</TableCell>
                  <TableCell className={parseFloat(asset.changePercent24Hr) >= 0 ? 'text-green-400' : 'text-red-400'}>
                    {parseFloat(asset.changePercent24Hr).toFixed(2)}%
                  </TableCell>
                </Link>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default Favorites;
