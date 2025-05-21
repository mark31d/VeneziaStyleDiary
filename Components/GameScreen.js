// ──────────────────────────────────────────────────────────────
//  Collect an Outfit  – mini-game
//  (исправлена только кликабельность стрелки)
// ──────────────────────────────────────────────────────────────
import React from 'react';
import {
  View, Text, StyleSheet, Image, TouchableOpacity,
  FlatList, Dimensions, ScrollView,
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

export default function GameScreen() {
  const insets = useSafeAreaInsets();
  const {
    data, round, chosen, percent,
    startGame, toggleImg, finishRound, next, reset,
  } = useGame();

  /* ───── start screen (НЕ трогали) ───── */
  if (round === -1) {
    return (
      <View style={g.screen}>
        <Image source={require('../assets/start.png')} style={g.bg} />
        <Image source={LOGO} style={g.logo} resizeMode="contain" />
        <TouchableOpacity style={g.playHit} activeOpacity={0.85} onPress={startGame}>
          <Image source={PLAY} style={g.playIcon}/>
        </TouchableOpacity>
      </View>
    );
  }

  /* ───── финал ───── */
  if (round === 'end') {
    return (
      <View style={g.screen}>
        <Image source={BG} style={g.bg} blurRadius={8}/>
        <Text style={[g.msg,{top:'45%'}]}>
          Thanks for playing!{'\n'}We hope you were inspired{'\n'}and had a great time!
        </Text>

        <TouchableOpacity
          activeOpacity={0.85}
          onPress={reset}
          style={[g.bottomBtnWrap,{bottom:24+insets.bottom}]}>
          <LinearGradient colors={['#FFDF5F','#FFB84C']} style={g.bottomBtn}>
            <Text style={g.bottomTxt}>Try again</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    );
  }

  const imgs = data[round];

  /* ───── выбор фотографий ───── */
  if (percent === null) {
    return (
      <View style={g.screen}>
        <Image source={BG} style={g.bg} blurRadius={8}/>

        {/* top-bar */}
        <View style={[g.topRow,{paddingTop:insets.top+10}]}>
          <TouchableOpacity
            onPress={reset}
            hitSlop={{top:12,left:12,bottom:12,right:12}}   
          >
            <Image source={BACK} style={g.back}/>
          </TouchableOpacity>
          <Text style={g.counter}>{round+1}/{data.length}</Text>
        </View>

        <ScrollView contentContainerStyle={{paddingBottom:140}} showsVerticalScrollIndicator={false}>
          <Text style={g.lookTitle}>Look №{round+1}</Text>

          <View style={g.banner}>
            <Text style={g.bannerTxt}>
              Select the photos you{'\n'}want to use to create an{'\n'}outfit
            </Text>
          </View>

          <FlatList
            data={imgs}
            keyExtractor={(_,i)=>String(i)}
            numColumns={3}
            contentContainerStyle={{paddingHorizontal:16,marginTop:18}}
            columnWrapperStyle={{justifyContent:'space-between',marginBottom:12}}
            renderItem={({item,index})=>(
              <TouchableOpacity activeOpacity={0.8} onPress={()=>toggleImg(index)}>
                <Image source={item} style={[g.gridImg, chosen.includes(index)&&g.gridSel]}/>
              </TouchableOpacity>
            )}
            scrollEnabled={false}
          />
        </ScrollView>

        <TouchableOpacity
          activeOpacity={0.9}
          disabled={!chosen.length}
          onPress={finishRound}
          style={[g.bottomBtnWrap,{bottom:24+insets.bottom}]}>
          <LinearGradient colors={['#FFDF5F','#FFB84C']} style={g.bottomBtn}>
            <Text style={g.bottomTxt}>Collect</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    );
  }

  /* ───── экран результата ───── */
  return (
    <View style={g.screen}>
      <Image source={BG} style={g.bg} blurRadius={8}/>

      <View style={[g.topRow,{paddingTop:insets.top+4}]}>
        <TouchableOpacity
          onPress={reset}
          hitSlop={{top:12,left:12,bottom:12,right:12}}
        >
          <Image source={BACK} style={g.back}/>
        </TouchableOpacity>
        <Text style={g.counter}>{round+1}/{data.length}</Text>
      </View>

      <Text style={[g.lookTitle,{marginTop:60}]}>Look №{round+1}</Text>

      <View style={g.resultBox}>
        <Text style={g.resultTxt}>
          This image was{'\n'}chosen by {percent}% of{'\n'}users
        </Text>
      </View>

      <TouchableOpacity
        activeOpacity={0.9}
        onPress={next}
        style={[g.bottomBtnWrap,{bottom:24+insets.bottom}]}>
        <LinearGradient colors={['#FFDF5F','#FFB84C']} style={g.bottomBtn}>
          <Text style={g.bottomTxt}>Next</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
}

/* ────────── STYLES ────────── */
const g = StyleSheet.create({
  screen:{flex:1,backgroundColor:'#1A1A1A'},
  bg:{...StyleSheet.absoluteFillObject,width:'100%',height:'100%'},

  /* home (не изменяли) */
  logo:{position:'absolute',top:'16%',alignSelf:'center',width:'80%'},
  playHit:{position:'absolute',bottom:'18%',alignSelf:'center'},
  playIcon:{width:110,height:110,resizeMode:'contain',marginBottom:-90},

  /* top-bar: добавлены zIndex/elevation и ничего больше */
  topRow:{
    position:'absolute',
    left:16,
    right:16,
    flexDirection:'row',
    justifyContent:'space-between',
    zIndex:10,
    elevation:10,
  },
  back:{width:22,height:22,tintColor:'#fff',resizeMode:'contain'},
  counter:{color:'#fff',fontSize:16,fontWeight:'600'},

  lookTitle:{color:'#fff',fontSize:24,fontWeight:'700',textAlign:'center',marginTop:40},

  banner:{backgroundColor:'#FFCC3A',borderRadius:8,alignSelf:'center',
          paddingVertical:12,paddingHorizontal:16,marginTop:18},
  bannerTxt:{color:'#000',fontSize:16,fontWeight:'700',textAlign:'center'},

  gridImg:{width:GRID,height:GRID,borderRadius:6},
  gridSel:{borderWidth:3,borderColor:'#FFCC3A'},

  bottomBtnWrap:{position:'absolute',alignSelf:'center'},
  bottomBtn:{width:width-48,height:56,borderRadius:28,justifyContent:'center',alignItems:'center'},
  bottomTxt:{color:'#1A1A1A',fontSize:18,fontWeight:'700'},

  resultBox:{backgroundColor:'#FFCC3A',borderRadius:8,alignSelf:'center',
             marginTop:140,paddingVertical:14,paddingHorizontal:18},
  resultTxt:{color:'#000',fontSize:18,fontWeight:'700',textAlign:'center'},

  msg:{position:'absolute',alignSelf:'center',backgroundColor:'#FFCC3A',
       borderRadius:8,paddingVertical:14,paddingHorizontal:18,
       color:'#000',fontSize:18,fontWeight:'700',textAlign:'center'},
});
