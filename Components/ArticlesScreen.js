// src/screens/ArticlesScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Dimensions,
  TextInput,
  Modal,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useArticles } from '../Components/ArticlesContext';
import { launchImageLibrary } from 'react-native-image-picker';  // ← image picker

/* ─── Venetian palette ─── */
const VENETIAN_RED = '#C80815';
const CANAL_TEAL   = '#007073';
const STONE_BISQUE = '#E5C8A9';

/* ─── layout constants ─── */
const CARD_H  = 150;
const IMAGE_W = 130;
const RADIUS  = 22;
const SCR_W   = Dimensions.get('window').width;
const BTN_W   = SCR_W - IMAGE_W - 90;

export default function ArticlesScreen({ navigation }) {
  const insets             = useSafeAreaInsets();
  const { articles, addArticle } = useArticles();
  const [query, setQuery]        = useState('');
  const [showAdd, setShowAdd]    = useState(false);
  const [newTitle, setNewTitle]  = useState('');
  const [newContent, setNewContent] = useState('');
  const [newCover, setNewCover]  = useState(null);

  // filter articles by search query
  const filtered = articles.filter(a =>
    a.title.toLowerCase().includes(query.toLowerCase())
  );

  // launch image picker
  const pickCover = () => {
    launchImageLibrary(
      { mediaType: 'photo', quality: 0.8 },
      response => {
        if (response.assets && !response.didCancel && !response.errorCode) {
          setNewCover({ uri: response.assets[0].uri });
        }
      }
    );
  };

  // handle adding a new article
  const handleAdd = () => {
    if (!newTitle.trim() || !newContent.trim()) return;
    const id = Date.now().toString();
    addArticle({
      id,
      title: newTitle.trim(),
      content: newContent.trim(),
      cover: newCover
    });
    // reset
    setNewTitle('');
    setNewContent('');
    setNewCover(null);
    setShowAdd(false);
  };

  const Card = ({ item }) => (
    <View style={styles.card}>
      {item.cover && <Image source={item.cover} style={styles.cover} />}
      <View style={styles.cardContent}>
        <Text numberOfLines={3} style={styles.title}>{item.title}</Text>
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() =>
            navigation.navigate('ArticleDetail', { article: item })
          }
        >
          <LinearGradient
            colors={[VENETIAN_RED, STONE_BISQUE]}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
            style={styles.btn}
          >
            <Text style={styles.btnTxt}>Read more</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
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
        <Text style={styles.hTitle}>Useful Articles</Text>
        {/* FAB to add */}
        <TouchableOpacity style={styles.fab} onPress={() => setShowAdd(true)}>
          <Text style={styles.fabTxt}>＋</Text>
        </TouchableOpacity>
      </View>

      {/* SEARCH BAR */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search articles..."
          placeholderTextColor="#666"
          value={query}
          onChangeText={setQuery}
        />
      </View>

      {/* LIST */}
      <FlatList
        data={filtered}
        keyExtractor={a => a.id}
        renderItem={Card}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingVertical: 20 }}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyTxt}>No articles found.</Text>
          </View>
        }
      />

      {/* ADD ARTICLE MODAL */}
      <Modal visible={showAdd} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Article</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Title"
              placeholderTextColor="#888"
              value={newTitle}
              onChangeText={setNewTitle}
            />
            <TextInput
              style={[styles.modalInput, { height: 80 }]}
              placeholder="Content"
              placeholderTextColor="#888"
              value={newContent}
              onChangeText={setNewContent}
              multiline
            />
            <TouchableOpacity style={styles.coverPicker} onPress={pickCover}>
              {newCover
                ? <Image source={newCover} style={styles.pickedImage}/>
                : <Text style={styles.pickTxt}>Pick Cover Image</Text>}
            </TouchableOpacity>
            <View style={styles.modalActions}>
              <TouchableOpacity onPress={() => setShowAdd(false)}>
                <Text style={styles.cancelTxt}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleAdd}>
                <Text style={styles.addTxt}>Add</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: STONE_BISQUE,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: CANAL_TEAL,
    paddingHorizontal: 16,
    justifyContent: 'space-between',
  },
  hTitle: {
    color: STONE_BISQUE,
    fontSize: 26,
    fontWeight: '700',
  },
  fab: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: VENETIAN_RED,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fabTxt: {
    color: STONE_BISQUE,
    fontSize: 24,
    lineHeight: 24,
  },

  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    backgroundColor: STONE_BISQUE,
  },
  searchInput: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    height: 40,
    paddingHorizontal: 14,
    fontSize: 16,
    color: '#000',
  },

  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: RADIUS,
    padding: 14,
    marginHorizontal: 20,
    marginBottom: 22,
    elevation: 2,
  },
  cover: {
    width: IMAGE_W,
    height: CARD_H - 28,
    resizeMode: 'cover',
    borderRadius: RADIUS - 4,
    marginRight: 14,
  },
  cardContent: {
    flex: 1,
    justifyContent: 'space-between',
    height: CARD_H - 28,
  },
  title: {
    color: VENETIAN_RED,
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 22,
  },
  btn: {
    height: 38,
    width: BTN_W,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  btnTxt: {
    color: STONE_BISQUE,
    fontSize: 15,
    fontWeight: '600',
  },

  empty: {
    alignItems: 'center',
    marginTop: 50,
  },
  emptyTxt: {
    color: CANAL_TEAL,
    fontSize: 18,
    fontStyle: 'italic',
  },

  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: VENETIAN_RED,
    marginBottom: 12,
  },
  modalInput: {
    backgroundColor: '#EEE',
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 40,
    marginBottom: 10,
    color: '#000',
  },
  coverPicker: {
    height: 100,
    borderRadius: 8,
    backgroundColor: '#EEE',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  pickTxt: {
    color: '#666',
  },
  pickedImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  cancelTxt: {
    color: '#888',
    marginRight: 20,
    fontSize: 16,
  },
  addTxt: {
    color: CANAL_TEAL,
    fontSize: 16,
    fontWeight: '600',
  },
});
