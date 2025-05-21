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

/* ─── styles ─── */
const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#0D0D0D' },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  backBtn: { marginRight: 8 },
  backIcon: { width: 22, height: 22, tintColor: '#fff', resizeMode: 'contain' },
  headerTitle: { color: '#fff', fontSize: 22, fontWeight: '700' },

  container: { flex: 1, paddingHorizontal: 16 },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderColor: '#333',
  },
  rowText: { color: '#fff', fontSize: 16 },
  chevron: { color: '#777', fontSize: 18 },
  version: { color: '#555', textAlign: 'center', marginTop: 40 },
});
