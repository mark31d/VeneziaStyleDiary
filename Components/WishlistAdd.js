// src/screens/WishlistAdd.js
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
import DateTimePicker from '@react-native-community/datetimepicker';
import LinearGradient from 'react-native-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useWishlist } from '../Components/WishlistContext';

/* ─── Venetian palette ─── */
const VENETIAN_RED = '#C80815';
const CANAL_TEAL   = '#007073';
const STONE_BISQUE = '#E5C8A9';

/* доступные категории – можно расширять */
const CATEGORIES = ['Clothes', 'Shoes', 'Accessories'];
/* приоритет покупки */
const PRIORITIES = ['Low', 'Medium', 'High'];

export default function WishlistAdd({ route, navigation }) {
  const { toPurchased = false } = route.params ?? {};
  const { addItem }             = useWishlist();
  const insets                  = useSafeAreaInsets();

  const [cover, setCover]       = useState(null);
  const [title, setTitle]       = useState('');
  const [price, setPrice]       = useState('');
  const [cat, setCat]           = useState(null);
  const [priority, setPriority] = useState('Medium');
  const [deadline, setDeadline] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);

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

  const onChangeDeadline = (_, selectedDate) => {
    setShowPicker(false);
    if (selectedDate) setDeadline(selectedDate);
  };

  const save = () => {
    if (!title.trim() || !price.trim() || !cat) {
      Alert.alert('Заполните все поля, включая категорию');
      return;
    }
    const now = new Date().toISOString();
       addItem(
         {
           cover,
           title: title.trim(),
           price: price.trim(),
           category: cat,
           priority,
           date: now,              // ← передаём дату создания
         },
         toPurchased
       );
    navigation.goBack();
  };

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
        <Text style={styles.hTitle}>New item</Text>
      </View>

      {/* Form */}
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        {/* Cover */}
        <Text style={styles.label}>Cover</Text>
        <TouchableOpacity style={ui.cover} onPress={pickImage}>
          {cover
            ? <Image source={{ uri: cover }} style={ui.cover} />
            : <Text style={ui.plus}>＋</Text>
          }
        </TouchableOpacity>

        {/* Title */}
        <Text style={styles.label}>Title</Text>
        <TextInput
          placeholder="Enter title"
          placeholderTextColor={CANAL_TEAL}
          value={title}
          onChangeText={setTitle}
          style={ui.input}
        />

        {/* Price */}
        <Text style={styles.label}>Price</Text>
        <TextInput
          placeholder="Enter price"
          placeholderTextColor={CANAL_TEAL}
          keyboardType="numeric"
          value={price}
          onChangeText={setPrice}
          style={ui.input}
        />

        {/* Category */}
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

        {/* Priority */}
        <Text style={styles.label}>Priority</Text>
        <View style={ui.chipRow}>
          {PRIORITIES.map(p => (
            <TouchableOpacity
              key={p}
              activeOpacity={0.8}
              onPress={() => setPriority(p)}
              style={[
                priorityChips.base,
                priority === p && priorityChips.sel[p],
              ]}
            >
              <Text style={[
                priorityChips.txt,
                priority === p && priorityChips.selTxt[p]
              ]}>{p}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Deadline (новая фича) */}
        <Text style={styles.label}>Deadline</Text>
        <TouchableOpacity
          style={ui.deadlineContainer}
          onPress={() => setShowPicker(true)}
        >
          <Text style={ui.deadlineText}>
            {deadline.toLocaleDateString()}
          </Text>
        </TouchableOpacity>
        {showPicker && (
          <DateTimePicker
            value={deadline}
            mode="date"
            display="default"
            minimumDate={new Date()}
            onChange={onChangeDeadline}
          />
        )}
      </ScrollView>

      {/* Continue */}
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={save}
        style={{ marginBottom: insets.bottom + 10 }}
      >
        <LinearGradient
          colors={[CANAL_TEAL, VENETIAN_RED]}
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

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: STONE_BISQUE },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: CANAL_TEAL,
    paddingHorizontal: 20,
  },
  hTitle: {
    flex: 1,
    color: STONE_BISQUE,
    fontSize: 26,
    fontWeight: '700',
    textAlign: 'center',
  },
  backIcon: {
    width: 22,
    height: 22,
    tintColor: STONE_BISQUE,
    resizeMode: 'contain',
  },

  label: {
    color: VENETIAN_RED,
    fontSize: 14,
    marginBottom: 6,
    marginTop: 10,
    fontWeight: '600',
  },
});

const ui = StyleSheet.create({
  cover: {
    width: '100%',
    aspectRatio: 1.6,
    borderRadius: 18,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
    overflow: 'hidden',
  },
  plus: {
    fontSize: 36,
    color: VENETIAN_RED,
  },

  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: CANAL_TEAL,
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 48,
    color: '#000',
  },

  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 6,
  },

  deadlineContainer: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderColor: VENETIAN_RED,
    borderWidth: 1,
    alignSelf: 'flex-start',
    marginTop: 6,
  },
  deadlineText: {
    color: VENETIAN_RED,
    fontSize: 16,
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

const chips = StyleSheet.create({
  base: {
    borderRadius: 22,
    paddingVertical: 6,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: CANAL_TEAL,
    marginRight: 10,
    marginBottom: 10,
  },
  sel: {
    backgroundColor: CANAL_TEAL,
    borderColor: CANAL_TEAL,
  },
  txt: {
    color: VENETIAN_RED,
    fontSize: 14,
  },
  selTxt: {
    color: STONE_BISQUE,
    fontSize: 14,
    fontWeight: '600',
  },
});

const priorityChips = StyleSheet.create({
  base: {
    borderRadius: 22,
    paddingVertical: 6,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: CANAL_TEAL,
    marginRight: 10,
    marginBottom: 10,
  },
  sel: {       
    Low:    { backgroundColor: CANAL_TEAL, borderColor: CANAL_TEAL },
    Medium: { backgroundColor: "orange", borderColor:  "orange" },
    High:   { backgroundColor: VENETIAN_RED, borderColor: VENETIAN_RED },
  },
  txt: {
    color: CANAL_TEAL,
    fontSize: 14,
  },
  selTxt: {
    Low:    { color: STONE_BISQUE, fontSize: 14, fontWeight: '600' },
    Medium: { color: CANAL_TEAL, fontSize: 14, fontWeight: '600' },
    High:   { color: STONE_BISQUE, fontSize: 14, fontWeight: '600' },
  },
});
