// src/Components/ArticlesContext.js
import React, { createContext, useContext, useState } from 'react';

const ArticlesContext = createContext();
export const useArticles = () => useContext(ArticlesContext);

export function ArticlesProvider({ children }) {
  const [articles, setArticles] = useState([
    /* 1. Seasonal Fashion Trends */
    {
      id: '1',
      title: 'Seasonal Fashion Trends',
      cover: require('../assets/trends.png'),
      content: `
Fashion trends evolve each season, influenced by designers, street style, and cultural shifts.

Here are the key trends for this year:

• Spring / Summer 
  – Soft Pastels – lavender, mint, baby-blue  
  – Linen Everything – lightweight, breathable fabrics  
  – Statement Accessories – oversized sunglasses, chunky chains, mini bags  
  – Sheer Layers – flowing translucent fabrics  
  – Bold Florals – vibrant prints inspired by blooming gardens  

• Fall / Winter 
  – Chunky Knits – cozy, oversized sweaters  
  – Leather Revival – coats, pants & boots in leather  
  – Deep Jewel Tones – emerald, sapphire, ruby  
  – Structured Blazers – sharp tailoring, power dressing  
  – Tall Boots – knee-high & over-the-knee
      `.trim(),
    },

    /* 2. Capsule Wardrobe */
    {
      id: '2',
      title: 'How to Build a Capsule Wardrobe',
      cover: require('../assets/capsule.png'),
      content: `
A capsule wardrobe is a collection of versatile, timeless pieces that mix and match effortlessly.

Step 1 — Choose a Neutral Palette  
Stick to black, white, beige, navy and gray.

Step 2 — Invest in Essentials  
• Tops: white shirt, turtleneck, striped tee  
• Bottoms: fitted jeans, tailored trousers, A-line skirt  
• Outerwear: blazer, trench coat, wool coat  
• Shoes: white sneakers, ankle boots, classic pumps

Step 3 — Add a Few Statement Pieces  
Seasonal trends & pops of color keep the wardrobe fresh.

Step 4 — Keep It Minimal  
Quality over quantity – buy durable fabrics and perfect fits.
      `.trim(),
    },

    /* 3. Dressing for Your Body Shape */
    {
      id: '3',
      title: 'Dressing for Your Body Shape',
      cover: require('../assets/bodyshape.png'),
      content: `
Understanding your body type helps you enhance your best features and dress with confidence.

Hourglass (X)  
🔹 Balanced shoulders & hips, defined waist  
✅ Wrap dresses, belted coats, fitted tops  
🚫 Oversized silhouettes hiding the waist

Pear (A)  
🔹 Narrow shoulders, wider hips  
✅ A-line skirts, off-shoulder tops, structured blazers  
🚫 Skinny jeans without balancing the upper body

Apple (O)  
🔹 Full mid-section, slimmer legs  
✅ Empire-waist dresses, flowy tops, straight-leg pants  
🚫 Tight tops that emphasize the mid-section

Rectangle (H)  
🔹 Balanced shoulders, waist & hips  
✅ Peplum tops, high-waisted pants, layering  
🚫 Boxy shapes that don’t define the waist

Inverted Triangle (V)  
🔹 Broad shoulders, narrow hips  
✅ Flared pants/skirts, V-necks  
🚫 Padded shoulders, wide-neck tops
      `.trim(),
    },

    /* 4. Color Combinations & Capsule Wardrobes */
    {
      id: '4',
      title: 'Color Combinations & Capsule Wardrobes',
      cover: require('../assets/colors.png'),
      content: `
Color coordination plays a crucial role in building a functional and stylish wardrobe.

Basic Color Pairings  
• Monochrome – different shades of one hue (e.g. all beige)  
• Complementary – opposites on the color wheel (blue & orange)  
• Analogous – neighbours on the wheel (blue & green)

Capsule Wardrobe Color Strategy  
• Base Colors: black, white, gray, navy – versatile & timeless  
• Accent Colors: burgundy, emerald, mustard – add personality  
• Seasonal Colors: pastels for spring, deep tones for winter
      `.trim(),
    },
  ]);

  // Adds a new article to the top of the list
  const addArticle = (article) => {
    setArticles(prev => [article, ...prev]);
  };

  return (
    <ArticlesContext.Provider value={{ articles, addArticle }}>
      {children}
    </ArticlesContext.Provider>
  );
}
