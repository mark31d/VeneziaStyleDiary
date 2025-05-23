// src/Components/LooksOutfitsScreen.js
import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Animated,
  PanResponder,
  Dimensions,
  Share,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';

/* ─── Venetian palette ─── */
const VENETIAN_RED = '#C80815';
const CANAL_TEAL   = '#007073';
const STONE_BISQUE = '#E5C8A9';
const dark = "#333";
const white = "#FFFFFF";


const mockLooks = [
    {
      id: 'look_spring_dawn',
      title: 'Spring Dawn',
      cover: require('../assets/cover.png'),
      season: 'Spring',
      styles: ['Classic', 'Romantic'],
      bodyTypes: ['Hourglass'],
      tags: ['Spring', 'Classic', 'Hourglass', 'Romantic'],
      gallery: [
        require('../assets/top.png'),
        require('../assets/jeans.png'),
        require('../assets/shoes.png'),
      ],
    },
    {
      id: 'look_winter_grunge',
      title: 'Winter grunge style',
      cover: require('../assets/cover2.png'),
      season: 'Winter',
      styles: ['Athleisure', 'Grunge'],
      bodyTypes: ['Pear'],
      tags: ['Winter', 'Athleisure', 'Grunge', 'Pear'],
      gallery: [
        require('../assets/jacket.png'),
        require('../assets/jeans2.png'),
        require('../assets/boots.png'),
      ],
    },
    {
      id: 'look_autumn_cozy',
      title: 'Autumn coziness',
      cover: require('../assets/cover3.png'),
      season: 'Fall',
      styles: ['Classic'],
      bodyTypes: ['Rectangle'],
      tags: ['Fall', 'Classic', 'Rectangle'],
      gallery: [
        require('../assets/blazer.png'),
        require('../assets/pants.png'),
        require('../assets/shoes1.png'),
      ],
    },
    {
      id: 'look_minimalism_action',
      title: 'Minimalism in action',
      cover: require('../assets/cover4.png'),
      season: 'Summer',
      styles: ['Boho'],
      bodyTypes: ['Apple'],
      tags: ['Summer', 'Boho', 'Apple'],
      gallery: [
        require('../assets/dress.png'),
        require('../assets/hat.png'),
        require('../assets/sandals.png'),
      ],
    },
  ];
/* ─── Constants ─── */
const { height: SCREEN_H } = Dimensions.get('window');
const BS_HEIGHT = SCREEN_H * 0.8;
const BS_OPEN   = 0;
const BS_CLOSE  = BS_HEIGHT;

/* ─── CHIP ─── */
const Chip = ({ label, selected, onPress }) => (
  <TouchableOpacity activeOpacity={0.8} onPress={onPress}>
    <View style={[chip.base, selected && chip.sel]}>
      <Text style={[chip.txt, selected && chip.txtSel]}>{label}</Text>
    </View>
  </TouchableOpacity>
);

