// src/components/CustomTabBar.js
import React, { useRef, useEffect } from 'react';
import {
  View,
  TouchableOpacity,
  Animated,
  StyleSheet,
  Image,
  Text,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';

/* ─── Venetian palette ─── */
const VENETIAN_RED  = '#C80815';
const CANAL_TEAL    = '#007073';
const STONE_BISQUE  = '#E5C8A9';

/* ───── constants ───── */
const { width }     = Dimensions.get('window');
const BG            = CANAL_TEAL;                // background of tab bar
const ACTIVE_CLR    = VENETIAN_RED;              // indicator line color
const INACTIVE_CLR  = STONE_BISQUE;              // inactive icon/text color
const GRADIENT      = [VENETIAN_RED, STONE_BISQUE]; // gradient for active icon/text

export default function CustomTabBar({ state, navigation }) {
  const insets     = useSafeAreaInsets();
  const TAB_WIDTH  = width / state.routes.length;
  const indicatorX = useRef(new Animated.Value(state.index)).current;

  useEffect(() => {
    Animated.timing(indicatorX, {
      toValue: state.index,
      duration: 230,
      useNativeDriver: true,
    }).start();
  }, [state.index]);

  const translateX = indicatorX.interpolate({
    inputRange: [0, state.routes.length - 1],
    outputRange: [0, TAB_WIDTH * (state.routes.length - 1)],
  });

  return (
    <View
      style={[
        styles.tabBar,
        { paddingBottom: insets.bottom, height: 80 + insets.bottom },
      ]}
    >
      {/* Indicator line below active tab */}
      <Animated.View
        style={[
          styles.line,
          {
            backgroundColor: ACTIVE_CLR,
            width: TAB_WIDTH,
            transform: [{ translateX }],
          },
        ]}
      />

      {/* Background pill under active tab */}
      <Animated.View
        style={[
          styles.activeBg,
          {
            width: TAB_WIDTH - 24,
            backgroundColor: STONE_BISQUE,
            transform: [
              {
                translateX: Animated.add(translateX, new Animated.Value(12)),
              },
            ],
          },
        ]}
      />

      {state.routes.map((route, index) => {
        const isFocused = state.index === index;

        let icon;
        switch (route.name) {
          case 'Looks':    icon = require('../assets/outfits.png');  break;
          case 'Wishlist': icon = require('../assets/wishlist.png'); break;
          case 'Articles': icon = require('../assets/articles.png'); break;
          case 'Quiz':     icon = require('../assets/quiz.png');     break;
          default:         icon = null;
        }

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
          });
          if (!event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <TouchableOpacity
            key={route.key}
            style={[styles.tabItem, { width: TAB_WIDTH }]}
            onPress={onPress}
            activeOpacity={0.8}
          >
            {/* Icon */}
            {icon && (
              isFocused ? (
                <MaskedView maskElement={<Image source={icon} style={styles.icon} />}>
                  <LinearGradient colors={GRADIENT} style={styles.icon} />
                </MaskedView>
              ) : (
                <Image source={icon} style={[styles.icon, { tintColor: INACTIVE_CLR }]} />
              )
            )}

            {/* Label using route.name */}
            {isFocused ? (
              <MaskedView
                maskElement={
                  <Text style={[styles.label, { color: 'black' }]}>
                    {route.name}
                  </Text>
                }
              >
                <LinearGradient colors={GRADIENT}>
                  <Text style={[styles.label, { opacity: 0 }]}>
                    {route.name}
                  </Text>
                </LinearGradient>
              </MaskedView>
            ) : (
              <Text style={[styles.label, { color: INACTIVE_CLR }]}>
                {route.name}
              </Text>
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    backgroundColor: BG,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#1A1A1A',
    alignItems: 'center',
  },
  line: {
    position: 'absolute',
    top: 0,
    height: 3,
  },
  activeBg: {
    position: 'absolute',
    top: 8,
    height: 56,
    borderRadius: 16,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 80,
  },
  icon: {
    width: 28,
    height: 28,
  },
  label: {
    fontSize: 12,
    marginTop: 6,
    fontWeight: '600',
  },
});
