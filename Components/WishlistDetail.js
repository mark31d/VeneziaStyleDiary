// src/screens/WishlistDetail.js
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useWishlist } from '../Components/WishlistContext';

/* ─── Venetian palette ─── */
const VENETIAN_RED  = '#C80815';
const CANAL_TEAL    = '#007073';
const STONE_BISQUE  = '#E5C8A9';

/* ─── Chip ─── */
function Chip({ label, color = CANAL_TEAL, textColor = STONE_BISQUE }) {
  return (
    <View style={[chip.base, { backgroundColor: color }]}>
      <Text style={[chip.txt, { color: textColor }]}>{label}</Text>
    </View>
  );
}
const chip = StyleSheet.create({
  base: {
    borderRadius: 14,
    paddingVertical: 6,
    paddingHorizontal: 12,
    alignSelf: 'flex-start',
    marginRight: 8,
    marginTop: 6,
  },
  txt: {
    fontSize: 14,
    fontWeight: '600',
  },
});

/* ─── Screen ─── */
export default function WishlistDetail({ route, navigation }) {
  const { item } = route.params;
  const { markAsBought, markAsUnbought, removeItem } = useWishlist();
  const insets = useSafeAreaInsets();
  const bought = !!item.moved;

  const askDelete = () =>
    Alert.alert('Delete item?', '', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          removeItem(item.id, bought);
          navigation.goBack();
        },
      },
    ]);

  return (
    <View style={styles.screen}>
      {/* Header */}
      <View
        style={[
          styles.header,
          { paddingTop: insets.top + 6, height: 56 + insets.top },
        ]}
      >
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image
            source={require('../assets/arrowback.png')}
            style={styles.back}
          />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.hTitle}>Info</Text>
        </View>
        <TouchableOpacity onPress={askDelete}>
          <Image source={require('../assets/trash.png')} style={styles.trash} />
        </TouchableOpacity>
      </View>

      {/* Body */}
      <ScrollView showsVerticalScrollIndicator={false}>
        {item.cover ? (
          <Image source={{ uri: item.cover }} style={styles.cover} />
        ) : (
          <View style={[styles.cover, { backgroundColor: '#444' }]} />
        )}

        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.price}>Price: ${item.price}</Text>
        {item.date && (
     <>
       <Text style={styles.dateLabel}>Added on:</Text>
      <Text style={styles.dateValue}>
         {new Date(item.date).toLocaleDateString()} {' '}
         {new Date(item.date).toLocaleTimeString()}
       </Text>
     </>
   )}
        {/* Category */}
        <View style={styles.attrRow}>
          <Text style={styles.attrLabel}>Category:</Text>
          <Chip label={item.category} color={CANAL_TEAL} textColor={STONE_BISQUE} />
        </View>

        {/* Priority */}
        <View style={styles.attrRow}>
          <Text style={styles.attrLabel}>Priority:</Text>
          {/* Цвет в зависимости от приоритета */}
          {item.priority === 'High' && <Chip label="High" color={VENETIAN_RED} />}
          {item.priority === 'Medium' && <Chip label="Medium" color={STONE_BISQUE} textColor={CANAL_TEAL} />}
          {item.priority === 'Low' && <Chip label="Low" color="#CCC" textColor="#000" />}
        </View>
      </ScrollView>

      {/* CTA Button */}
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => {
          bought
            ? markAsUnbought(item.id)
            : markAsBought(item.id);
          navigation.goBack();
        }}
        style={{ marginBottom: insets.bottom + 12 }}
      >
        {bought ? (
          <View style={[styles.btn, { backgroundColor: CANAL_TEAL }]}>
            <Text style={[styles.btnTxt, { color: STONE_BISQUE }]}>
              Not purchased
            </Text>
          </View>
        ) : (
          <LinearGradient
            colors={[VENETIAN_RED, CANAL_TEAL]}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
            style={styles.btn}
          >
            <Text style={styles.btnTxt}>Bought</Text>
          </LinearGradient>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
    dateLabel: {
           color: CANAL_TEAL,
           fontSize: 14,
           marginHorizontal: 20,
           marginTop: 12,
           fontWeight: '600',
         },
         dateValue: {
           color: '#555',
           fontSize: 14,
           marginHorizontal: 20,
           marginTop: 4,
         },
  screen: {
    flex: 1,
    backgroundColor: STONE_BISQUE,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: CANAL_TEAL,
    paddingHorizontal: 16,
  },
  back: {
    width: 22,
    height: 22,
    tintColor: STONE_BISQUE,
    resizeMode: 'contain',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  hTitle: {
    color: STONE_BISQUE,
    fontSize: 22,
    fontWeight: '700',
  },
  trash: {
    width: 22,
    height: 22,
    tintColor: STONE_BISQUE,
    resizeMode: 'contain',
  },

  cover: {
    width: '90%',
    height: 260,
    borderRadius: 20,
    alignSelf: 'center',
    marginTop: 16,
    resizeMode: 'cover',
  },
  title: {
    color: VENETIAN_RED,
    fontSize: 20,
    fontWeight: '700',
    marginHorizontal: 20,
    marginTop: 16,
  },
  price: {
    color: CANAL_TEAL,
    fontSize: 16,
    marginHorizontal: 20,
    marginTop: 8,
  },

  attrRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginTop: 10,
  },
  attrLabel: {
    color: CANAL_TEAL,
    marginRight: 6,
    fontSize: 14,
    fontWeight: '600',
  },

  btn: {
    height: 56,
    borderRadius: 28,
    marginHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnTxt: {
    color: STONE_BISQUE,
    fontSize: 18,
    fontWeight: '700',
  },
});
