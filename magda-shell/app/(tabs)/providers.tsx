import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Pressable,
  Modal,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import uuid from 'react-native-uuid';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Provider = {
  id: string;
  name: string;
  specialty: string;
  address: string;
  phone: string;
  email: string;
  fax: string;
  notes: string;
};

export default function ProvidersScreen() {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [form, setForm] = useState<Omit<Provider, 'id'>>({
    name: '',
    specialty: '',
    address: '',
    phone: '',
    email: '',
    fax: '',
    notes: '',
  });
  const insets = useSafeAreaInsets();

  const handleSubmit = () => {
    const newProvider: Provider = {
      id: uuid.v4().toString(),
      ...form,
    };
    setProviders(prev => [...prev, newProvider]);
    setModalVisible(false);
    setForm({
      name: '',
      specialty: '',
      address: '',
      phone: '',
      email: '',
      fax: '',
      notes: '',
    });
  };

  const handleDelete = (id: string) => {
    setProviders(prev => prev.filter(p => p.id !== id));
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Providers</Text>
        <Pressable
          onPress={() => setModalVisible(true)}
          style={styles.addButton}>
          <Ionicons name="add-circle" size={28} color="#2e86de" />
          <Text style={styles.addButtonText}>Add Provider / Facility</Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {providers.map(provider => (
          <Pressable key={provider.id} style={styles.card}>
            <Text style={styles.cardTitle}>{provider.name}</Text>
            <Text style={styles.cardSubtitle}>{provider.specialty}</Text>
            <Text style={styles.cardInfo}>{provider.address}</Text>
            <Text style={styles.cardInfo}>{provider.phone}</Text>
            <Text style={styles.cardInfo}>{provider.email}</Text>
            <Text style={styles.cardInfo}>{provider.fax}</Text>
            <Text style={styles.cardInfo}>{provider.notes}</Text>
            <Pressable
              onPress={() => handleDelete(provider.id)}
              style={styles.deleteButton}>
              <Ionicons name="trash" size={18} color="white" />
              <Text style={styles.deleteButtonText}>Delete</Text>
            </Pressable>
          </Pressable>
        ))}
      </ScrollView>

      <Modal visible={modalVisible} animationType="slide">
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.modalContainer}>
          <ScrollView contentContainerStyle={styles.modalContent}>
            <Text style={styles.modalTitle}>Add a New Provider</Text>
            {Object.entries(form).map(([key, value]) => (
              <View key={key} style={styles.inputGroup}>
                <Text style={styles.label}>{key.charAt(0).toUpperCase() + key.slice(1)}</Text>
                <TextInput
                  style={styles.input}
                  placeholder={`Enter ${key}`}
                  placeholderTextColor="#aaa"
                  value={value}
                  onChangeText={text =>
                    setForm(prev => ({ ...prev, [key as keyof typeof form]: text }))
                  }
                />
              </View>
            ))}

            <View style={styles.buttonRow}>
              <Pressable onPress={() => setModalVisible(false)} style={styles.cancelButton}>
                <Text style={styles.buttonText}>Cancel</Text>
              </Pressable>
              <Pressable onPress={handleSubmit} style={styles.submitButton}>
                <Text style={styles.buttonText}>Submit</Text>
              </Pressable>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerText: { fontSize: 24, fontWeight: 'bold', color: '#222' },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addButtonText: {
    marginLeft: 6,
    fontSize: 16,
    color: '#2e86de',
  },
  scrollContainer: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  card: {
    backgroundColor: '#f5f6fa',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e272e',
  },
  cardSubtitle: {
    fontSize: 16,
    color: '#485460',
    marginBottom: 8,
  },
  cardInfo: {
    fontSize: 14,
    color: '#636e72',
  },
  deleteButton: {
    flexDirection: 'row',
    marginTop: 10,
    backgroundColor: '#eb3b5a',
    padding: 8,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#fff',
    marginLeft: 6,
    fontSize: 14,
  },
  modalContainer: { flex: 1, backgroundColor: '#fff' },
  modalContent: {
    padding: 20,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#2c3e50',
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 4,
    color: '#2c3e50',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#2c3e50',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
  },
  cancelButton: {
    flex: 1,
    marginRight: 8,
    backgroundColor: '#d1d8e0',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButton: {
    flex: 1,
    marginLeft: 8,
    backgroundColor: '#20bf6b',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});
