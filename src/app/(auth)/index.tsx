import { Link } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export default function WelcomeScreen() {
  return (
    <SafeAreaView className="flex-1 bg-brand-950 px-6">
      <View className="absolute -right-24 -top-20 h-72 w-72 rounded-full bg-brand-800 opacity-70" />
      <View className="absolute -left-24 bottom-20 h-52 w-52 rounded-full bg-brand-900" />
      <View className="flex-1 justify-center">
        <View className="mb-8 h-16 w-16 items-center justify-center rounded-3xl border border-brand-400 bg-brand-700 shadow-lg shadow-black/30">
          <Ionicons color="#d1fae5" name="search" size={30} />
        </View>
        <Text className="mb-3 text-5xl font-extrabold tracking-tight text-white">Acha Aqui</Text>
        <Text className="mb-10 max-w-xs text-lg leading-7 text-brand-100">
          Descubra serviços e empresas confiáveis perto de você.
        </Text>

        <Link asChild href="/sign-in">
          <Pressable className="flex-row items-center justify-center gap-2 rounded-2xl bg-brand-400 px-4 py-4 shadow-lg shadow-black/30 active:bg-brand-300">
            <Text className="text-center text-base font-bold text-brand-950">Entrar</Text>
            <Ionicons color="#022c22" name="arrow-forward" size={19} />
          </Pressable>
        </Link>

        <Link asChild href="/signup">
          <Pressable className="mt-3 rounded-2xl border border-brand-700 bg-brand-900/60 px-4 py-4 active:bg-brand-800">
            <Text className="text-center text-base font-bold text-brand-100">Criar uma conta</Text>
          </Pressable>
        </Link>
      </View>
      <Text className="pb-2 text-center text-xs font-medium tracking-wide text-brand-300">PESQUISE • COMPARE • ENCONTRE</Text>
    </SafeAreaView>
  );
}
