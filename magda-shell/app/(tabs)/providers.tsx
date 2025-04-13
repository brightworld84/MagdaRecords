import 'react-native-get-random-values';

import React, { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity, FlatList, KeyboardAvoidingView, Platform, Modal, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { v4 as uuidv4 } from 'uuid';

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
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const [formData, setFormData] = useState<Omit<Provider, 'id'>>({
    name: '',
    specialty: '',
    address: '',
    phone: '',
    email: '',
    fax: '',
    notes: '',
  });

  const handleSaveProvider = () => {
    if (selectedProvider) {
      // Update existing
      setProviders((prev) =>
        prev.map((p) => (p.id === selectedProvider.id ? { ...selectedProvider, ...formData } : p))
      );
    } else {
      // Create new
      setProviders((prev) => [...prev, { id: uuidv4(), ...formData }]);
    }
    setModalVisible(false);
    setFormData({ name: '', specialty: '', address: '', phone: '', email: '', fax: '', notes: '' });
    setSelectedProvider(null);
  };

  const handleEditProvider = (provider: Provider) => {
    setSelectedProvider(provider);
    setFormData({ ...provider });
    setModalVisible(true);
  };

  const handleRemoveProvider = (id: string) => {
    setProviders((prev) => prev.filter((p) => p.id !== id));
  };

  const handleSimulateAIImport = () => {
    const extracted: Provider = {
      id: uuidv4(),
      name: 'Dr. Jane Doe',
      specialty: 'Cardiology',
      address: '123 Heart Ave, Pulse City',
      phone: '(123) 456-7890',
      email: 'janedoe@hospital.org',
      fax: '(123) 555-0123',
      notes: 'Visited on 2023-12-01 for chest pain.',
    };

    // Check for existing match
    const existing = providers.find((p) => p.name === extracted.name);
    if (existing) {
      setSelectedProvider(existing);
      setFormData({ ...existing, ...extracted });
    } else {
      setFormData({ ...extracted });
    }

    setModalVisible(true);
  };

  const filteredProviders = providers.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.specialty.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.container}>
      <Text style={styles.header}>Your Providers</Text>

      <View style={styles.searchBar}>
        <Ionicons name="search" size={20} color="#666" style={{ marginRight: 8 }} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name or specialty"
          placeholderTextColor="#999"
          value={searchQuery}
          onChangeText={setSearchQuery}
          accessible accessibilityLabel="Search providers"
        />
      </View>

      <FlatList
        data={filteredProviders}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 120 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => handleEditProvider(item)}
            style={styles.providerCard}
            accessibilityLabel={`Provider: ${item.name}, Specialty: ${item.specialty}`}
          >
            <Text style={styles.providerName}>{item.name}</Text>
            <Text style={styles.providerSpecialty}>{item.specialty}</Text>
          </TouchableOpacity>
        )}
      />

      <TouchableOpacity
        onPress={() => {
          setSelectedProvider(null);
          setFormData({ name: '', specialty: '', address: '', phone: '', email: '', fax: '', notes: '' });
          setModalVisible(true);
        }}
        style={styles.addButton}
        accessibilityLabel="Add a new provider or facility"
      >
        <Ionicons name="add-circle" size={24} color="white" />
        <Text style={styles.addButtonText}>Add Provider or Facility</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={handleSimulateAIImport}
        style={[styles.addButton, { marginTop: 10, backgroundColor: '#5b8df9' }]}
        accessibilityLabel="Simulate AI-imported provider"
      >
        <Ionicons name="sparkles-outline" size={20} color="white" />
        <Text style={styles.addButtonText}>AI Import Provider</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} animationType="slide">
        <KeyboardAvoidingView behavior="padding" style={styles.modalContainer}>
          <Text style={styles.modalHeader}>
            {selectedProvider ? 'Update Provider' : 'Add Provider'}
          </Text>
          {(['name', 'specialty', 'address', 'phone', 'email', 'fax', 'notes'] as const).map((key) => (
            <View key={key} style={{ marginBottom: 12 }}>
              <Text style={styles.inputLabel}>
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </Text>
              <TextInput
                style={styles.input}
                value={formData[key]}
                onChangeText={(text) => setFormData((prev) => ({ ...prev, [key]: text }))}
                placeholder={`Enter ${key} here`}
                placeholderTextColor="#888"
                accessible
                accessibilityLabel={`${key} input`}
              />
            </View>
          ))}
          <View style={styles.modalButtons}>
            <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.modalButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.submitButton} onPress={handleSaveProvider}>
              <Text style={styles.modalButtonText}>Submit</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f7fa', padding: 16 },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 12, color: '#333' },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eee',
    padding: 10,
    borderRadius: 10,
    marginBottom: 12,
  },
  searchInput: { flex: 1, fontSize: 16 },
  providerCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 2,
  },
  providerName: { fontSize: 18, fontWeight: '600', color: '#222' },
  providerSpecialty: { fontSize: 14, color: '#555' },
  addButton: {
    position: 'absolute',
    bottom: 80,
    left: 20,
    right: 20,
    backgroundColor: '#28a745',
    paddingVertical: 14,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: { fontSize: 16, color: '#fff', marginLeft: 8, fontWeight: '600' },
  modalContainer: { flex: 1, padding: 20, backgroundColor: '#fff' },
  modalHeader: { fontSize: 20, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  inputLabel: { fontSize: 16, marginBottom: 4, color: '#333' },
  input: {
    backgroundColor: '#f1f1f1',
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    color: '#111',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 30,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#ccc',
    padding: 14,
    borderRadius: 10,
    marginRight: 10,
  },
  submitButton: {
    flex: 1,
    backgroundColor: '#007bff',
    padding: 14,
    borderRadius: 10,
  },
  modalButtonText: {
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#fff',
    fontSize: 16,
  },
});
