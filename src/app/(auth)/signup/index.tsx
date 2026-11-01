import { zodResolver } from '@hookform/resolvers/zod';
import { Pressable, Text, TextInput, View } from 'react-native';
import { Link, router } from 'expo-router';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

import { useSignupMutation } from '@/hooks/auth';
import type { SignupRequest } from '@/types/api';

const signupSchema = z.object({
  username: z
    .string()
    .min(3, 'O nome de usuário deve ter ao menos 3 caracteres.')
    .max(100, 'O nome de usuário é muito longo.')
    .regex(/^[a-zA-Z0-9_.-]+$/, 'Use apenas letras, números, ponto, hífen ou _.') ,
  email: z.string().email('Informe um e-mail válido.'),
  password: z.string().min(8, 'A senha deve ter ao menos 8 caracteres.'),
});

export default function SignupScreen() {
  const {
    mutateAsync: signup,
    isPending: isSigningUp,
  } = useSignupMutation();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupRequest>({
    defaultValues: { username: '', email: '', password: '' },
    resolver: zodResolver(signupSchema),
  });

  async function handleSignup({ username, email, password }: SignupRequest) {
    try {
      await signup({ username, email, password });
      router.replace('/conversations');
    } catch {
      // The mutation error is rendered below.
    }
  }

  return (
    <View className="flex-1 justify-center bg-brand-950 px-6">
      <Text className="mb-2 text-4xl font-bold text-white">Criar conta</Text>
      <Text className="mb-8 text-base text-brand-200">Comece a encontrar coisas por aqui.</Text>

      <Controller
        control={control}
        name="username"
        render={({ field: { onBlur, onChange, value } }) => (
          <TextInput
            autoCapitalize="none"
            className="mb-1 rounded-xl bg-white px-4 py-4 text-base text-brand-950"
            onBlur={onBlur}
            onChangeText={onChange}
            placeholder="Nome de usuário"
            placeholderTextColor="#6b7280"
            value={value}
          />
        )}
      />
      {errors.username ? <Text className="mb-3 text-sm text-red-200">{errors.username.message}</Text> : null}
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
            autoComplete="password-new"
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
        disabled={isSigningUp}
        onPress={() => {
          void handleSubmit(handleSignup)();
        }}>
        <Text className="text-center text-base font-bold text-brand-950">
          {isSigningUp ? 'Criando...' : 'Cadastrar'}
        </Text>
      </Pressable>
      <Link className="mt-6 text-center text-brand-200" href="/sign-in">
        Já tenho uma conta
      </Link>
    </View>
  );
}
