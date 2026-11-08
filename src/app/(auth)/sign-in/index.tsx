import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { Dimensions, Keyboard, KeyboardAvoidingView, Platform, Pressable, Text, TextInput, useWindowDimensions, View } from 'react-native';
import { Link, router } from 'expo-router';
import { Controller, useForm } from 'react-hook-form';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { z } from 'zod';

import { useLoginMutation } from '@/hooks/auth';
import type { LoginRequest } from '@/types/api';

const loginSchema = z.object({
  email: z.string().email('Informe um e-mail válido.'),
  password: z.string().min(1, 'Informe sua senha.'),
});

export default function LoginScreen() {
  const { height: windowHeight } = useWindowDimensions();
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const {
    mutateAsync: login,
    isPending: isLoggingIn,
  } = useLoginMutation();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginRequest>({
    defaultValues: { email: '', password: '' },
    resolver: zodResolver(loginSchema),
  });

  async function handleLogin({ email, password }: LoginRequest) {
    try {
      await login({ email, password });
      router.replace('/conversations');
    } catch {
      // The mutation error is rendered below.
    }
  }

  useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';
    const showSubscription = Keyboard.addListener(showEvent, (event) => setKeyboardHeight(event.endCoordinates.height));
    const hideSubscription = Keyboard.addListener(hideEvent, () => setKeyboardHeight(0));

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  const androidWindowWasResized = Dimensions.get('screen').height - windowHeight > 160;
  const keyboardOffset = Platform.OS === 'android' && !androidWindowWasResized
    ? Math.min(keyboardHeight * 0.58, 220)
    : 0;

  return (
    <SafeAreaView className="flex-1 bg-brand-950 px-6">
      <View className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-brand-800 opacity-70" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1">
      <View className="flex-1 justify-center" style={{ transform: [{ translateY: -keyboardOffset }] }}>
      <View className="mb-8">
        <View className="mb-5 h-12 w-12 items-center justify-center rounded-2xl bg-brand-700">
          <Ionicons color="#d1fae5" name="search" size={23} />
        </View>
        <Text className="mb-2 text-4xl font-extrabold tracking-tight text-white">Bem-vindo de volta</Text>
        <Text className="text-base leading-6 text-brand-200">Entre para continuar suas pesquisas.</Text>
      </View>

      <View className="rounded-3xl bg-white p-5 shadow-lg shadow-black/30">
      <Text className="mb-2 text-sm font-bold text-brand-900">E-mail</Text>
      <Controller
        control={control}
        name="email"
        render={({ field: { onBlur, onChange, value } }) => (
          <TextInput
            autoCapitalize="none"
            autoComplete="email"
            className="mb-1 rounded-2xl border border-brand-100 bg-brand-50 px-4 py-4 text-base text-brand-950"
            keyboardType="email-address"
            onBlur={onBlur}
            onChangeText={onChange}
            placeholder="E-mail"
            placeholderTextColor="#6b7280"
            value={value}
          />
        )}
      />
      {errors.email ? <Text className="mb-3 text-sm text-red-600">{errors.email.message}</Text> : null}
      <Text className="mb-2 mt-3 text-sm font-bold text-brand-900">Senha</Text>
      <Controller
        control={control}
        name="password"
        render={({ field: { onBlur, onChange, value } }) => (
          <View className="relative">
            <TextInput
              autoComplete="password"
              className="mb-1 rounded-2xl border border-brand-100 bg-brand-50 px-4 py-4 pr-12 text-base text-brand-950"
              onBlur={onBlur}
              onChangeText={onChange}
              placeholder="Senha"
              placeholderTextColor="#6b7280"
              secureTextEntry={!isPasswordVisible}
              value={value}
            />
            <Pressable
              accessibilityLabel={isPasswordVisible ? 'Ocultar senha' : 'Mostrar senha'}
              className="absolute inset-y-0 right-0 w-12 items-center justify-center"
              onPress={() => setIsPasswordVisible((currentValue) => !currentValue)}>
              <Ionicons color="#047857" name={isPasswordVisible ? 'eye-off-outline' : 'eye-outline'} size={21} />
            </Pressable>
          </View>
        )}
      />
      {errors.password ? <Text className="mb-4 text-sm text-red-600">{errors.password.message}</Text> : null}
      <Pressable
        className="mt-2 rounded-2xl bg-brand-600 px-4 py-4 active:bg-brand-500"
        disabled={isLoggingIn}
        onPress={() => {
          void handleSubmit(handleLogin)();
        }}>
        <Text className="text-center text-base font-bold text-white">
          {isLoggingIn ? 'Entrando...' : 'Entrar'}
        </Text>
      </Pressable>
      </View>
      <View className="mt-6 flex-row justify-center">
        <Text className="text-sm text-brand-200">Ainda não tem uma conta? </Text>
        <Link asChild href="/signup">
          <Pressable>
            <Text className="text-sm font-bold text-white">Criar minha conta</Text>
          </Pressable>
        </Link>
      </View>
      </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
