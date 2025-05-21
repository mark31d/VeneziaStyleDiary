// ──────────────────────────────────────────────────────────────
//  src/screens/ArticlesScreen.js
//  «Useful articles» – список статей с картинкой и кнопкой
//  + серая шапка (header) в корпоративном стиле
// ──────────────────────────────────────────────────────────────
import React from 'react';
import {
  View, Text, StyleSheet, FlatList,
  Image, TouchableOpacity, Dimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useArticles } from '../Components/ArticlesContext';   // свой путь

/* ——— константы размера ——— */
const CARD_H    = 150;
const IMAGE_W   = 130;
const RADIUS    = 22;
const SCR_W     = Dimensions.get('window').width;
const BTN_W     = SCR_W - IMAGE_W - 90;    // ширина кнопки «Read more»

export default function ArticlesScreen({ navigation }) {
  const insets         = useSafeAreaInsets();
  const { articles }   = useArticles();

  /* ——— карточка статьи ——— */
  const Card = ({ item }) => (
    <View style={s.card}>
      <Image source={item.cover} style={s.cover} />

      <View style={s.cardContent}>
        <Text numberOfLines={3} style={s.title}>{item.title}</Text>

        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() =>
            navigation.navigate('ArticleDetail', { article: item })
          }
        >
          <LinearGradient
            colors={['#FFDF5F', '#FFB84C']}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
            style={s.btn}
          >
            <Text style={s.btnTxt}>Read more</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );

  /* ——— UI ——— */
  return (
    <View style={s.screen}>
      {/* ── HEADER ── */}
      <View
        style={[
          s.header,
          { paddingTop: insets.top + 6, height: 56 + insets.top },
        ]}
      >
        <Text style={s.hTitle}>Useful articles</Text>
      </View>

      {/* ── LIST ── */}
      <FlatList
        data={articles}
        keyExtractor={(a) => a.id}
        renderItem={Card}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingVertical: 20 }}
      />
    </View>
  );
}

/* ——— STYLES ——— */
const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#0D0D0D' },

  /* header */
  header: { flexDirection: 'row', alignItems: 'center',
            backgroundColor: '#272727', paddingHorizontal: 22 },
  hTitle: { color: '#fff', fontSize: 26, fontWeight: '700' },

  /* card */
  card: { flexDirection: 'row', alignItems: 'center',
          backgroundColor: '#1A1A1A', borderRadius: RADIUS,
          padding: 14, marginHorizontal: 20, marginBottom: 22 },

  cover:{ width: IMAGE_W, height: CARD_H - 28, resizeMode: 'cover',
          borderRadius: RADIUS - 4, marginRight: 14 },

  cardContent:{ flex: 1, justifyContent: 'space-between', height: CARD_H - 28 },

  title:{ color: '#fff', fontSize: 18, fontWeight: '700', lineHeight: 22 },

  btn:{ height: 38, width: BTN_W, borderRadius: 19,
        justifyContent: 'center', alignItems: 'center', marginTop: 10 },

  btnTxt:{ color: '#1A1A1A', fontSize: 15, fontWeight: '600' },
});
