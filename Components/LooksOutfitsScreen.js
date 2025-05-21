// ──────────────────────────────────────────────────────────────
//  src/Components/LooksOutfitsScreen.js
//  «Looks & Outfits» экран c FAB-кнопками и полуэкранной шторкой-фильтром
// ──────────────────────────────────────────────────────────────
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
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';

/* ─── DEMO DATA (картинки лежат в src/assets) ─── */
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

/* ─── CONSTANTS ─── */
const { height: SCREEN_H } = Dimensions.get('window');
const BS_HEIGHT = SCREEN_H * 0.8;          // шторка = 50 % высоты
const BS_OPEN   = 0;
const BS_CLOSE  = BS_HEIGHT;

/* ─── CHIP WITH GRADIENT WHEN SELECTED ─── */
const Chip = ({ label, selected, onPress }) => (
  <TouchableOpacity activeOpacity={0.8} onPress={onPress}>
  <View style={[chip.base, selected && chip.sel]}>
<Text style={[chip.txt, selected && chip.txtSel]}>{label}</Text>
</View>
  </TouchableOpacity>
);

/* ─── MAIN COMPONENT ─── */
export default function LooksOutfitsScreen({ navigation }) {
  const insets = useSafeAreaInsets();

  /* state */
  const [looks, setLooks]       = useState(mockLooks);
  const [favs,  setFavs]        = useState([]);

  const [season, setSeason]     = useState(null);
  const [styleFilter, setStyle] = useState(null);
  const [bodyType, setBody]     = useState(null);

  /* sheet animation */
  const translateY = useRef(new Animated.Value(BS_CLOSE)).current;
  const sheetOpen  = useRef(false);

  const toggleSheet = (open) => {
    sheetOpen.current = open;
    Animated.spring(translateY, {
      toValue: open ? BS_OPEN : BS_CLOSE,
      useNativeDriver: true,
    }).start();
  };

  /* pan-gesture */
  const pan = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dy) > 10,
      onPanResponderMove: (_, g) => {
        const newY = Math.min(Math.max(BS_OPEN, translateY.__getValue() + g.dy), BS_CLOSE);
        translateY.setValue(newY);
      },
      onPanResponderRelease: (_, g) => {
        const open = g.vy < 0 || translateY.__getValue() < BS_CLOSE / 2;
        toggleSheet(open);
      },
    })
  ).current;

  /* фильтрация */
  const applyFilters = () => {
    const filtered = mockLooks.filter(
      (l) =>
        (!season      || l.season === season) &&
        (!styleFilter || l.styles.includes(styleFilter)) &&
        (!bodyType    || l.bodyTypes.includes(bodyType))
    );
    setLooks(filtered);
    toggleSheet(false);
  };

  /* избранное */
  const toggleFav = (id) =>
    setFavs((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));

  /* card */
  const renderCard = ({ item }) => (
    <View style={styles.card}>
      <TouchableOpacity activeOpacity={0.85} onPress={() => navigation.navigate('OutfitDetail', { look: item })}>
        <Image source={item.cover} style={styles.image} />
      </TouchableOpacity>

      <Text style={styles.title}>{item.title}</Text>

      <View style={styles.tagsWrap}>
        {item.tags.map((t) => (
          <Chip key={t} label={t} selected={false} onPress={() => {}} />
        ))}
      </View>

      <TouchableOpacity activeOpacity={0.85} onPress={() => navigation.navigate('OutfitDetail', { look: item })}>
        <LinearGradient colors={['#FFDF5F', '#FFB84C']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.readBtn}>
          <Text style={styles.readTxt}>Read more</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );

  /* ─── UI ─── */
  return (
    <View style={styles.screen}>
      {/* HEADER */}
      <View style={[styles.header, { paddingTop: insets.top + 6, height: 56 + insets.top }]}>
        <Text style={styles.hTitle}>Looks & Outfits</Text>
        <TouchableOpacity onPress={() => navigation.navigate('SettingsScreen')}>
          <Image source={require('../assets/gear.png')} style={styles.hIcon} />
        </TouchableOpacity>
      </View>

      {/* LIST */}
      <FlatList
        data={looks}
        renderItem={renderCard}
        keyExtractor={(i) => i.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: BS_HEIGHT - 500 }}
      />

      {/* FABs */}
      <View style={[styles.fabCol, { bottom: 24 + insets.bottom }]}>
        <TouchableOpacity activeOpacity={0.85} onPress={() => navigation.navigate('Wishlist')}>
          <LinearGradient colors={['#FFDF5F', '#FFB84C']} style={styles.fab} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
            <Image source={require('../assets/plus.png')} style={styles.fabIcon1} />
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.fab, { backgroundColor: '#1C1C1C' }]} activeOpacity={0.85} onPress={() => toggleSheet(true)}>
          <Image source={require('../assets/filters.png')} style={styles.fabIcon3} />
        </TouchableOpacity>

        <TouchableOpacity style={[styles.fab, { backgroundColor: '#B62626' }]} activeOpacity={0.85} onPress={() => navigation.navigate('FavoritesScreen')}>
          <Image source={ require('../assets/heart1.png')} style={styles.fabIcon} />
        </TouchableOpacity>
      </View>

      {/* BOTTOM-SHEET */}
      <Animated.View style={[sheet.sheet, { transform: [{ translateY }] }]} {...pan.panHandlers}>
        <View style={sheet.handle} />
        <Text style={sheet.sheetTitle}>Filters</Text>

        {/* Seasons */}
        <Text style={sheet.catTitle}>Fashion seasons</Text>
        <View style={sheet.row}>
          {['Spring', 'Summer', 'Fall', 'Winter'].map((s) => (
            <Chip key={s} label={s} selected={season === s} onPress={() => setSeason(season === s ? null : s)} />
          ))}
        </View>

        {/* Styles */}
        <Text style={sheet.catTitle}>Clothing styles</Text>
        <View style={sheet.row}>
          {['Classic', 'Athleisure', 'Boho', 'Grunge', 'Romantic'].map((s) => (
            <Chip key={s} label={s} selected={styleFilter === s} onPress={() => setStyle(styleFilter === s ? null : s)} />
          ))}
        </View>

        {/* Body types */}
        <Text style={sheet.catTitle}>Body types</Text>
        <View style={sheet.row}>
          {['Hourglass', 'Pear', 'Apple', 'Rectangle'].map((s) => (
            <Chip key={s} label={s} selected={bodyType === s} onPress={() => setBody(bodyType === s ? null : s)} />
          ))}
        </View>

        {/* APPLY */}
        <TouchableOpacity activeOpacity={0.9} onPress={applyFilters}>
          <LinearGradient colors={['#FFDF5F', '#FFB84C']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={sheet.applyBtn}>
            <Text style={sheet.applyTxt}>Apply</Text>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}


