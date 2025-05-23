// src/screens/ArticleDetailScreen.js
import React from 'react';
import {
  View, Text, StyleSheet, Image,
  ScrollView, TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

/* ─── Venetian palette ─── */
const VENETIAN_RED = '#C80815';
const CANAL_TEAL   = '#007073';
const STONE_BISQUE = '#E5C8A9';

export default function ArticleDetailScreen({ route, navigation }) {
  const { article } = route.params;
  const insets      = useSafeAreaInsets();

  return (
    <View style={styles.screen}>
      {/* HEADER */}
      <View
        style={[
          styles.header,
          { paddingTop: insets.top + 6, height: 56 + insets.top },
        ]}
      >
        <TouchableOpacity onPress={navigation.goBack}>
          <Image
            source={require('../assets/arrowback.png')}
            style={styles.backIcon}
          />
        </TouchableOpacity>
        <Text style={styles.hTitle}>Info</Text>
      </View>

      {/* CONTENT */}
      <ScrollView showsVerticalScrollIndicator={false}>
        {article.cover && (
          <Image source={article.cover} style={styles.image} />
        )}

        <Text style={styles.title}>{article.title}</Text>
        <Text style={styles.content}>{article.content}</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: STONE_BISQUE,
  },
  /* header */
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: CANAL_TEAL,
    paddingHorizontal: 20,
  },
  backIcon: {
    width: 22,
    height: 22,
    tintColor: STONE_BISQUE,
    resizeMode: 'contain',
  },
  hTitle: {
    marginLeft: 12,
    color: STONE_BISQUE,
    fontSize: 26,
    fontWeight: '700',
  },

  /* cover image */
  image: {
    width: '90%',
    height: 260,
    alignSelf: 'center',
    borderRadius: 20,
    marginTop: 16,
    resizeMode: 'cover',
  },

  /* text blocks */
  title: {
    color: VENETIAN_RED,
    fontSize: 24,
    fontWeight: '700',
    marginHorizontal: 22,
    marginTop: 18,
    lineHeight: 30,
  },
  content: {
    color: CANAL_TEAL,
    fontSize: 15,
    marginHorizontal: 22,
    marginTop: 12,
    lineHeight: 22,
  },
});
