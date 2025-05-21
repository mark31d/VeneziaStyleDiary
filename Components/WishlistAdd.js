import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import LinearGradient from 'react-native-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useWishlist } from '../Components/WishlistContext';         

/* доступные категории – можно расширять */
const CATEGORIES = ['Clothes', 'Shoes', 'Accessories'];

export default function WishlistAdd({ route, navigation }) {
  /* если пришли из вкладки “Bought”, сразу сохраняем в купленное */
  const { toPurchased = false } = route.params ?? {};
  const { addItem }   = useWishlist();

  const insets              = useSafeAreaInsets();
  const [cover, setCover]   = useState(null);     // URI картинки
  const [title, setTitle]   = useState('');
  const [price, setPrice]   = useState('');
  const [cat,   setCat]     = useState(null);     // выбранная категория

  /* ---------- открыть галерею ---------- */
  const pickImage = () =>
    launchImageLibrary(
      { mediaType: 'photo', quality: 0.8 },
      res => {
        if (res.didCancel) return;
        if (res.errorCode) {
          Alert.alert('Error', res.errorMessage || 'ImagePicker error');
          return;
        }
        const uri = res.assets?.[0]?.uri;
        if (uri) setCover(uri);
      },
    );

  /* ---------- сохранить ---------- */
  const save = () => {
    if (!title || !price || !cat) {
      Alert.alert('Please fill all the fields');
      return;
    }
    addItem({ cover, title, price, category: cat }, toPurchased);
    navigation.goBack();
  };

  /* ---------- UI ---------- */
  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
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
            style={styles.backIcon}
          />
        </TouchableOpacity>
        <Text style={styles.hTitle}>New object</Text>
      </View>

      {/* Form */}
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        {/* Cover */}
        <Text style={styles.label}>Cover</Text>
        <TouchableOpacity style={ui.cover} onPress={pickImage}>
          {cover ? (
            <Image source={{ uri: cover }} style={ui.cover} />
          ) : (
            <Text style={ui.plus}>+</Text>
          )}
        </TouchableOpacity>

        {/* Title */}
        <Text style={styles.label}>Title</Text>
        <TextInput
          placeholder="Enter title"
          placeholderTextColor="#888"
          value={title}
          onChangeText={setTitle}
          style={ui.input}
        />

        {/* Price */}
        <Text style={styles.label}>Price</Text>
        <TextInput
          placeholder="Enter price"
          placeholderTextColor="#888"
          keyboardType="numeric"
          value={price}
          onChangeText={setPrice}
          style={ui.input}
        />

        {/* Category (чипы) */}
        <Text style={styles.label}>Category</Text>
        <View style={ui.chipRow}>
          {CATEGORIES.map(c => (
            <TouchableOpacity
              key={c}
              activeOpacity={0.8}
              onPress={() => setCat(cat === c ? null : c)}
              style={[
                chips.base,
                cat === c && chips.sel,
              ]}
            >
              <Text style={[chips.txt, cat === c && chips.selTxt]}>{c}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Save button */}
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={save}
        style={{ marginBottom: insets.bottom + 10 }}
      >
        <LinearGradient
          colors={['#FFDF5F', '#FFB84C']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={ui.btn}
        >
          <Text style={ui.btnTxt}>Continue</Text>
        </LinearGradient>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

/* ───────── STYLES ───────── */
const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#0D0D0D' },

  /* header */
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#272727',
    paddingHorizontal: 20,
  },
  hTitle:   { flex: 1, color: '#fff', fontSize: 26, fontWeight: '700', textAlign: 'center' },
  backIcon: { width: 22, height: 22, tintColor: '#fff', resizeMode: 'contain' },

  /* labels */
  label: { color: '#fff', fontSize: 14, marginBottom: 6, marginTop: 10 },
});

/* элементы формы */
const ui = StyleSheet.create({
  cover: {
    width: '100%',
    aspectRatio: 1.6,
    borderRadius: 18,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
    overflow: 'hidden',           // изображение точно не “вылезет” из рамок
  },
  plus: { fontSize: 36, color: '#FFCC3A' },

  input: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 48,
    color: '#000',
  },

  chipRow: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 6 },

  btn: {
    height: 56,
    borderRadius: 28,
    marginHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnTxt: { color: '#1A1A1A', fontSize: 18, fontWeight: '700' },
});

/* чипы */
const chips = StyleSheet.create({
  base: {
    borderRadius: 22,
    paddingVertical: 6,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: '#FFDF5F',
    marginRight: 10,
    marginBottom: 10,
  },
  sel: { backgroundColor: '#FFDF5F', borderWidth: 0 },
  txt: { color: '#fff', fontSize: 14 },
  selTxt: { color: '#1A1A1A', fontSize: 14, fontWeight: '600' },
});
