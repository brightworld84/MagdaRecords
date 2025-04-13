import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
};

const suggestedPrompts = [
  'Summarize my last visit',
  'What medications am I on?',
  'Check for drug interactions',
  'Remind me of my appointments',
  'Give me a health overview',
];

// ⚠️ TEMPORARY: Replace this with your actual OpenAI API key
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || 'sk-...tWYA';

export default function AIAssistantScreen() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '0',
      role: 'assistant',
      content: 'Hello! I’m your AI health assistant. How can I help you today?',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    const newUserMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text.trim(),
    };

    setMessages((prev) => [...prev, newUserMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            { role: 'system', content: 'You are a helpful AI medical assistant.' },
            { role: 'user', content: text.trim() },
          ],
          max_tokens: 500,
        }),
      });

      const data = await response.json();

      if (data.choices && data.choices.length > 0) {
        const newAssistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: data.choices[0].message.content.trim(),
        };
        setMessages((prev) => [...prev, newAssistantMessage]);
      } else {
        throw new Error('No response from AI');
      }
    } catch (error: any) {
      const errorMessage: Message = {
        id: (Date.now() + 2).toString(),
        role: 'assistant',
        content: `Sorry, I couldn't reach OpenAI: ${error.message}`,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleVoiceInput = () => {
    Alert.alert('Voice input not yet implemented', 'Microphone input will be added soon.');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.select({ ios: 'padding', android: undefined })}
      keyboardVerticalOffset={80}
    >
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View
            style={[
              styles.messageBubble,
              item.role === 'user' ? styles.userBubble : styles.assistantBubble,
            ]}
          >
            <Text style={styles.messageText}>{item.content}</Text>
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 20 }}
      />

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.promptBar}>
        {suggestedPrompts.map((prompt, index) => (
          <TouchableOpacity
            key={index}
            style={styles.promptButton}
            onPress={() => sendMessage(prompt)}
          >
            <Text style={styles.promptText}>{prompt}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.inputRow}>
        <TouchableOpacity onPress={handleVoiceInput}>
          <Ionicons name="mic" size={28} color="#555" style={styles.micIcon} />
        </TouchableOpacity>
        <TextInput
          style={styles.input}
          placeholder="Ask a question..."
          value={input}
          onChangeText={setInput}
        />
        <Button title={loading ? '...' : 'Send'} onPress={() => sendMessage(input)} disabled={loading} />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15, backgroundColor: '#fff' },
  messageBubble: {
    padding: 10,
    marginVertical: 6,
    maxWidth: '80%',
    borderRadius: 10,
  },
  userBubble: {
    backgroundColor: '#DCF8C6',
    alignSelf: 'flex-end',
  },
  assistantBubble: {
    backgroundColor: '#E6E6E6',
    alignSelf: 'flex-start',
  },
  messageText: { fontSize: 16 },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingTop: 10,
  },
  input: {
    flex: 1,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
  },
  micIcon: {
    marginRight: 8,
  },
  promptBar: {
    marginTop: 10,
    marginBottom: 10,
  },
  promptButton: {
    backgroundColor: '#F0F0F0',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 14,
    marginRight: 10,
  },
  promptText: {
    fontSize: 14,
    color: '#333',
  },
});
