import React, { createContext, useContext, useState } from 'react';

const FavCtx = createContext();
export const useFav = () => useContext(FavCtx);

export function FavoritesProvider({ children }) {
  const [ids, setIds] = useState([]);   // массив id луков

  const toggleFav = (id) =>
    setIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  const value = { ids, toggleFav, isFav: (id) => ids.includes(id), clearFav: () => setIds([]) };
  return <FavCtx.Provider value={value}>{children}</FavCtx.Provider>;
}
