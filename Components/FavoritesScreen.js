// src/screens/FavoritesScreen.js
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

import { useFav }    from '../Components/FavoritesContext';
import { mockLooks } from '../Components/mockLooks';

/* ─── Venetian palette ─── */
const VENETIAN_RED  = '#C80815';
const CANAL_TEAL    = '#007073';
const STONE_BISQUE  = '#E5C8A9';

const Tag = ({ text }) => (
  <View style={styles.tag}>
    <Text style={styles.tagTxt}>{text}</Text>
  </View>
);

export default function FavoritesScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { ids } = useFav();
  const data = mockLooks.filter(l => ids.includes(l.id));

  const Card = ({ item }) => (
    <View style={styles.card}>
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => navigation.navigate('OutfitDetail', { look: item })}
      >
        <Image source={item.cover} style={styles.img} />
      </TouchableOpacity>

      <Text style={styles.title}>{item.title}</Text>

      <View style={styles.tagsRow}>
        {item.tags.map(t => <Tag key={t} text={t} />)}
      </View>

      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => navigation.navigate('OutfitDetail', { look: item })}
      >
        <LinearGradient
          colors={[VENETIAN_RED, STONE_BISQUE]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.readBtn}
        >
          <Text style={styles.readTxt}>Read more</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.screen}>
      {/* Header */}
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

      {/* Content */}
      {data.length ? (
        <FlatList
          data={data}
          renderItem={Card}
          keyExtractor={i => i.id}
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

const CARD_BG = '#FFFFFF';

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: STONE_BISQUE,
  },

  /* Header */
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: CANAL_TEAL,
    paddingHorizontal: 18,
    marginBottom: 14,
  },
  backIcon: {
    width: 22,
    height: 22,
    tintColor: STONE_BISQUE,
    resizeMode: 'contain',
  },
  hTitle: {
    color: STONE_BISQUE,
    fontSize: 24,
    fontWeight: '700',
    marginLeft: 12,
  },

  /* Empty state */
  empty: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: STONE_BISQUE,
  },
  emptyTxt: {
    color: CANAL_TEAL,
    fontSize: 18,
  },

  /* Card */
  card: {
    backgroundColor: CARD_BG,
    marginHorizontal: 20,
    marginBottom: 26,
    borderRadius: 20,
    padding: 18,
  },
  img: {
    width: '100%',
    height: 260,
    borderRadius: 16,
    resizeMode: 'cover',
  },
  title: {
    color: VENETIAN_RED,
    fontSize: 18,
    fontWeight: '700',
    marginTop: 14,
  },

  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  tag: {
    borderWidth: 1,
    borderColor: CANAL_TEAL,
    borderRadius: 14,
    paddingVertical: 3,
    paddingHorizontal: 10,
    marginRight: 6,
    marginBottom: 6,
  },
  tagTxt: {
    color: CANAL_TEAL,
    fontSize: 12,
    fontWeight: '500',
  },

  readBtn: {
    height: 46,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 18,
  },
  readTxt: {
    color: STONE_BISQUE,
    fontSize: 16,
    fontWeight: '600',
  },
});
