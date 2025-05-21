/*  Глобальный контекст «Wishlist»  */
import 'react-native-get-random-values';
import { v4 as uuid } from 'uuid';
import React, { createContext, useContext, useState } from 'react';

const Ctx = createContext();

/* ---------------------------------------------------------------- provider */
export function WishlistProvider({ children }) {
  const [want,   setWant]   = useState([]);   // «I want to buy»
  const [bought, setBought] = useState([]);   // «Bought»

  /* добавить (toBought=true — сразу в “Bought”) */
  const addItem = (payload, toBought = false) => {
    const entry = { id: uuid(), moved: toBought, ...payload };
    toBought ? setBought(p => [entry, ...p])
             : setWant  (p => [entry, ...p]);
  };

  /* → Bought */
  const markAsBought = (id) => {
    const itm = want.find(x => x.id === id);
    if (!itm) return;
    setWant  (p => p.filter(i => i.id !== id));
    setBought(p => [{ ...itm, moved: true }, ...p]);
  };

  /* ← назад в Want */
  const markAsUnbought = (id) => {
    const itm = bought.find(x => x.id === id);
    if (!itm) return;
    setBought(p => p.filter(i => i.id !== id));
    setWant  (p => [{ ...itm, moved: false }, ...p]);
  };

  /* удалить */
  const removeItem = (id, fromBought = false) =>
    fromBought
      ? setBought(p => p.filter(i => i.id !== id))
      : setWant  (p => p.filter(i => i.id !== id));

  return (
    <Ctx.Provider value={{
      want, bought,
      addItem, markAsBought, markAsUnbought,
      removeItem,
    }}>
      {children}
    </Ctx.Provider>
  );
}

/* ---------------------------------------------------------------- хук */
export const useWishlist = () => useContext(Ctx);
