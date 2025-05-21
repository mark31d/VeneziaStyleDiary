// ──────────────────────────────────────────────────────────────
//  src/screens/ArticleDetailScreen.js
//  Экран «Info» для статьи
// ──────────────────────────────────────────────────────────────
import React from 'react';
import {
  View, Text, StyleSheet, Image,
  ScrollView, TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ArticleDetailScreen({ route, navigation }) {
  const { article } = route.params;
  const insets      = useSafeAreaInsets();

  return (
    <View style={s.screen}>
      {/* ─── HEADER ─── */}
      <View
        style={[
          s.header,
          { paddingTop: insets.top + 6, height: 56 + insets.top },
        ]}
      >
        <TouchableOpacity onPress={navigation.goBack}>
          <Image
            source={require('../assets/arrowback.png')}
            style={s.backIcon}
          />
        </TouchableOpacity>
        <Text style={s.hTitle}>Info</Text>
      </View>

      {/* ─── CONTENT ─── */}
      <ScrollView showsVerticalScrollIndicator={false}>
        {article.cover && (
          <Image source={article.cover} style={s.image} />
        )}

        <Text style={s.title}>{article.title}</Text>
        <Text style={s.content}>{article.content}</Text>
      </ScrollView>
    </View>
  );
}

/* ─────────── STYLES ─────────── */
const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#0D0D0D' },

  /* header */
  header: { flexDirection: 'row', alignItems: 'center',
            backgroundColor: '#272727', paddingHorizontal: 20 },
  backIcon:{ width: 22, height: 22, tintColor: '#fff', resizeMode: 'contain' },
  hTitle:  { marginLeft: 12, color: '#fff', fontSize: 26, fontWeight: '700' },

  /* cover image */
  image: { width: '90%', height: 260, alignSelf: 'center',
           borderRadius: 20, marginTop: 16, resizeMode: 'cover' },

  /* text blocks */
  title:   { color: '#fff', fontSize: 24, fontWeight: '700',
             marginHorizontal: 22, marginTop: 18, lineHeight: 30 },
  content: { color: '#E0E0E0', fontSize: 15,
             marginHorizontal: 22, marginTop: 12, lineHeight: 22 },
});