const chip = StyleSheet.create({
  base: { borderRadius: 22, paddingVertical: 6, paddingHorizontal: 20, borderWidth: 1, borderColor: '#FFDF5F', marginRight: 10, marginBottom: 10 },
  sel:  { backgroundColor: '#FFFFFF', borderColor: '#FFFFFF' },
  txt:  { color: '#FFFFFF', fontSize: 14 },
  txtSel: { color: '#1A1A1A', fontSize: 14, fontWeight: '600' },
});

/* ─── MAIN STYLES ─── */
const CARD_BG = '#141414';
const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#0D0D0D' },

  header: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#272727', paddingHorizontal: 22 },
  hTitle: { flex: 1, color: '#fff', fontSize: 26, fontWeight: '700' },
  hIcon:  { width: 26, height: 26, tintColor: '#fff' },

  card:   { backgroundColor: CARD_BG, marginHorizontal: 20, marginTop: 20, borderRadius: 20, padding: 18 },
  image:  { width: '100%', height: 260, borderRadius: 16, resizeMode: 'cover' },
  title:  { color: '#fff', fontSize: 18, fontWeight: '600', marginTop: 14 },
  tagsWrap: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 8 },

  readBtn: { height: 46, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginTop: 18 },
  readTxt: { color: '#1A1A1A', fontSize: 16, fontWeight: '600' },

  /* FAB */
  fabCol: { position: 'absolute', right: 24, alignItems: 'center' },
  fab: { width: 46, height: 46, borderRadius: 23, justifyContent: 'center', alignItems: 'center', marginBottom: 15, elevation: 4 },
  fabIcon: { width: 22, height: 22, tintColor: '#fff', resizeMode: 'contain' },
  fabIcon1: { width: 20, height: 20, tintColor: '#000', resizeMode: 'contain' },
  fabIcon3: { width: 15, height: 15, tintColor: '#fff', resizeMode: 'contain' },
});

/* ─── SHEET ─── */
const sheet = StyleSheet.create({
  sheet: { position: 'absolute', top:80, left: 0, right: 0, height: BS_HEIGHT, backgroundColor: '#1F1F1F', borderTopLeftRadius: 26, borderTopRightRadius: 26, paddingHorizontal: 26, paddingTop: 20 },
  handle: { alignSelf: 'center', width: 60, height: 4, borderRadius: 2, backgroundColor: '#6E6E6E', marginBottom: 16 },
  sheetTitle: { color: '#fff', fontSize: 22, fontWeight: '700', marginBottom: 14 },
  catTitle: { color: '#CCC', fontSize: 16, fontWeight: '600', marginVertical: 6 },
  row: { flexDirection: 'row', flexWrap: 'wrap' },

  applyBtn: { height: 52, borderRadius: 26, justifyContent: 'center', alignItems: 'center', marginTop: 18, marginBottom: 20 },
  applyTxt: { color: '#1A1A1A', fontSize: 17, fontWeight: '700' },
});
