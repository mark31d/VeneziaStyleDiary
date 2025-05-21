/*
  Содержит 3 экрана:
  – WishlistScreen  – список (2 вкладки), FAB-ы, bottom-sheet-фильтр
  – WishlistAdd     – форма добавления
  – WishlistDetail  – просмотр / Bought / Delete
*/
import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  Animated, PanResponder, Dimensions, Image, TextInput,
  KeyboardAvoidingView, Platform, Alert, ScrollView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useWishlist } from '../Components/WishlistContext';   // путь поправьте при необходимости

/* ───────────────────────────── Chip ───────────────────────────── */
function Chip({ label, selected = false, onPress = () => {} }) {
  return (
    <TouchableOpacity activeOpacity={0.8} onPress={onPress}>
     
      {selected ? (
        <View style={[chip.base, chip.selWhite]}>
          <Text style={chip.selTxtWhite}>{label}</Text>
        </View>
      ) : (

        <View style={chip.base}>
          <Text style={chip.txt}>{label}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const chip = StyleSheet.create({
  base:   { borderRadius:22, paddingVertical:6, paddingHorizontal:20,
            borderWidth:1, borderColor:'#FFDF5F', marginRight:10, marginBottom:10 },
            selWhite:{ backgroundColor:'#FFFFFF', borderWidth:0 },
  txt:    { color:'#fff', fontSize:14 },
  selTxtWhite:{ color:'#1A1A1A', fontSize:14, fontWeight:'600' },
});

/* ═════════════════════════════ WishlistScreen ═════════════════════════════ */
export default function WishlistScreen({ navigation }) {
  const insets                 = useSafeAreaInsets();
  const { want, bought }       = useWishlist();
  const [tab,    setTab]       = useState('want');   // want | bought
  const [filter, setFilter]    = useState(null);     // Clothes / Shoes …

  /* ------------ bottom-sheet (фильтр) ------------- */
  const SHEET_H = Dimensions.get('window').height * 0.60;   // 60 %
  const transY  = useRef(new Animated.Value(SHEET_H)).current; // скрыт
  const openBS  = (show) =>
    Animated.spring(transY, { toValue: show ? 0 : SHEET_H, useNativeDriver:true }).start();

  const pan = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dy) > 8,
      onPanResponderMove: (_, g) => {
        const val = Math.max(0, Math.min(SHEET_H, transY.__getValue() + g.dy));
        transY.setValue(val);
      },
      onPanResponderRelease: (_, g) =>
        openBS(g.vy < 0 || transY.__getValue() < SHEET_H / 2),
    })
  ).current;

  /* -------------- данные списка -------------- */
  const raw  = tab === 'want' ? want : bought;
  const data = filter ? raw.filter(i => i.category === filter) : raw;

  /* -------------- карточка -------------- */
 const Card = ({ item }) => (
  <View style={s.card}>
    {/* обложка */}
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={() => navigation.navigate('WishlistDetail', { item })}
    >
      <Image source={{ uri: item.cover }} style={s.img} />
    </TouchableOpacity>

    {/* название + цена */}
    <View style={s.row}>
      <Text style={s.title}>{item.title}</Text>
      <Text style={s.price}>${item.price}</Text>
    </View>

    {/* категория */}
    <View style={{ flexDirection: 'row', marginTop: 6 }}>
      <Chip label={item.category} />
    </View>

    {/* кнопка Read more */}
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={() => navigation.navigate('WishlistDetail', { item })}
    >
      <LinearGradient
        colors={['#FFDF5F', '#FFB84C']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={s.readBtn}
      >
        <Text style={s.readTxt}>Read more</Text>
      </LinearGradient>
    </TouchableOpacity>

   
  </View>
);

  /* -------------- UI -------------- */
  return (
    <View style={s.screen}>
      {/* header */}
      <View style={[s.header,{ paddingTop:insets.top+6, height:56+insets.top }]}>
        <Text style={s.hTitle}>Wishlist</Text>
      </View>

      {/* tabs */}
      <View style={s.tabsRow}>
        {['want','bought'].map(t => (
          <TouchableOpacity key={t}
            style={[s.tab, tab===t && s.tabActive]}
            onPress={() => setTab(t)}
          >
            <Text style={s.tabTxt}>{t==='want' ? 'I want to buy' : 'Bought'}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* list / empty */}
      {data.length === 0 ? (
        <View style={s.empty}>
          <Text style={s.emptyTxt}>
            Wishlist is empty,{'\n'}add your desired purchase now
          </Text>
        </View>
      ) : (
        <FlatList
          data={data}
          renderItem={Card}
          keyExtractor={i => i.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 120 }}
        />
      )}

      {/* FABs */}
      <View style={[s.fabCol,{ bottom:30+insets.bottom }]}>
        {/* add */}
        <TouchableOpacity
          onPress={() => navigation.navigate('WishlistAdd', { toPurchased: tab==='bought' })}>
          <LinearGradient colors={['#FFDF5F','#FFB84C']} style={s.fab}
            start={{ x:0,y:0 }} end={{ x:1,y:0 }}>
            <Image source={require('../assets/plus.png')} style={s.fabIconDark}/>
          </LinearGradient>
        </TouchableOpacity>

        {/* filter */}
        <TouchableOpacity style={[s.fab,{ backgroundColor:'#2D2D2D' }]}
          onPress={() => openBS(true)}>
          <Image source={require('../assets/filters.png')} style={s.fabIcon}/>
        </TouchableOpacity>
      </View>

      {/* bottom-sheet */}
      <Animated.View style={[bs.sheet,{ transform:[{ translateY: transY }] }]} {...pan.panHandlers}>
        <View style={bs.handle}/>
        <Text style={bs.title}>Filters</Text>

        <Text style={bs.cat}>Category</Text>
        <View style={bs.row}>
          {['Clothes','Shoes','Accessories'].map(categ => (
            <Chip key={categ}
              label={categ}
              selected={filter === categ}
              onPress={() => setFilter(filter === categ ? null : categ)}
            />
          ))}
        </View>

        <TouchableOpacity activeOpacity={0.9} onPress={() => openBS(false)}>
          <LinearGradient colors={['#FFDF5F','#FFB84C']} style={bs.applyBtn}
            start={{ x:0,y:0 }} end={{ x:1,y:0 }}>
            <Text style={bs.applyTxt}>Apply</Text>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

/* ═════════════ WishlistAdd ═════════════ */
export function WishlistAdd({ route, navigation }) {
  const { toPurchased = false } = route.params || {};
  const { addItem }   = useWishlist();
  const insets        = useSafeAreaInsets();

  const [cover,setCover] = useState(null);
  const [title,setTitle] = useState('');
  const [price,setPrice] = useState('');
  const [cat,  setCat]   = useState('');

  const save = () => {
    if (!title || !price || !cat) { Alert.alert('Fill all fields'); return; }
    addItem({ cover,title,price,category:cat }, toPurchased);
    navigation.goBack();
  };

  return (
    <KeyboardAvoidingView style={s.screen}
      behavior={Platform.OS==='ios' ? 'padding' : undefined}>
      {/* header */}
      <View style={[s.header,{ paddingTop:insets.top+6, height:56+insets.top }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image source={require('../assets/arrowback.png')} style={s.back}/>
        </TouchableOpacity>
        <Text style={s.hTitle}>New object</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding:20 }}>
        <Text style={s.label}>Cover</Text>
        <TouchableOpacity style={sa.cover} onPress={()=>Alert.alert('Image picker')}>
          {cover
            ? <Image source={{ uri:cover }} style={sa.cover}/>
            : <Text style={sa.plus}>+</Text>}
        </TouchableOpacity>

        {[ {l:'Title',v:title,set:setTitle},
           {l:'Price',v:price,set:setPrice,keyb:'numeric'},
           {l:'Category',v:cat,set:setCat} ].map(({l,v,set,keyb})=>(
          <React.Fragment key={l}>
            <Text style={s.label}>{l}</Text>
            <TextInput
              placeholder={`Enter ${l.toLowerCase()}`}
              placeholderTextColor="#888"
              keyboardType={keyb||'default'}
              style={sa.input}
              value={v}
              onChangeText={set}
            />
          </React.Fragment>
        ))}
      </ScrollView>

      <TouchableOpacity activeOpacity={0.9} onPress={save}
        style={{ marginBottom:insets.bottom+10 }}>
        <LinearGradient colors={['#FFDF5F','#FFB84C']} style={sa.btn}
          start={{ x:0,y:0 }} end={{ x:1,y:0 }}>
          <Text style={sa.btnTxt}>Continue</Text>
        </LinearGradient>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

/* ═════════════ WishlistDetail ═════════════ */
export function WishlistDetail({ route, navigation }) {
  const { item } = route.params;
  const { markAsBought, removeItem } = useWishlist();
  const insets = useSafeAreaInsets();
  const bought = !!item.moved;

  return (
    <View style={s.screen}>
      {/* header */}
      <View style={[s.header,{ paddingTop:insets.top+6, height:56+insets.top }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image source={require('../assets/arrowback.png')} style={s.back}/>
        </TouchableOpacity>
        <Text style={s.hTitle}>Info</Text>
        <TouchableOpacity
          onPress={() =>
            Alert.alert('Delete item?', '', [
              { text:'Cancel',style:'cancel' },
              { text:'Delete',style:'destructive',
                onPress:()=>{ removeItem(item.id,bought); navigation.goBack(); } }
            ])}>
          <Image source={require('../assets/trash.png')} style={s.trash}/>
        </TouchableOpacity>
      </View>

      <Image source={{ uri:item.cover }} style={sd.cover}/>
      <Text style={s.title}>{item.title}</Text>
      <Text style={s.price}>Price: ${item.price}</Text>
      <View style={{ flexDirection:'row', marginHorizontal:20, marginTop:6 }}>
        <Text style={{ color:'#fff' }}>Category:</Text>
        <Chip label={item.category}/>
      </View>

      <TouchableOpacity activeOpacity={0.9}
        disabled={bought}
        onPress={()=>{ markAsBought(item.id); navigation.goBack(); }}
        style={{ marginTop:'auto', marginBottom: insets.bottom+10 }}>
        {bought
          ? <View style={[sd.btn,{ backgroundColor:'#1C1C1C' }]}>
              <Text style={[sd.btnTxt,{ color:'#fff' }]}>Not purchased</Text>
            </View>
          : <LinearGradient colors={['#FFDF5F','#FFB84C']} style={sd.btn}
              start={{x:0,y:0}} end={{x:1,y:0}}>
              <Text style={sd.btnTxt}>Bought</Text>
            </LinearGradient>}
      </TouchableOpacity>
    </View>
  );
}

/* ───────────────────────────── С Т И Л И ───────────────────────────── */
const s = StyleSheet.create({
    readBtn: {
        height: 46,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 18,
      },
      readTxt: {
        color: '#1A1A1A',
        fontSize: 16,
        fontWeight: '600',
      },
  /* main */
  screen:{ flex:1, backgroundColor:'#0D0D0D' },

  /* header */
  header:{ flexDirection:'row', alignItems:'center',
           backgroundColor:'#272727', paddingHorizontal:20 },
  hTitle:{ color:'#fff', fontSize:26, fontWeight:'700',  },
  back:  { width:22, height:22, tintColor:'#fff', resizeMode:'contain' , },
  trash: { width:22, height:22, tintColor:'#fff', resizeMode:'contain' },

  /* tabs */
  tabsRow:{ flexDirection:'row', marginTop:12, marginHorizontal:20,
            backgroundColor:'#1A1A1A', borderRadius:30, padding:4 },
  tab:      { flex:1, height:38, borderRadius:19,
              justifyContent:'center', alignItems:'center' },
  tabActive:{ backgroundColor:'#0D0D0D' },
  tabTxt:   { color:'#fff', fontSize:13, fontWeight:'600' },

  /* empty */
  empty:{ flex:1, justifyContent:'center', alignItems:'center' },
  emptyTxt:{ color:'#fff', textAlign:'center', fontSize:16, lineHeight:22 },

  /* card */
  card:{ backgroundColor:'#141414', padding:18, margin:20,
         borderRadius:20 },
  img:{ width:'100%', height:260, borderRadius:16, resizeMode:'cover' },
  row:{ flexDirection:'row', justifyContent:'space-between',
        alignItems:'center', marginTop:14 },
  title:{ color:'#fff', fontSize:18, fontWeight:'700' },
  price:{ color:'#fff', fontSize:18, fontWeight:'700' },

  plusHit:{ position:'absolute', right:8, bottom:66 },
  plus:{ width:24, height:24, tintColor:'#FFCC3A', resizeMode:'contain' },

  /* labels / inputs */
  label:{ color:'#fff', fontSize:14, marginBottom:10 },

  /* FABs */
  fabCol:{ position:'absolute', right:24, alignItems:'center' },
  fab:{ width:46, height:46, borderRadius:24, justifyContent:'center',
        alignItems:'center', marginBottom:12, elevation:4 , top:20, left: 10},
  fabIcon:{ width:20, height:20, tintColor:'#fff', resizeMode:'contain' },
  fabIconDark:{ width:24, height:24, tintColor:'#1A1A1A', resizeMode:'contain' },
});

const sa = StyleSheet.create({
  cover:{ width:'100%', aspectRatio:1.6, borderRadius:18,
          backgroundColor:'#fff', justifyContent:'center', alignItems:'center',
          marginBottom:14 },
  plus:{ fontSize:36, color:'#FFCC3A' },

  input:{ backgroundColor:'#fff', borderRadius:12, paddingHorizontal:16,
          height:48, marginBottom:14, color:'#000' },

  btn:{ height:56, borderRadius:28, marginHorizontal:20,
        justifyContent:'center', alignItems:'center' },
  btnTxt:{ color:'#1A1A1A', fontSize:18, fontWeight:'700' },
});

const sd = StyleSheet.create({
  cover:{ width:'90%', height:260, alignSelf:'center', resizeMode:'cover',
          borderRadius:20, marginTop:16 },
  btn:{ height:56, borderRadius:28, marginHorizontal:20,
        justifyContent:'center', alignItems:'center' },
  btnTxt:{ color:'#1A1A1A', fontSize:18, fontWeight:'700' },
});

const bs = StyleSheet.create({
  sheet:{ position:'absolute', left:0, right:0, bottom:0,
          height:Dimensions.get('window').height * 0.60,
          backgroundColor:'#1F1F1F',
          borderTopLeftRadius:26, borderTopRightRadius:26,
          paddingHorizontal:24, paddingTop:20 , marginBottom:-20,},
  handle:{ alignSelf:'center', width:70, height:4, borderRadius:2,
           backgroundColor:'#666', marginBottom:14 },
  title:{ color:'#fff', fontSize:22, fontWeight:'700', marginBottom:10 },
  cat:{ color:'#AAA', fontSize:16, fontWeight:'600', marginBottom:4 },
  row:{ flexDirection:'row', flexWrap:'wrap' },
  applyBtn:{ height:52, borderRadius:26, justifyContent:'center',
             alignItems:'center', marginTop:26 },
  applyTxt:{ color:'#1A1A1A', fontSize:17, fontWeight:'700' },
});