export default function LooksOutfitsScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [looks, setLooks]       = useState(mockLooks);
  const [season, setSeason]     = useState(null);
  const [styleFilter, setStyle] = useState(null);
  const [bodyType, setBody]     = useState(null);

  const translateY = useRef(new Animated.Value(BS_CLOSE)).current;
  const pan = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dy) > 10,
      onPanResponderMove: (_, g) => {
        const newY = Math.min(
          Math.max(BS_OPEN, translateY.__getValue() + g.dy),
          BS_CLOSE
        );
        translateY.setValue(newY);
      },
      onPanResponderRelease: (_, g) => {
        const open = g.vy < 0 || translateY.__getValue() < BS_CLOSE / 2;
        Animated.spring(translateY, {
          toValue: open ? BS_OPEN : BS_CLOSE,
          useNativeDriver: true,
        }).start();
      },
    })
  ).current;

  const applyFilters = () => {
    const filtered = mockLooks.filter(
      l =>
        (!season      || l.season === season) &&
        (!styleFilter || l.styles.includes(styleFilter)) &&
        (!bodyType    || l.bodyTypes.includes(bodyType))
    );
    setLooks(filtered);
    Animated.spring(translateY, { toValue: BS_CLOSE, useNativeDriver: true }).start();
  };

  const onShare = async look => {
    try {
      await Share.share({ message: `Check out this look: "${look.title}"!` });
    } catch (err) {
      console.warn(err);
    }
  };

  const renderCard = ({ item }) => (
    <View style={styles.card}>
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => navigation.navigate('OutfitDetail', { look: item })}
      >
        <Image source={item.cover} style={styles.image} />
      </TouchableOpacity>

      <Text style={styles.title}>{item.title}</Text>
      <View style={styles.tagsWrap}>
        {item.tags.map(t => (
          <Chip key={t} label={t} selected={false} onPress={() => {}} />
        ))}
      </View>

      {/* Read more */}
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => navigation.navigate('OutfitDetail', { look: item })}
      >
        <LinearGradient
          colors={[VENETIAN_RED, STONE_BISQUE]}
          start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
          style={styles.readBtn}
        >
          <Text style={styles.readTxt}>Read more</Text>
        </LinearGradient>
      </TouchableOpacity>

      {/* Share */}
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => onShare(item)}
        style={{ marginTop: 12 }}
      >
        <LinearGradient
          colors={[VENETIAN_RED, STONE_BISQUE]}
          start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
          style={styles.readBtn}
        >
          <Image source={require('../assets/share.png')} style={styles.shareIcon} />
          <Text style={styles.readTxt}>Share</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.screen}>
      {/* HEADER */}
      <View
        style={[
          styles.header,
          { paddingTop: insets.top + 6, height: 56 + insets.top },
        ]}
      >
        <Text style={styles.hTitle}>Looks & Outfits</Text>
        <TouchableOpacity onPress={() => navigation.navigate('SettingsScreen')}>
          <Image source={require('../assets/gear.png')} style={styles.hIcon} />
        </TouchableOpacity>
      </View>

      {/* LIST */}
      <FlatList
        data={looks}
        renderItem={renderCard}
        keyExtractor={i => i.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: BS_HEIGHT - 500 }}
      />

      {/* FABs */}
      <View style={[styles.fabCol, { bottom: 24 + insets.bottom }]}>
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => navigation.navigate('Wishlist')}
        >
          <LinearGradient
            colors={[VENETIAN_RED, STONE_BISQUE]}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
            style={styles.fab}
          >
            <Image source={require('../assets/plus.png')} style={styles.fabIcon1} />
          </LinearGradient>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.fab, { backgroundColor: CANAL_TEAL }]}
          activeOpacity={0.85}
          onPress={() =>
            Animated.spring(translateY, { toValue: BS_OPEN, useNativeDriver: true }).start()
          }
        >
          <Image source={require('../assets/filters.png')} style={styles.fabIcon3} />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.fab, { backgroundColor: VENETIAN_RED }]}
          activeOpacity={0.85}
          onPress={() => navigation.navigate('FavoritesScreen')}
        >
          <Image source={require('../assets/heart1.png')} style={styles.fabIcon} />
        </TouchableOpacity>
      </View>

      {/* BOTTOM-SHEET */}
      <Animated.View
        style={[styles.sheet, { transform: [{ translateY }] }]}
        {...pan.panHandlers}
      >
        <View style={styles.handle} />
        <Text style={styles.sheetTitle}>Filters</Text>

        <Text style={styles.catTitle}>Fashion seasons</Text>
        <View style={styles.row}>
          {['Spring','Summer','Fall','Winter'].map(s => (
            <Chip
              key={s}
              label={s}
              selected={season === s}
              onPress={() => setSeason(season === s ? null : s)}
            />
          ))}
        </View>

        <Text style={styles.catTitle}>Clothing styles</Text>
        <View style={styles.row}>
          {['Classic','Athleisure','Boho','Grunge','Romantic'].map(s => (
            <Chip
              key={s}
              label={s}
              selected={styleFilter === s}
              onPress={() => setStyle(styleFilter === s ? null : s)}
            />
          ))}
        </View>

        <Text style={styles.catTitle}>Body types</Text>
        <View style={styles.row}>
          {['Hourglass','Pear','Apple','Rectangle'].map(s => (
            <Chip
              key={s}
              label={s}
              selected={bodyType === s}
              onPress={() => setBody(bodyType === s ? null : s)}
            />
          ))}
        </View>

        <TouchableOpacity activeOpacity={0.9} onPress={applyFilters}>
          <LinearGradient
            colors={[VENETIAN_RED, white]}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
            style={styles.applyBtn}
          >
            <Text style={styles.applyTxt}>Apply</Text>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const chip = StyleSheet.create({
  base:   {
    borderRadius: 22,
    paddingVertical: 6,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: CANAL_TEAL,
    marginRight: 10,
    marginBottom: 10,
  },
  sel:    { backgroundColor: CANAL_TEAL, borderColor: CANAL_TEAL },
  txt:    { color: VENETIAN_RED, fontSize: 14 },
  txtSel: { color: STONE_BISQUE, fontWeight: '600', fontSize: 14 },
});

