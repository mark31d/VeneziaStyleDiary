// src/Components/SettingsScreen.js
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

/* ─── Venetian palette ─── */
const VENETIAN_RED  = '#C80815';
const CANAL_TEAL    = '#007073';
const STONE_BISQUE  = '#E5C8A9';

/* ─── universal handler ─── */
const showSoonAlert = () =>
  Alert.alert('Coming Soon', 'This feature will be available in the app soon!');

/* ─── list row ─── */
const Row = ({ title, onPress }) => (
  <TouchableOpacity style={styles.row} onPress={onPress} activeOpacity={0.7}>
    <Text style={styles.rowText}>{title}</Text>
    <Text style={styles.chevron}>›</Text>
  </TouchableOpacity>
);

export default function SettingsScreen({ navigation }) {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.screen}>
      {/* ─── Back + title ─── */}
      <View style={[styles.header, { paddingTop: insets.top + 6 }]}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Image
            source={require('../assets/arrowback.png')}
            style={styles.backIcon}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
      </View>

      {/* ─── List ─── */}
      <View style={styles.container}>
        <Row title="Terms of Use"         onPress={showSoonAlert} />
        <Row title="Privacy Policy"       onPress={showSoonAlert} />
        <Row title="About the Developers" onPress={showSoonAlert} />

        <Text style={styles.version}>Application version: 1.0</Text>
      </View>
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
    marginBottom: 12,
  },
  backBtn: {
    marginRight: 8,
  },
  backIcon: {
    width: 22,
    height: 22,
    tintColor: STONE_BISQUE,
    resizeMode: 'contain',
    marginBottom:10,
  },
  headerTitle: {
    color: STONE_BISQUE,
    fontSize: 22,
    fontWeight: '700',
    marginBottom:10,
   
  },

  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderColor: CANAL_TEAL,
  },
  rowText: {
    color: CANAL_TEAL,
    fontSize: 16,
  },
  chevron: {
    color: CANAL_TEAL,
    fontSize: 18,
  },
  version: {
    color: VENETIAN_RED,
    textAlign: 'center',
    marginTop: 40,
  },
});
