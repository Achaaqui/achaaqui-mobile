import { Link } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

export default function WelcomeScreen() {
  return (
    <View className="flex-1 justify-center bg-brand-950 px-6">
      <Text className="mb-3 text-4xl font-bold text-white">Acha Aqui</Text>
      <Text className="mb-10 text-lg leading-7 text-brand-200">
        Encontre o que precisa perto de você.
      </Text>

      <Link asChild href="/sign-in">
        <Pressable className="rounded-xl bg-brand-500 px-4 py-4 active:bg-brand-400">
          <Text className="text-center text-base font-bold text-brand-950">Entrar</Text>
        </Pressable>
      </Link>

      <Link asChild href="/signup">
        <Pressable className="mt-3 rounded-xl border border-brand-300 px-4 py-4 active:bg-brand-900">
          <Text className="text-center text-base font-bold text-brand-100">Criar uma conta</Text>
        </Pressable>
      </Link>
    </View>
  );
}
