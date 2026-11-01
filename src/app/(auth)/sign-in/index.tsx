import { zodResolver } from '@hookform/resolvers/zod';
import { Pressable, Text, TextInput, View } from 'react-native';
import { Link, router } from 'expo-router';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

import { useLoginMutation } from '@/hooks/auth';
import type { LoginRequest } from '@/types/api';

const loginSchema = z.object({
  email: z.string().email('Informe um e-mail válido.'),
  password: z.string().min(1, 'Informe sua senha.'),
});

export default function LoginScreen() {
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

  return (
    <View className="flex-1 justify-center bg-brand-950 px-6">
      <Text className="mb-2 text-4xl font-bold text-white">Acha Aqui</Text>
      <Text className="mb-8 text-base text-brand-200">Entre para encontrar o que procura.</Text>

      <Controller
        control={control}
        name="email"
        render={({ field: { onBlur, onChange, value } }) => (
          <TextInput
            autoCapitalize="none"
            autoComplete="email"
            className="mb-1 rounded-xl bg-white px-4 py-4 text-base text-brand-950"
            keyboardType="email-address"
            onBlur={onBlur}
            onChangeText={onChange}
            placeholder="E-mail"
            placeholderTextColor="#6b7280"
            value={value}
          />
        )}
      />
      {errors.email ? <Text className="mb-3 text-sm text-red-200">{errors.email.message}</Text> : null}
      <Controller
        control={control}
        name="password"
        render={({ field: { onBlur, onChange, value } }) => (
          <TextInput
            autoComplete="password"
            className="mb-1 rounded-xl bg-white px-4 py-4 text-base text-brand-950"
            onBlur={onBlur}
            onChangeText={onChange}
            placeholder="Senha"
            placeholderTextColor="#6b7280"
            secureTextEntry
            value={value}
          />
        )}
      />
      {errors.password ? <Text className="mb-4 text-sm text-red-200">{errors.password.message}</Text> : null}
      <Pressable
        className="rounded-xl bg-brand-500 px-4 py-4 active:bg-brand-400"
        disabled={isLoggingIn}
        onPress={() => {
          void handleSubmit(handleLogin)();
        }}>
        <Text className="text-center text-base font-bold text-brand-950">
          {isLoggingIn ? 'Entrando...' : 'Entrar'}
        </Text>
      </Pressable>
      <Link className="mt-6 text-center text-brand-200" href="/signup">
        Criar uma conta
      </Link>
    </View>
  );
}
