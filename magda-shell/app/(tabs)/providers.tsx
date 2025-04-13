// File: app/(tabs)/providers.tsx

import React, { useState } from 'react';
import { View, TextInput, FlatList, KeyboardAvoidingView, Platform, TouchableOpacity, Text, Modal, StyleSheet, ScrollView } from 'react-native';
import { v4 as uuidv4 } from 'uuid';

interface Provider {
  id: string;
  name: string;
  specialty: string;
  address: string;
  phone: string;
  email: string;
  fax: string;
  notes: string;
}

export default function ProvidersScreen() {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [search, setSearch] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [newProvider, setNewProvider] = useState<Omit<Provider, 'id'>>({
    name: '',
    specialty: '',
    address: '',
    phone: '',
    email: '',
    fax: '',
    notes: '',
  });

  const handleAddProvider = () => {
    const newEntry = { id: uuidv4(), ...newProvider };
    setProviders(prev => [...prev, newEntry]);
    setNewProvider({ name: '', specialty: '', address: '', phone: '', email: '', fax: '', notes: '' });
    setModalVisible(false);
  };

  const filteredProviders = providers.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.specialty.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <TextInput
        placeholder="🔍 Search providers"
        style={styles.search}
        value={search}
        onChangeText={setSearch}
        accessibilityLabel="Search providers"
      />

      <FlatList
        data={filteredProviders}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} accessibilityRole="button" accessible>
            <Text style={styles.cardTitle}>{item.name}</Text>
            <Text style={styles.cardSubtitle}>{item.specialty}</Text>
          </TouchableOpacity>
        )}
        contentContainerStyle={{ paddingBottom: 120 }}
      />

      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        style={styles.addButton}
        accessibilityLabel="Add a provider or facility"
        accessibilityRole="button"
      >
        <Text style={styles.addButtonText}>+ Add Provider or Facility</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} animationType="slide">
        <ScrollView contentContainerStyle={styles.modalContent}>
          {Object.entries(newProvider).map(([field, value]) => (
            <View key={field} style={styles.inputGroup}>
              <Text style={styles.label}>{field.charAt(0).toUpperCase() + field.slice(1)}</Text>
              <TextInput
                placeholder={`📝 ${field}`}
                value={value}
                onChangeText={text => setNewProvider(prev => ({ ...prev, [field]: text }))}
                style={styles.input}
                multiline={field === 'notes'}
                accessibilityLabel={`Enter ${field}`}
              />
            </View>
          ))}
          <View style={styles.buttonRow}>
            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.cancelButton}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleAddProvider} style={styles.submitButton}>
              <Text style={styles.submitButtonText}>Submit</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
  search: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginBottom: 12,
    fontSize: 16,
  },
  card: {
    backgroundColor: '#f9f9f9',
    padding: 14,
    borderRadius: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#eee',
  },
  cardTitle: { fontSize: 18, fontWeight: '600', color: '#333' },
  cardSubtitle: { fontSize: 14, color: '#666' },
  addButton: {
    backgroundColor: '#1e90ff',
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    borderRadius: 30,
    paddingVertical: 14,
    alignItems: 'center',
    elevation: 3,
  },
  addButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  modalContent: { padding: 20 },
  inputGroup: { marginBottom: 16 },
  label: { fontSize: 14, marginBottom: 6, fontWeight: '500', color: '#333' },
  input: {
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
  },
  cancelButton: {
    backgroundColor: '#ccc',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  cancelButtonText: { color: '#000', fontSize: 16 },
  submitButton: {
    backgroundColor: '#1e90ff',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  submitButtonText: { color: '#fff', fontSize: 16 },
});
