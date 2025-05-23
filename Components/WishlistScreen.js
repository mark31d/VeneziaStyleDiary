// src/screens/WishlistScreens.js
import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  Animated, PanResponder, Dimensions, Image, TextInput,
  KeyboardAvoidingView, Platform, Alert, ScrollView, Share,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useWishlist } from '../Components/WishlistContext';

/* ─── Venetian palette ─── */
const VENETIAN_RED  = '#C80815';
const CANAL_TEAL    = '#007073';
const STONE_BISQUE  = '#E5C8A9';
const white = "#FFFFF";
/* ─── Chip ─── */
function Chip({ label, selected = false, onPress = () => {} }) {
  return (
    <TouchableOpacity activeOpacity={0.8} onPress={onPress}>
      {selected ? (
        <View style={[chip.base, chip.sel]}>
          <Text style={chip.selTxt}>{label}</Text>
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
  base:    {
    borderRadius: 22,
    paddingVertical: 6,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: CANAL_TEAL,
    marginRight: 10,
    marginBottom: 10,
  },
  sel:     {
    backgroundColor: CANAL_TEAL,
    borderWidth: 0,
  },
  txt:     { color: CANAL_TEAL, fontSize: 14 },
  selTxt:  { color: STONE_BISQUE, fontSize: 14, fontWeight: '600' },
});

/* ═════════════════════════════ WishlistScreen ═════════════════════════════ */
export default function WishlistScreen({ navigation }) {
  const insets  = useSafeAreaInsets();
  const { want, bought } = useWishlist();
  const [tab, setTab]    = useState('want');
  const [filter, setFilter] = useState(null);

  /* bottom-sheet */
  const SHEET_H = Dimensions.get('window').height * 0.6;
  const transY  = useRef(new Animated.Value(SHEET_H)).current;
  const openBS  = show => Animated.spring(transY,{
    toValue: show ? 0 : SHEET_H, useNativeDriver: true
  }).start();
  const pan = useRef(PanResponder.create({
    onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dy) > 8,
    onPanResponderMove: (_, g) => {
      const val = Math.max(0, Math.min(SHEET_H, transY.__getValue() + g.dy));
      transY.setValue(val);
    },
    onPanResponderRelease: (_, g) =>
      openBS(g.vy < 0 || transY.__getValue() < SHEET_H / 2),
  })).current;

  /* data */
  const raw  = tab === 'want' ? want : bought;
  const data = filter ? raw.filter(i => i.category === filter) : raw;

  /* share */
  const onShare = async item => {
    try {
      await Share.share({ message: `Take a look: ${item.title}` });
    } catch (e) {}
  };

  /* card */
  const Card = ({ item }) => (
    <View style={s.card}>
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => navigation.navigate('WishlistDetail',{ item })}
      >
        <Image source={{ uri: item.cover }} style={s.img}/>
      </TouchableOpacity>
      <View style={s.row}>
        <Text style={s.title}>{item.title}</Text>
        <Text style={s.price}>${item.price}</Text>
      </View>
      <View style={s.row}>
        <Chip label={item.category} />
        <TouchableOpacity onPress={()=>onShare(item)}>
          <Image source={require('../assets/share.png')} style={s.shareIcon}/>
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => navigation.navigate('WishlistDetail',{ item })}
      >
        <LinearGradient
          colors={[VENETIAN_RED, STONE_BISQUE]}
          start={{ x:0,y:0 }} end={{ x:1,y:0 }}
          style={s.readBtn}
        >
          <Text style={s.readTxt}>Read more</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={s.screen}>
      <View style={[s.header,{ paddingTop:insets.top+6, height:56+insets.top }]}>
        <Text style={s.hTitle}>Wishlist</Text>
      </View>

      {/* tabs */}
      <View style={s.tabsRow}>
        {['want','bought'].map(t => (
          <TouchableOpacity
            key={t}
            style={[s.tab, tab===t && s.tabActive]}
            onPress={()=>setTab(t)}
          >
            <Text style={[s.tabTxt, tab===t?{color:CANAL_TEAL}:{color:STONE_BISQUE}]}>
              {t==='want'? 'I want to buy':'Bought'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* list or empty */}
      {data.length===0 ? (
        <View style={s.empty}>
          <Text style={s.emptyTxt}>
            Wishlist is empty.{'\n'}Add something you like!
          </Text>
        </View>
      ) : (
        <FlatList
          data={data}
          renderItem={Card}
          keyExtractor={i=>i.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{paddingBottom:120}}
        />
      )}

      {/* fabs */}
      <View style={[s.fabCol,{ bottom:30+insets.bottom }]}>
        <TouchableOpacity
          onPress={()=>navigation.navigate('WishlistAdd',{ toPurchased: tab==='bought' })}
        >
          <LinearGradient
            colors={[VENETIAN_RED, STONE_BISQUE]}
            start={{x:0,y:0}} end={{x:1,y:0}}
            style={s.fab}
          >
            <Image source={require('../assets/plus.png')} style={s.fabIcon}/>
          </LinearGradient>
        </TouchableOpacity>
        <TouchableOpacity
          style={[s.fab,{ backgroundColor: CANAL_TEAL }]}
          onPress={()=>openBS(true)}
        >
          <Image source={require('../assets/filters.png')} style={s.fabIcon}/>
        </TouchableOpacity>
      </View>

      {/* bottom-sheet */}
      <Animated.View
        style={[bs.sheet,{ transform:[{ translateY: transY }] }]}
        {...pan.panHandlers}
      >
        <View style={bs.handle}/>
        <Text style={bs.title}>Filters</Text>

        <Text style={bs.cat}>Category</Text>
        <View style={bs.row}>
          {['Clothes','Shoes','Accessories'].map(c=>(
            <Chip
              key={c}
              label={c}
              selected={filter===c}
              onPress={()=>setFilter(filter===c?null:c)}
            />
          ))}
        </View>

        <TouchableOpacity activeOpacity={0.9} onPress={()=>openBS(false)}>
          <LinearGradient
            colors={[VENETIAN_RED, STONE_BISQUE]}
            start={{x:0,y:0}} end={{x:1,y:0}}
            style={bs.applyBtn}
          >
            <Text style={bs.applyTxt}>Apply</Text>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

/* ═════════════════════════════ WishlistAdd ═════════════════════════════ */
export function WishlistAdd({ route, navigation }) {
  const { toPurchased=false } = route.params||{};
  const { addItem } = useWishlist();
  const insets = useSafeAreaInsets();
  const [cover,setCover] = useState(null);
  const [title,setTitle] = useState('');
  const [price,setPrice] = useState('');
  const [cat,setCat]     = useState('');

  const save = () => {
    if(!title||!price||!cat){
      Alert.alert('Fill all fields');
      return;
    }
    addItem({ cover,title,price,category:cat }, toPurchased);
    navigation.goBack();
  };

  return (
    <KeyboardAvoidingView
      style={s.screen}
      behavior={Platform.OS==='ios'?'padding':undefined}
    >
      <View style={[s.header,{ paddingTop:insets.top+6, height:56+insets.top }]}>
        <TouchableOpacity onPress={()=>navigation.goBack()}>
          <Image source={require('../assets/arrowback.png')} style={s.back}/>
        </TouchableOpacity>
        <Text style={s.hTitle}>New item</Text>
      </View>

      <ScrollView contentContainerStyle={{padding:20}}>
        <Text style={s.label}>Cover</Text>
        <TouchableOpacity style={sa.cover} onPress={()=>Alert.alert('Pick image')}>
          {cover
            ? <Image source={{uri:cover}} style={sa.cover}/>
            : <Text style={sa.plus}>+</Text>}
        </TouchableOpacity>

        {[
          {l:'Title',v:title,set:setTitle},
          {l:'Price',v:price,set:setPrice,keyb:'numeric'},
          {l:'Category',v:cat,set:setCat},
        ].map(({l,v,set,keyb})=>(
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

      <TouchableOpacity onPress={save} activeOpacity={0.9}
        style={{marginBottom:insets.bottom+10}}
      >
        <LinearGradient
          colors={[VENETIAN_RED, STONE_BISQUE]}
          start={{x:0,y:0}} end={{x:1,y:0}}
          style={sa.btn}
        >
          <Text style={sa.btnTxt}>Continue</Text>
        </LinearGradient>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

/* ═════════════════════════════ WishlistDetail ═════════════════════════════ */
export function WishlistDetail({ route, navigation }) {
  const { item } = route.params;
  const { markAsBought, removeItem } = useWishlist();
  const insets = useSafeAreaInsets();
  const bought = !!item.moved;

  return (
    <View style={s.screen}>
      <View style={[s.header,{ paddingTop:insets.top+6, height:56+insets.top }]}>
        <TouchableOpacity onPress={()=>navigation.goBack()}>
          <Image source={require('../assets/arrowback.png')} style={s.back}/>
        </TouchableOpacity>
        <Text style={s.hTitle}>Info</Text>
        <TouchableOpacity onPress={()=>Alert.alert(
            'Delete item?', '', [
              {text:'Cancel', style:'cancel'},
              {text:'Delete', style:'destructive', onPress:()=>{
                removeItem(item.id,bought);
                navigation.goBack();
              }}
            ]
          )}
        >
          <Image source={require('../assets/trash.png')} style={s.trash}/>
        </TouchableOpacity>
      </View>

      <Image source={{uri:item.cover}} style={sd.cover}/>
      <Text style={s.title}>{item.title}</Text>
      <Text style={s.price}>Price: ${item.price}</Text>
      <View style={{flexDirection:'row',marginHorizontal:20,marginTop:6}}>
        <Text style={{color:VENETIAN_RED}}>Category:</Text>
        <Chip label={item.category}/>
      </View>

      <TouchableOpacity
        activeOpacity={0.9}
        disabled={bought}
        onPress={()=>{ markAsBought(item.id); navigation.goBack(); }}
        style={{marginTop:'auto', marginBottom:insets.bottom+10}}
      >
        {bought ? (
          <View style={[sd.btn,{ backgroundColor:CANAL_TEAL }]}>
            <Text style={[sd.btnTxt,{ color:STONE_BISQUE }]}>Not purchased</Text>
          </View>
        ) : (
          <LinearGradient
            colors={[VENETIAN_RED, STONE_BISQUE]}
            start={{x:0,y:0}} end={{x:1,y:0}}
            style={sd.btn}
          >
            <Text style={sd.btnTxt}>Bought</Text>
          </LinearGradient>
        )}
      </TouchableOpacity>
    </View>
  );
}


/* ─── С Т И Л И ─── */
const s = StyleSheet.create({
  screen:  { flex:1, backgroundColor: STONE_BISQUE },

  header:  {
    flexDirection:'row',
    alignItems:'center',
    backgroundColor: CANAL_TEAL,
    paddingHorizontal:20,
  },
  hTitle:  { color: STONE_BISQUE, fontSize:26, fontWeight:'700', marginLeft:12 },
  back:    { width:22, height:22, tintColor:STONE_BISQUE, resizeMode:'contain' },
  trash:   { width:22, height:22, tintColor:STONE_BISQUE, resizeMode:'contain' },

  tabsRow:  {
    flexDirection:'row',
    marginTop:12,
    marginHorizontal:20,
    backgroundColor: CANAL_TEAL,
    borderRadius:30,
    padding:4,
  },
  tab:      {
    flex:1, height:38, borderRadius:19,
    justifyContent:'center', alignItems:'center',
  },
  tabActive:{ backgroundColor: STONE_BISQUE },
  tabTxt:   { fontSize:13, fontWeight:'600' },

  empty:    { flex:1, justifyContent:'center', alignItems:'center' },
  emptyTxt: { color: CANAL_TEAL, textAlign:'center', fontSize:16, lineHeight:22 },

  card:   {
    backgroundColor: "white",
    padding:18,
    margin:20,
    borderRadius:20,
  },
  img:    { width:'100%', height:260, borderRadius:16, resizeMode:'cover' },
  row:    {
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center',
    marginTop:14,
  },
  title:  { color: VENETIAN_RED, fontSize:18, fontWeight:'700' },
  price:  { color: CANAL_TEAL, fontSize:18, fontWeight:'700' },

  readBtn: { height:46, borderRadius:12, justifyContent:'center', alignItems:'center', marginTop:18 },
  readTxt: { color: STONE_BISQUE, fontSize:16, fontWeight:'600' },

  shareIcon:{ width:20, height:20, tintColor:VENETIAN_RED, marginLeft:8 },

  fabCol:  { position:'absolute', right:24, alignItems:'center' },
  fab:     { width:46, height:46, borderRadius:23, justifyContent:'center', alignItems:'center', marginBottom:12, elevation:4 },
  fabIcon: { width:24, height:24, tintColor:STONE_BISQUE, resizeMode:'contain' },

});

const sa = StyleSheet.create({
  cover:  {
    width:'100%', aspectRatio:1.6, borderRadius:18,
    backgroundColor:'#fff', justifyContent:'center', alignItems:'center',
    marginBottom:14,
  },
  plus:   { fontSize:36, color:VENETIAN_RED },

  input:  {
    backgroundColor:'#fff', borderRadius:12,
    paddingHorizontal:16, height:48, marginBottom:14, color:'#000',
  },

  btn:    {
    height:56, borderRadius:28, marginHorizontal:20,
    justifyContent:'center', alignItems:'center',
  },
  btnTxt: { color:'#1A1A1A', fontSize:18, fontWeight:'700' },
});

const sd = StyleSheet.create({
  cover:  { width:'90%', height:260, alignSelf:'center', resizeMode:'cover', borderRadius:20, marginTop:16 },
  btn:    { height:56, borderRadius:28, marginHorizontal:20, justifyContent:'center', alignItems:'center' },
  btnTxt: { color:'#1A1A1A', fontSize:18, fontWeight:'700' },
});

const bs = StyleSheet.create({
  sheet:    {
    position:'absolute', left:0, right:0, bottom:0,
    height:Dimensions.get('window').height * 0.6,
    backgroundColor: STONE_BISQUE,
    borderTopLeftRadius:26, borderTopRightRadius:26,
    paddingHorizontal:24, paddingTop:20,
  },
  handle:   { alignSelf:'center', width:70, height:4, borderRadius:2, backgroundColor: VENETIAN_RED, marginBottom:14 },
  title:    { color: VENETIAN_RED, fontSize:22, fontWeight:'700', marginBottom:10 },
  cat:      { color: CANAL_TEAL, fontSize:16, fontWeight:'600', marginBottom:4 },
  row:      { flexDirection:'row', flexWrap:'wrap' },
  applyBtn:{ height:52, borderRadius:26, justifyContent:'center', alignItems:'center', marginTop:26 },
  applyTxt:{ color: STONE_BISQUE, fontSize:17, fontWeight:'700' },
});
