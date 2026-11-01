import AsyncStorage from '@react-native-async-storage/async-storage';

const CONVERSATION_ID_KEY = '@achaaqui:conversation-id';

function createUuid() {
  if (typeof globalThis.crypto?.randomUUID === 'function') {
    return globalThis.crypto.randomUUID();
  }

  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (character) => {
    const random = Math.floor(Math.random() * 16);
    const value = character === 'x' ? random : (random & 0x3) | 0x8;
    return value.toString(16);
  });
}

export async function getConversationId() {
  const storedId = await AsyncStorage.getItem(CONVERSATION_ID_KEY);
  if (storedId) {
    return storedId;
  }

  const conversationId = createUuid();
  await AsyncStorage.setItem(CONVERSATION_ID_KEY, conversationId);
  return conversationId;
}

export async function createConversationId() {
  const conversationId = createUuid();
  await AsyncStorage.setItem(CONVERSATION_ID_KEY, conversationId);
  return conversationId;
}

export async function setConversationId(conversationId: string) {
  await AsyncStorage.setItem(CONVERSATION_ID_KEY, conversationId);
}
