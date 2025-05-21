// src/Components/OutfitDetailScreen.js
import React, { useLayoutEffect } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useFav } from '../Components/FavoritesContext'; 
export default function OutfitDetailScreen({ route, navigation }) {
  const { look } = route.params;
  const insets   = useSafeAreaInsets();
  const { toggleFav, isFav } = useFav();
  
  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

 
  const Tag = ({ text }) => (
    <View style={styles.tag}>
      <Text style={styles.tagText}>{text}</Text>
    </View>
  );

  const Attribute = ({ label, data }) => (
    <View style={styles.attributeRow}>
      <Text style={styles.attrLabel}>{label}:</Text>
      {data.map((t) => (
        <Tag key={t} text={t} />
      ))}
    </View>
  );

  return (
    <View style={styles.screen}>
    
      <View style={[styles.header, { paddingTop: insets.top + 6 }]}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Image
            source={require('../assets/arrowback.png')}
            style={styles.backIcon}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Info</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
       
        <Image source={look.cover} style={styles.cover} />

       
        <View style={styles.titleRow}>
          <Text style={styles.title}>{look.title}</Text>
          <TouchableOpacity onPress={() => toggleFav(look.id)}>
   <Image
     source={
       isFav(look.id)
         ? require('../assets/heart1.png')   
         : require('../assets/heart.png')    
     }
     style={styles.heart}
   />
 </TouchableOpacity>
        </View>

       
        <Attribute label="Fashion seasons" data={[look.season]} />
        <Attribute label="Clothing styles" data={look.styles} />
        <Attribute label="Body types" data={look.bodyTypes} />

       
        <Text style={styles.useTitle}>Use:</Text>
        <FlatList
          data={look.gallery}
          horizontal
          keyExtractor={(uri, idx) => idx.toString()}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16 }}
          renderItem={({ item }) => (
            <Image source={item} style={styles.galleryImage} />
          )}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#0D0D0D' },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#272727',
    paddingHorizontal: 16,
    height: 66,
    marginBottom: 12,
  },
  backIcon: { width: 22, height: 22, tintColor: '#fff' , resizeMode:'contain'},
  headerTitle: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '700',
    marginLeft: 10,
  },

  cover: {
    width: '90%',
    alignSelf: 'center',
    height: 260,
    borderRadius: 20,
    resizeMode: 'cover',
  },

  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    marginTop: 18,
  },
  title: { color: '#fff', fontSize: 20, fontWeight: '700' },
  heart: { width: 24, height: 24, tintColor: '#D14B4B' },

  attributeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    marginHorizontal: 20,
    marginTop: 12,
  },
  attrLabel: {
    color: '#bbb',
    marginRight: 6,
    fontSize: 14,
  },
  tag: {
    borderWidth: 1,
    borderColor: '#FFDF5F',
    borderRadius: 14,
    paddingVertical: 3,
    paddingHorizontal: 10,
    marginRight: 6,
    marginTop: 6,
  },
  tagText: { color: '#fff', fontSize: 12, fontWeight: '500' },

  useTitle: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '700',
    marginHorizontal: 20,
    marginTop: 24,
    marginBottom: 12,
  },
  galleryImage: {
    width: 125,
    height: 125,
    borderRadius: 18,
    resizeMode: 'cover',
    marginRight: 12,
  },
});
