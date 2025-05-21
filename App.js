// App.js
import React, { useState, useEffect }   from 'react';
import { NavigationContainer }          from '@react-navigation/native';
import { createNativeStackNavigator }   from '@react-navigation/native-stack';
import { createBottomTabNavigator }     from '@react-navigation/bottom-tabs';

/* ───── контексты ───── */
import { WishlistProvider }   from './Components/WishlistContext';
import { ArticlesProvider }   from './Components/ArticlesContext';
import { GameProvider }       from './Components/GameContext';
import { FavoritesProvider }       from './Components/FavoritesContext';
/* ───── кастомный TabBar ───── */
import CustomTabBar           from './Components/CustomTabBar';

/* ───── экраны + Loader ───── */
import Loader                 from './Components/Loader';
import LooksOutfitsScreen     from './Components/LooksOutfitsScreen';
import WishlistScreen         from './Components/WishlistScreen';
import ArticlesScreen         from './Components/ArticlesScreen';
import GameScreen             from './Components/GameScreen';
import SettingsScreen         from './Components/SettingsScreen';
import OutfitDetailScreen     from './Components/OutfitDetailScreen';
import ArticleDetailScreen    from './Components/ArticleDetailScreen';
import FavoritesScreen from './Components/FavoritesScreen';
import WishlistAdd from './Components/WishlistAdd';
import WishlistDetail from './Components/WishlistDetail';
const Stack = createNativeStackNavigator();
const Tab   = createBottomTabNavigator();

/* ───── нижние вкладки ───── */
function BottomTabs() {
  return (
    <Tab.Navigator
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <CustomTabBar {...props} />}   // кастомный бар
    >
      <Tab.Screen
        name="Looks"
        component={LooksOutfitsScreen}
        options={{ title: 'Looks & Outfits' }}
      />
      <Tab.Screen
        name="Wishlist"
        component={WishlistScreen}
        options={{ title: 'Wishlist' }}
      />
      <Tab.Screen
        name="Articles"
        component={ArticlesScreen}
        options={{ title: 'Articles' }}
      />
      <Tab.Screen
        name="Quiz"
        component={GameScreen}
        options={{ title: 'Quiz' }}
      />
     
    </Tab.Navigator>
  );
}

export default function App() {
  const [bootDone, setBootDone] = useState(false);

  /* показываем Loader 2 секунды */
  useEffect(() => {
    const t = setTimeout(() => setBootDone(true), 2000);
    return () => clearTimeout(t);
  }, []);

  if (!bootDone) return <Loader />;

  return (
    <FavoritesProvider>
    <WishlistProvider>
      <ArticlesProvider>
        <GameProvider>
          <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
              {/* основной таб-навигатор */}
              <Stack.Screen name="MainTabs" component={BottomTabs} />
              <Stack.Screen name="SettingsScreen" component={SettingsScreen} />
              <Stack.Screen name="FavoritesScreen" component={FavoritesScreen} />
              <Stack.Screen name="WishlistAdd" component={WishlistAdd} />
              <Stack.Screen name="WishlistDetail" component={WishlistDetail} />
              {/* экраны деталей */}
              <Stack.Screen
                name="OutfitDetail"
                component={OutfitDetailScreen}
              
              />
              <Stack.Screen
                name="ArticleDetail"
                component={ArticleDetailScreen}
             
              />
            </Stack.Navigator>
          </NavigationContainer>
        </GameProvider>
      </ArticlesProvider>
    </WishlistProvider>
    </FavoritesProvider>
  );
}