const styles = StyleSheet.create({
  screen:   { flex: 1, backgroundColor: STONE_BISQUE },
  header:   { flexDirection: 'row', alignItems: 'center', backgroundColor: CANAL_TEAL, paddingHorizontal: 22 },
  hTitle:   { flex: 1, color: STONE_BISQUE, fontSize: 26, fontWeight: '700' },
  hIcon:    { width: 26, height: 26, tintColor: STONE_BISQUE },

  card:     { backgroundColor: '#FFFFFF', marginHorizontal: 20, marginTop: 20, borderRadius: 20, padding: 18 },
  image:    { width: '100%', height: 260, borderRadius: 16, resizeMode: 'cover' },
  title:    { color: VENETIAN_RED, fontSize: 18, fontWeight: '600', marginTop: 14 },
  tagsWrap: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 8 },

  readBtn:  { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 1, height: 46, borderRadius: 12, justifyContent: 'center', },
  readTxt:  { color: STONE_BISQUE, fontSize: 16, fontWeight: '600', marginLeft: 8 },
  shareIcon:{ width: 20, height: 20, tintColor: STONE_BISQUE },

  fabCol:   { position: 'absolute', right: 24, alignItems: 'center' },
  fab:      { width: 46, height: 46, borderRadius: 23, justifyContent: 'center', alignItems: 'center', marginBottom: 15, elevation: 4 },
  fabIcon:  { width: 22, height: 22, tintColor: STONE_BISQUE },
  fabIcon1: { width: 20, height: 20, tintColor: VENETIAN_RED },
  fabIcon3: { width: 15, height: 15, tintColor: STONE_BISQUE },

  sheet:       { position:'absolute', top:80, left:0, right:0, height:BS_HEIGHT, backgroundColor: STONE_BISQUE, borderTopLeftRadius:26, borderTopRightRadius:26, paddingHorizontal:26, paddingTop:20 },
  handle:      { alignSelf:'center', width:60, height:4, borderRadius:2, backgroundColor: VENETIAN_RED, marginBottom:16 },
  sheetTitle:  { color:VENETIAN_RED, fontSize:22, fontWeight:'700', marginBottom:14 },
  catTitle:    { color:VENETIAN_RED, fontSize:16, fontWeight:'600', marginVertical:6 },
  row:         { flexDirection:'row', flexWrap:'wrap' },

  applyBtn:   { height:52, borderRadius:26, justifyContent:'center', alignItems:'center', marginTop:18, marginBottom:20 },
  applyTxt:   { color:STONE_BISQUE, fontSize:17, fontWeight:'700' },
});
