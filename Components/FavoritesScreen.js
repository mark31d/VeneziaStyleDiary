// ──────────────────────────────────────────────────────────────
//  src/screens/FavoritesScreen.js
//  Список избранных луков (Favorites)
// ──────────────────────────────────────────────────────────────
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';

import { useFav }     from '../Components/FavoritesContext';
import { mockLooks }  from '../Components/mockLooks';           // ← путь к вашему массиву

/* ─── отдельный тег-чип ─── */
const Tag = ({ text }) => (
  <View style={styles.tag}>
    <Text style={styles.tagTxt}>{text}</Text>
  </View>
);

export default function FavoritesScreen({ navigation }) {
  const insets  = useSafeAreaInsets();
  const { ids } = useFav();                     // id-шники добавленных в избранное
  const data    = mockLooks.filter((l) => ids.includes(l.id));

  /* ── единичная карточка ── */
  const Card = ({ item }) => (
    <View style={styles.card}>
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => navigation.navigate('OutfitDetail', { look: item })}
      >
        <Image source={item.cover} style={styles.img} />
      </TouchableOpacity>

      <Text style={styles.title}>{item.title}</Text>

      {/* теги */}
      <View style={styles.tagsRow}>
        {item.tags.map((t) => (
          <Tag key={t} text={t} />
        ))}
      </View>

      {/* кнопка Read more */}
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => navigation.navigate('OutfitDetail', { look: item })}
      >
        <LinearGradient
          colors={['#FFDF5F', '#FFB84C']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.readBtn}
        >
          <Text style={styles.readTxt}>Read more</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );

  /* ── MAIN UI ── */
  return (
    <View style={styles.screen}>
      {/* ─── Header (всегда показывается) ─── */}
      <View
        style={[
          styles.header,
          { paddingTop: insets.top + 6, height: 56 + insets.top },
        ]}
      >
        <TouchableOpacity
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          onPress={() => navigation.goBack()}
        >
          <Image
            source={require('../assets/arrowback.png')}
            style={styles.backIcon}
          />
        </TouchableOpacity>
        <Text style={styles.hTitle}>Favorites</Text>
      </View>

      {/* ── Контент: список или заглушка ── */}
      {data.length ? (
        <FlatList
          data={data}
          renderItem={Card}
          keyExtractor={(i) => i.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 32 }}
        />
      ) : (
        <View style={[styles.empty, { paddingTop: 60 }]}>
          <Text style={styles.emptyTxt}>No favorites yet</Text>
        </View>
      )}
    </View>
  );
}

/* ─── STYLES ─── */
const CARD_BG = '#141414';

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#0D0D0D' },

  /* header */
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#272727',
    paddingHorizontal: 18,
    marginBottom: 14,
  },
  backIcon: { width: 22, height: 22, tintColor: '#fff', resizeMode: 'contain' },
  hTitle:   { color: '#fff', fontSize: 24, fontWeight: '700', marginLeft: 12 },

  /* empty state */
  empty:    { flex: 1, alignItems: 'center', backgroundColor: '#0D0D0D' },
  emptyTxt: { color: '#777', fontSize: 18 },

  /* card */
  card: { backgroundColor: CARD_BG, marginHorizontal: 20, marginBottom: 26,
          borderRadius: 20, padding: 18 },
  img:  { width: '100%', height: 260, borderRadius: 16, resizeMode: 'cover' },
  title:{ color: '#fff', fontSize: 18, fontWeight: '700', marginTop: 14 },

  tagsRow:{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 8 },
  tag: { borderWidth: 1, borderColor: '#FFDF5F', borderRadius: 14,
         paddingVertical: 3, paddingHorizontal: 10,
         marginRight: 6, marginBottom: 6 },
  tagTxt:{ color: '#fff', fontSize: 12, fontWeight: '500' },

  readBtn:{ height: 46, borderRadius: 12, justifyContent: 'center',
            alignItems: 'center', marginTop: 18 },
  readTxt:{ color: '#1A1A1A', fontSize: 16, fontWeight: '600' },
});
