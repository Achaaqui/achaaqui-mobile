import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { Dimensions, Keyboard, KeyboardAvoidingView, Platform, Pressable, Text, TextInput, useWindowDimensions, View } from 'react-native';
import { Link, router } from 'expo-router';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { z } from 'zod';

import { useEmailAvailabilityMutation, useSignupMutation } from '@/hooks/auth';
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
  const { height: windowHeight } = useWindowDimensions();
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isEmailAvailable, setIsEmailAvailable] = useState<boolean | null>(null);
  const {
    mutateAsync: signup,
    isPending: isSigningUp,
  } = useSignupMutation();
  const {
    control,
    clearErrors,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<SignupRequest>({
    defaultValues: { username: '', email: '', password: '' },
    resolver: zodResolver(signupSchema),
  });
  const email = useWatch({ control, name: 'email' });
  const {
    mutateAsync: checkEmailAvailability,
    isPending: isCheckingEmail,
  } = useEmailAvailabilityMutation();

  async function handleSignup({ username, email, password }: SignupRequest) {
    if (isEmailAvailable === false) {
      setError('email', {
        type: 'email_exists',
        message: 'E-mail já está cadastrado.',
      });
      return;
    }

    try {
      await signup({ username, email, password });
      router.replace('/conversations');
    } catch {
      // The mutation error is rendered below.
    }
  }

  useEffect(() => {
    const normalizedEmail = email.trim().toLowerCase();
    if (!z.string().email().safeParse(normalizedEmail).success) {
      return;
    }

    let isCurrentRequest = true;
    const timeout = setTimeout(() => {
      void checkEmailAvailability(normalizedEmail)
        .then(({ available }) => {
          if (!isCurrentRequest) {
            return;
          }
          setIsEmailAvailable(available);
          if (available) {
            clearErrors('email');
            return;
          }
          setError('email', {
            type: 'email_exists',
            message: 'E-mail já está cadastrado.',
          });
        })
        .catch(() => {
          if (isCurrentRequest) {
            setIsEmailAvailable(null);
          }
        });
    }, 400);

    return () => {
      isCurrentRequest = false;
      clearTimeout(timeout);
    };
  }, [checkEmailAvailability, clearErrors, email, setError]);

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
      <View className="absolute -left-20 -top-20 h-56 w-56 rounded-full bg-brand-800 opacity-80" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1">
      <View className="flex-1 justify-center" style={{ transform: [{ translateY: -keyboardOffset }] }}>
      <View className="mb-7">
        <View className="mb-5 h-12 w-12 items-center justify-center rounded-2xl bg-brand-700">
          <Ionicons color="#d1fae5" name="person-add" size={22} />
        </View>
        <Text className="mb-2 text-4xl font-extrabold tracking-tight text-white">Criar conta</Text>
        <Text className="text-base leading-6 text-brand-200">Comece a encontrar o que precisa por aqui.</Text>
      </View>

      <View className="rounded-3xl bg-white p-5 shadow-lg shadow-black/30">
      <Text className="mb-2 text-sm font-bold text-brand-900">Nome de usuário</Text>
      <Controller
        control={control}
        name="username"
        render={({ field: { onBlur, onChange, value } }) => (
          <TextInput
            autoCapitalize="none"
            className="mb-1 rounded-2xl border border-brand-100 bg-brand-50 px-4 py-4 text-base text-brand-950"
            onBlur={onBlur}
            onChangeText={onChange}
            placeholder="Nome de usuário"
            placeholderTextColor="#6b7280"
            value={value}
          />
        )}
      />
      {errors.username ? <Text className="mb-3 text-sm text-red-600">{errors.username.message}</Text> : null}
      <Text className="mb-2 mt-3 text-sm font-bold text-brand-900">E-mail</Text>
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
            onChangeText={(value) => {
              setIsEmailAvailable(null);
              clearErrors('email');
              onChange(value);
            }}
            placeholder="E-mail"
            placeholderTextColor="#6b7280"
            value={value}
          />
        )}
      />
      {errors.email ? <Text className="mb-3 text-sm text-red-600">{errors.email.message}</Text> : null}
      {!errors.email && isCheckingEmail ? <Text className="mb-3 text-sm text-brand-600">Verificando e-mail...</Text> : null}
      {!errors.email && isEmailAvailable ? <Text className="mb-3 text-sm text-brand-600">E-mail disponível.</Text> : null}
      <Text className="mb-2 mt-3 text-sm font-bold text-brand-900">Senha</Text>
      <Controller
        control={control}
        name="password"
        render={({ field: { onBlur, onChange, value } }) => (
          <View className="relative">
            <TextInput
              autoComplete="password-new"
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
        disabled={isSigningUp}
        onPress={() => {
          void handleSubmit(handleSignup)();
        }}>
        <Text className="text-center text-base font-bold text-white">
          {isSigningUp ? 'Criando...' : 'Cadastrar'}
        </Text>
      </Pressable>
      </View>
      <View className="mt-6 flex-row justify-center">
        <Text className="text-sm text-brand-200">Já faz parte do Acha Aqui? </Text>
        <Link asChild href="/sign-in">
          <Pressable>
            <Text className="text-sm font-bold text-white">Entrar na minha conta</Text>
          </Pressable>
        </Link>
      </View>
      </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
