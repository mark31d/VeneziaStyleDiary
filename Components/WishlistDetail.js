// ──────────────────────────────────────────────────────────────
//  Экран «Info»
// ──────────────────────────────────────────────────────────────
import React from 'react';
import {
  View, Text, StyleSheet, Image, TouchableOpacity,
  Alert, ScrollView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  useWishlist,
} from '../Components/WishlistContext';     // ← скорректируйте при необходимости

/* ---------- Chip ---------- */
function Chip({ label }) {
  return (
    <LinearGradient
      colors={['#FFDF5F', '#FFB84C']}
      start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
      style={chip.base}
    >
      <Text style={chip.txt}>{label}</Text>
    </LinearGradient>
  );
}
const chip = StyleSheet.create({
  base: { borderRadius: 14, paddingVertical: 3, paddingHorizontal: 12 , width:100 , height:30, top:2 },
  txt:  { fontSize: 14, fontWeight: '600', color: '#1A1A1A' },
});

/* ---------- Screen ---------- */
export default function WishlistDetail({ route, navigation }) {
  const { item } = route.params;
  const { markAsBought, markAsUnbought, removeItem } = useWishlist();

  const insets = useSafeAreaInsets();
  const bought = !!item.moved;

  /* delete */
  const askDelete = () =>
    Alert.alert('Delete item?', '', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete', style: 'destructive',
        onPress: () => { removeItem(item.id, bought); navigation.goBack(); },
      },
    ]);

  /* ---------- UI ---------- */
  return (
    <View style={s.screen}>
      {/* Header */}
      <View style={[s.header, { paddingTop: insets.top + 6, height: 56 + insets.top }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image source={require('../assets/arrowback.png')} style={s.back} />
        </TouchableOpacity>

        {/* пустышка, чтобы title был по центру */}
        <View style={{ flex: 1, alignItems:'center' }}>
          <Text style={s.hTitle}>Info</Text>
        </View>

        <TouchableOpacity onPress={askDelete}>
          <Image source={require('../assets/trash.png')} style={s.trash} />
        </TouchableOpacity>
      </View>

      {/* body */}
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* cover */}
        {item.cover
          ? <Image source={{ uri: item.cover }} style={s.cover} />
          : <View style={[s.cover, { backgroundColor: '#444' }]} />}

        {/* text */}
        <Text style={s.title}>{item.title}</Text>
        <Text style={s.price}>Price: ${item.price}</Text>

        <View style={s.attrRow}>
          <Text style={s.attrLabel}>Category:</Text>
          <Chip label={item.category} />
        </View>
      </ScrollView>

      {/* CTA */}
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => {
          bought ? markAsUnbought(item.id) : markAsBought(item.id);
          navigation.goBack();
        }}
        style={{ marginBottom: insets.bottom + 12 }}
      >
        {bought ? (
          <View style={[s.btn,{ backgroundColor:'#1C1C1C' }]}>
            <Text style={[s.btnTxt,{ color:'#fff' }]}>Not purchased</Text>
          </View>
        ) : (
          <LinearGradient
            colors={['#FFDF5F', '#FFB84C']}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
            style={s.btn}
          >
            <Text style={s.btnTxt}>Bought</Text>
          </LinearGradient>
        )}
      </TouchableOpacity>
    </View>
  );
}

/* ---------- styles ---------- */
const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#0D0D0D' },

  /* header */
  header:{ flexDirection:'row', alignItems:'center',
           backgroundColor:'#272727', paddingHorizontal:20 },
  hTitle:{ color:'#fff', fontSize:26, fontWeight:'700' },
  back:  { width:22, height:22, tintColor:'#fff', resizeMode:'contain' },
  trash: { width:22, height:22, tintColor:'#fff', resizeMode:'contain' },

  /* body */
  cover:{ width:'90%', height:260, borderRadius:20, alignSelf:'center',
          marginTop:16, resizeMode:'cover' },
  title:{ color:'#fff', fontSize:20, fontWeight:'700',
          marginHorizontal:20, marginTop:16 },
  price:{ color:'#fff', fontSize:16, marginHorizontal:20, marginTop:8 },

  attrRow:{ flexDirection:'row', alignItems:'center',
            marginHorizontal:20, marginTop:10 },
  attrLabel:{ color:'#bbb', marginRight:6, fontSize:14 },

  /* button */
  btn:{ height:56, borderRadius:28, marginHorizontal:20,
        justifyContent:'center', alignItems:'center' },
  btnTxt:{ color:'#1A1A1A', fontSize:18, fontWeight:'700' },
});
