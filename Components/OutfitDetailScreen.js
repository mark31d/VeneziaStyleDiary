// src/Components/OutfitDetailScreen.js
import React, { useLayoutEffect, useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Share,
  Alert,
  Clipboard, // для RN ≥0.60: импортировать из '@react-native-clipboard/clipboard'
  Modal,
  TouchableWithoutFeedback,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFav } from '../Components/FavoritesContext';

/* ─── Venetian palette ─── */
const VENETIAN_RED  = '#C80815';
const CANAL_TEAL    = '#007073';
const STONE_BISQUE  = '#E5C8A9';
const dark = "#333";

export default function OutfitDetailScreen({ route, navigation }) {
  const { look } = route.params;
  const insets   = useSafeAreaInsets();
  const { toggleFav, isFav } = useFav();

  // для fullscreen cover
  const [modalVisible, setModalVisible] = useState(false);

  // рейтинг
  const [rating, setRating] = useState(0);
  const RATING_KEY = `rating_${look.id}`;

  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  // загрузка сохранённого рейтинга
  useEffect(() => {
    AsyncStorage.getItem(RATING_KEY).then(val => {
      if (val) setRating(parseInt(val, 10));
    });
  }, []);

  // шарим лук
  const onShare = async () => {
    try {
      await Share.share({ message: `Check out this outfit: "${look.title}"!` });
    } catch (err) {
      console.warn(err);
    }
  };

  // копируем ссылку
  const onCopyLink = () => {
    const url = `https://myapp.com/outfit/${look.id}`;
    Clipboard.setString(url);
    Alert.alert('Copied!', 'Link copied to clipboard.');
  };

  // копируем детали (прим.: уже было)
  const onCopyDetails = () => {
    const desc = 
      `Outfit: ${look.title}\n` +
      `Season: ${look.season}\n` +
      `Styles: ${look.styles.join(', ')}\n` +
      `Body types: ${look.bodyTypes.join(', ')}`;
    Clipboard.setString(desc);
    Alert.alert('Copied!', 'Outfit details copied to clipboard.');
  };

  // сохраняем рейтинг
  const onRate = async (newRating) => {
    setRating(newRating);
    await AsyncStorage.setItem(RATING_KEY, newRating.toString());
    Alert.alert('Thank you!', `You rated this outfit ${newRating} star${newRating>1?'s':''}.`);
  };

  const toggleModal = () => setModalVisible(v => !v);

  const Tag = ({ text }) => (
    <View style={styles.tag}>
      <Text style={styles.tagText}>{text}</Text>
    </View>
  );

  const Attribute = ({ label, data }) => (
    <View style={styles.attributeRow}>
      <Text style={styles.attrLabel}>{label}:</Text>
      {data.map(t => <Tag key={t} text={t}/>)}
    </View>
  );

  return (
    <View style={styles.screen}>
      {/* HEADER */}
      <View style={[styles.header, { paddingTop: insets.top + 6 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={{top:10,left:10,bottom:10,right:10}}>
          <Image source={require('../assets/arrowback.png')} style={styles.backIcon}/>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Info</Text>
        <View style={styles.headerButtons}>
          <TouchableOpacity onPress={onShare}>
            <Image source={require('../assets/share.png')} style={styles.headerIcon}/>
          </TouchableOpacity>
          <TouchableOpacity onPress={onCopyLink} style={{ marginLeft: 16 }}>
            <Image source={require('../assets/copy.png')} style={styles.headerIcon}/>
          </TouchableOpacity>
         
        </View>
      </View>

      {/* FULLSCREEN COVER */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <TouchableWithoutFeedback onPress={toggleModal}>
          <View style={styles.modalOverlay}>
            <Image source={look.cover} style={styles.fullImage} />
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* COVER (кликабельна) */}
        <TouchableOpacity onPress={toggleModal} activeOpacity={0.8}>
          <Image source={look.cover} style={styles.cover}/>
        </TouchableOpacity>

        {/* TITLE + FAV */}
        <View style={styles.titleRow}>
          <Text style={styles.title}>{look.title}</Text>
          <TouchableOpacity onPress={() => toggleFav(look.id)}>
            <Image
              source={isFav(look.id)
                ? require('../assets/heart1.png')
                : require('../assets/heart.png')}
              style={styles.heart}
            />
          </TouchableOpacity>
        </View>

        {/* ATTRIBUTES */}
        <Attribute label="Fashion seasons" data={[look.season]} />
        <Attribute label="Clothing styles" data={look.styles} />
        <Attribute label="Body types" data={look.bodyTypes} />

        {/* RATING */}
        <View style={styles.ratingRow}>
          <Text style={styles.ratingText}>Your rating:</Text>
          {[1,2,3,4,5].map(i => (
            <TouchableOpacity key={i} onPress={() => onRate(i)}>
              <Image
                source={require('../assets/star.png')}
                style={[
                  styles.starIcon,
                  { tintColor: rating >= i ? VENETIAN_RED : dark }
                ]}
              />
            </TouchableOpacity>
          ))}
        </View>

        {/* GALLERY */}
        <Text style={styles.useTitle}>Use:</Text>
        <FlatList
          data={look.gallery}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(_,i) => i.toString()}
          contentContainerStyle={{ paddingHorizontal:16 }}
          renderItem={({item}) => (
            <Image source={item} style={styles.galleryImage}/>
          )}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen:        { flex:1, backgroundColor: STONE_BISQUE },

  header:        { flexDirection:'row', alignItems:'center', backgroundColor: CANAL_TEAL, paddingHorizontal:16, height:66, marginBottom:12 },
  backIcon:      { width:22, height:22, tintColor:STONE_BISQUE, resizeMode:'contain' },
  headerTitle:   { color:STONE_BISQUE, fontSize:22, fontWeight:'700', marginLeft:10 },
  headerButtons: { flexDirection:'row', marginLeft:'auto', marginRight:12 },
  headerIcon:    { width:24, height:24, tintColor:STONE_BISQUE, resizeMode:'contain' },

  modalOverlay:  { flex:1, backgroundColor:'rgba(0,0,0,0.8)', justifyContent:'center', alignItems:'center' },
  fullImage:     { width:'90%', height:'70%', borderRadius:20, resizeMode:'contain' },

  cover:         { width:'90%', alignSelf:'center', height:260, borderRadius:20, resizeMode:'cover' },

  titleRow:      { flexDirection:'row', alignItems:'center', justifyContent:'space-between', marginHorizontal:20, marginTop:18 },
  title:         { color:VENETIAN_RED, fontSize:20, fontWeight:'700' },
  heart:         { width:24, height:24, tintColor:VENETIAN_RED },

  attributeRow:  { flexDirection:'row', flexWrap:'wrap', alignItems:'center', marginHorizontal:20, marginTop:12 },
  attrLabel:     { color:VENETIAN_RED, marginRight:6, fontSize:14 },
  tag:           { borderWidth:1, borderColor:CANAL_TEAL, borderRadius:14, paddingVertical:3, paddingHorizontal:10, marginRight:6, marginTop:6 },
  tagText:       { color:CANAL_TEAL, fontSize:12, fontWeight:'500' },

  ratingRow:     { flexDirection:'row', alignItems:'center', marginHorizontal:20, marginTop:20 },
  ratingText:    { color:VENETIAN_RED, fontSize:16, fontWeight:'600', marginRight:10 },
  starIcon:      { width:28, height:28, marginRight:6 },

  useTitle:      { color:VENETIAN_RED, fontSize:22, fontWeight:'700', marginHorizontal:20, marginTop:24, marginBottom:12 },
  galleryImage:  { width:125, height:125, borderRadius:18, resizeMode:'cover', marginRight:12 },
});
