import { useState, useEffect } from 'react';

export const useFavorites = () => {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const storedFavorites = localStorage.getItem('favorites');
    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites));
    }
  }, []);

  const toggleFavorite = (assetId) => {
    setFavorites((prevFavorites) => {
      let newFavorites;
      if (prevFavorites.includes(assetId)) {
        newFavorites = prevFavorites.filter((id) => id !== assetId);
      } else {
        newFavorites = [...prevFavorites, assetId];
      }
      localStorage.setItem('favorites', JSON.stringify(newFavorites));
      return newFavorites;
    });
  };

  return { favorites, toggleFavorite };
};
