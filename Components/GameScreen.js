// src/screens/GameScreen.js
import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, Image, TouchableOpacity,
  FlatList, Dimensions, ScrollView, Share,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useGame } from '../Components/GameContext';

const BG   = require('../assets/bg_blur.png');
const LOGO = require('../assets/start.png');
const PLAY = require('../assets/play.png');
const BACK = require('../assets/arrowback.png');

const { width } = Dimensions.get('window');
const GRID = (width - 64) / 3;

/* ─── Venetian palette ─── */
const VENETIAN_RED = '#C80815';
const CANAL_TEAL   = '#007073';
const STONE_BISQUE = '#E5C8A9';

export default function GameScreen() {
  const insets = useSafeAreaInsets();
  const {
    data, round, chosen, percent,
    startGame, toggleImg, finishRound, next, reset,
  } = useGame();

  const [timeLeft, setTimeLeft]     = useState(15);
  const [timedOut, setTimedOut]     = useState(false);
  const [gridOrder, setGridOrder]   = useState([]);
  const [shuffleUsed, setShuffleUsed] = useState(false);

  const imgs = data[round] || [];

  // Сброс сетки и таймера при старте раунда
  useEffect(() => {
    if (round >= 0 && percent === null) {
      setTimeLeft(15);
      setTimedOut(false);
      setShuffleUsed(false);
      setGridOrder(imgs.map((_,i) => i));
    }
  }, [round]);

  // Запуск таймера
  useEffect(() => {
    if (round >= 0 && percent === null && !timedOut) {
      const id = setInterval(() => {
        setTimeLeft(t => {
          if (t <= 1) {
            clearInterval(id);
            setTimedOut(true);
            return 0;
          }
          return t - 1;
        });
      }, 1000);
      return () => clearInterval(id);
    }
  }, [round, timedOut]);

  // Шаринг результата
  const onShareResult = async () => {
    try {
      await Share.share({
        message: `I got ${percent}% of users choosing the same photos on Look #${round+1}!`,
      });
    } catch (e) {
      console.warn(e);
    }
  };

  // Перемешать порядок (раз в раунд)
  const onShuffle = () => {
    const shuffled = [...gridOrder].sort(() => Math.random() - 0.5);
    setGridOrder(shuffled);
    setShuffleUsed(true);
  };

  // ───── стартовый экран ─────
  if (round === -1) {
    return (
      <View style={g.screen}>
        <Image source={LOGO} style={g.bg} />
        <Image source={LOGO} style={g.logo} resizeMode="contain" />
        <TouchableOpacity style={g.playHit} onPress={startGame}>
          <Image source={PLAY} style={g.playIcon}/>
        </TouchableOpacity>
      </View>
    );
  }

  // ───── итоговый экран ─────
  if (round === 'end') {
    return (
      <View style={g.screen}>
        <Image source={BG} style={g.bg} blurRadius={8}/>
        <Text style={g.msg}>
          Thanks for playing!{'\n'}We hope you were inspired{'\n'}and had a great time!
        </Text>
        <TouchableOpacity style={[g.bottomBtnWrap, { bottom: 24 + insets.bottom }]} onPress={reset}>
          <LinearGradient
            colors={[VENETIAN_RED, CANAL_TEAL]}
            start={{x:0,y:0}} end={{x:1,y:0}}
            style={g.bottomBtn}
          >
            <Text style={g.bottomTxt}>Try again</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    );
  }

  // ───── выбор фотографий & табличка при таймауте ─────
  if (percent === null) {
    // Таблица «время вышло»
    if (timedOut) {
      return (
        <ScrollView style={g.screen} contentContainerStyle={{ padding:40 }}>
          <Text style={g.lookTitle}>Time’s up! 🚫</Text>
          <View style={g.table}>
            {gridOrder.map(idx => (
              <View style={g.row} key={idx}>
                <Image source={imgs[idx]} style={g.thumb} />
                <Text style={g.status}>
                  {chosen.includes(idx) ? '✓ Selected' : '✗ Missed'}
                </Text>
              </View>
            ))}
          </View>
          <TouchableOpacity style={[g.bottomBtnWrap,{ marginTop:20 }]} onPress={finishRound}>
            <LinearGradient
              colors={[VENETIAN_RED, CANAL_TEAL]}
              start={{x:0,y:0}} end={{x:1,y:0}}
              style={g.bottomBtn}
            >
              <Text style={g.bottomTxt}>View Results</Text>
            </LinearGradient>
          </TouchableOpacity>
        </ScrollView>
      );
    }

    // Экран выбора до таймаута
    return (
      <View style={g.screen}>
        <Image source={BG} style={g.bg} blurRadius={8}/>

        {/* Header */}
        <View style={[g.topRow,{ paddingTop: insets.top + 10 }]}>
          <TouchableOpacity onPress={reset} hitSlop={{top:12,left:12,bottom:12,right:12}}>
            <Image source={BACK} style={g.back}/>
          </TouchableOpacity>
          <Text style={g.counter}>{round+1}/{data.length}</Text>
        </View>

        <ScrollView contentContainerStyle={{ paddingBottom:140 }} showsVerticalScrollIndicator={false}>
          <Text style={g.lookTitle}>Look №{round+1}</Text>

          {/* Контейнер таймера */}
          <View style={g.timerContainer}>
            <Text style={g.timerTxt}>{timeLeft}s</Text>
          </View>

          {/* Баннер инструкции */}
          <View style={g.banner}>
            <Text style={g.bannerTxt}>
              Select the photos you want{'\n'}to create an outfit
            </Text>
          </View>

          {/* Кнопка перемешать */}
          {!shuffleUsed && (
            <TouchableOpacity style={g.shuffleBtnWrap} onPress={onShuffle}>
              <LinearGradient
                colors={[CANAL_TEAL, VENETIAN_RED]}
                start={{x:0,y:0}} end={{x:1,y:0}}
                style={g.shuffleBtn}
              >
                <Text style={g.shuffleTxt}>Shuffle</Text>
              </LinearGradient>
            </TouchableOpacity>
          )}

          {/* Сетка фото */}
          <FlatList
            data={gridOrder}
            keyExtractor={i=>String(i)}
            numColumns={3}
            contentContainerStyle={{ paddingHorizontal:16, marginTop:18 }}
            columnWrapperStyle={{ justifyContent:'space-between', marginBottom:12 }}
            renderItem={({ item: idx }) => (
              <TouchableOpacity activeOpacity={0.8} onPress={()=>toggleImg(idx)}>
                <Image
                  source={imgs[idx]}
                  style={[g.gridImg, chosen.includes(idx) && g.gridSel]}
                />
              </TouchableOpacity>
            )}
            scrollEnabled={false}
          />
        </ScrollView>

        <TouchableOpacity
          style={[g.bottomBtnWrap,{ bottom:24+insets.bottom }]}
          onPress={finishRound}
          disabled={!chosen.length}
        >
          <LinearGradient
            colors={[VENETIAN_RED, CANAL_TEAL]}
            start={{x:0,y:0}} end={{x:1,y:0}}
            style={g.bottomBtn}
          >
            <Text style={g.bottomTxt}>Collect</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    );
  }

  // ───── экран результата ─────
  return (
    <View style={g.screen}>
      <Image source={BG} style={g.bg} blurRadius={8}/>

      <View style={[g.topRow,{ paddingTop: insets.top + 4 }]}>
        <TouchableOpacity onPress={reset} hitSlop={{top:12,left:12,bottom:12,right:12}}>
          <Image source={BACK} style={g.back}/>
        </TouchableOpacity>
        <Text style={g.counter}>{round+1}/{data.length}</Text>
      </View>

      <Text style={[g.lookTitle,{ marginTop:60 }]}>Look №{round+1}</Text>

      <View style={g.resultBox}>
        <Text style={g.resultTxt}>
          This image was chosen by{'\n'}{percent}% of users
        </Text>
      </View>

      {/* Share */}
      <TouchableOpacity
        style={[g.bottomBtnWrap,{ bottom:100+insets.bottom }]}
        onPress={onShareResult}
      >
        <LinearGradient
          colors={[CANAL_TEAL, VENETIAN_RED]}
          start={{x:0,y:0}} end={{x:1,y:0}}
          style={g.bottomBtn}
        >
          <Text style={g.bottomTxt}>Share</Text>
        </LinearGradient>
      </TouchableOpacity>

      <TouchableOpacity
        style={[g.bottomBtnWrap,{ bottom:24+insets.bottom }]}
        onPress={next}
      >
        <LinearGradient
          colors={[VENETIAN_RED, CANAL_TEAL]}
          start={{x:0,y:0}} end={{x:1,y:0}}
          style={g.bottomBtn}
        >
          <Text style={g.bottomTxt}>Next</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
}

const g = StyleSheet.create({
  screen:        { flex:1, backgroundColor: STONE_BISQUE },
 
bg:{...StyleSheet.absoluteFillObject,width:'100%',height:'100%'},
  topRow:        { position:'absolute', left:16, right:16, flexDirection:'row', justifyContent:'space-between', zIndex:10, elevation:10 },
  back:          { width:22, height:22, tintColor: CANAL_TEAL, resizeMode:'contain' },
  counter:       { color: CANAL_TEAL, fontSize:16, fontWeight:'600' },

  lookTitle:     { color: CANAL_TEAL, fontSize:24, fontWeight:'700', textAlign:'center', marginTop:40 },

  timerContainer:{ alignSelf:'center', marginTop:8, paddingHorizontal:12, paddingVertical:4,
                   borderRadius:12, borderWidth:2, borderColor:VENETIAN_RED },
  timerTxt:      { color: VENETIAN_RED, fontSize:16, fontWeight:'600' },

  banner:        { backgroundColor: VENETIAN_RED, borderRadius:8, alignSelf:'center',
                   paddingVertical:12, paddingHorizontal:16, marginTop:18 },
  bannerTxt:     { color: STONE_BISQUE, fontSize:16, fontWeight:'700', textAlign:'center' },

  shuffleBtnWrap:{ alignSelf:'center', marginTop:12 },
  shuffleBtn:    { width:120, height:40, borderRadius:20, justifyContent:'center', alignItems:'center' },
  shuffleTxt:    { color: STONE_BISQUE, fontSize:16, fontWeight:'600' },

  gridImg:       { width:GRID, height:GRID, borderRadius:6 },
  gridSel:       { borderWidth:3, borderColor: VENETIAN_RED },

  table:         { marginTop:16, paddingHorizontal:20 },
  row:           { flexDirection:'row', alignItems:'center', marginBottom:12 },
  thumb:         { width:GRID, height:GRID, borderRadius:6, marginRight:12 },
  status:        { fontSize:16, color:'#333' },

  bottomBtnWrap: { position:'absolute', alignSelf:'center' },
  bottomBtn:     { width: width-48, height:56, borderRadius:28, justifyContent:'center', alignItems:'center' ,  },
  bottomTxt:     { color: STONE_BISQUE, fontSize:18, fontWeight:'700' },

  resultBox:     { backgroundColor: CANAL_TEAL, borderRadius:8, alignSelf:'center', marginTop:120, paddingVertical:14, paddingHorizontal:18 },
  resultTxt:     { color: STONE_BISQUE, fontSize:18, fontWeight:'700', textAlign:'center' },

  msg:           { position:'absolute', alignSelf:'center', backgroundColor: CANAL_TEAL,
                   borderRadius:8, paddingVertical:14, paddingHorizontal:18,
                   color: STONE_BISQUE, fontSize:18, fontWeight:'700', textAlign:'center' },

  // стартовый экран
  logo:    { position:'absolute', top:'16%', alignSelf:'center', width:'80%' },
  playHit: { position:'absolute', bottom:'18%', alignSelf:'center' },
  playIcon:{ width:110, height:110, resizeMode:'contain', marginBottom:-90 },
});
