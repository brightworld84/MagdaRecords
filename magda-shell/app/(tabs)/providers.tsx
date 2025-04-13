// app/(tabs)/providers.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Modal,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import uuid from 'react-native-uuid';


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

  const emptyForm = {
    name: '',
    specialty: '',
    address: '',
    phone: '',
    email: '',
    fax: '',
    notes: '',
  };

  const [form, setForm] = useState<Omit<Provider, 'id'>>(emptyForm);

  const handleSubmit = () => {
    if (!form.name) {
      Alert.alert('Name is required');
      return;
    }

    if (selectedProvider) {
      setProviders(prev =>
        prev.map(p => (p.id === selectedProvider.id ? { ...p, ...form } : p))
      );
    } else {
      setProviders(prev => [...prev, { id: { id: uuid.v4().toString(), ...form }]);
    }

    setForm(emptyForm);
    setSelectedProvider(null);
    setModalVisible(false);
  };

  const handleEdit = (provider: Provider) => {
    setForm({ ...provider });
    setSelectedProvider(provider);
    setModalVisible(true);
  };

  const handleDelete = (id: string) => {
    Alert.alert('Delete Provider', 'Are you sure you want to delete this provider?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => setProviders(prev => prev.filter(p => p.id !== id)),
      },
    ]);
  };

  const filteredProviders = providers.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Providers</Text>

      <TextInput
        placeholder="Search providers"
        placeholderTextColor="#999"
        style={styles.searchInput}
        value={searchQuery}
        onChangeText={setSearchQuery}
        accessibilityLabel="Search Providers"
      />

      <ScrollView style={styles.list}>
        {filteredProviders.map(provider => (
          <TouchableOpacity
            key={provider.id}
            style={styles.card}
            onPress={() => handleEdit(provider)}
            accessibilityLabel={`Provider card for ${provider.name}`}
          >
            <Text style={styles.cardTitle}>{provider.name}</Text>
            <Text style={styles.cardSubtitle}>{provider.specialty}</Text>
            <TouchableOpacity
              onPress={() => handleDelete(provider.id)}
              style={styles.deleteButton}
              accessibilityLabel={`Delete provider ${provider.name}`}
            >
              <Text style={styles.deleteButtonText}>Delete</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => {
          setForm(emptyForm);
          setSelectedProvider(null);
          setModalVisible(true);
        }}
        accessibilityLabel="Add a new provider or facility"
      >
        <Text style={styles.addButtonText}>＋ Add Provider or Facility</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} animationType="slide">
        <SafeAreaView style={styles.modalContainer}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={styles.keyboardContainer}
          >
            <ScrollView>
              <Text style={styles.modalHeader}>
                {selectedProvider ? 'Edit Provider' : 'Add New Provider'}
              </Text>

              {Object.entries(form).map(([key, value]) => (
                <View key={key} style={styles.inputGroup}>
                  <Text style={styles.label}>
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                  </Text>
                  <TextInput
                    placeholder={`Enter ${key}`}
                    placeholderTextColor="#888"
                    style={styles.input}
                    value={value}
                    onChangeText={text => setForm(prev => ({ ...prev, [key]: text }))}
                    accessibilityLabel={`${key} input`}
                  />
                </View>
              ))}

              <View style={styles.buttonRow}>
                <TouchableOpacity
                  onPress={() => {
                    setModalVisible(false);
                    setSelectedProvider(null);
                  }}
                  style={styles.cancelButton}
                  accessibilityLabel="Cancel adding provider"
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleSubmit}
                  style={styles.submitButton}
                  accessibilityLabel="Submit provider form"
                >
                  <Text style={styles.submitButtonText}>Submit</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  header: { fontSize: 28, fontWeight: 'bold', marginBottom: 16 },
  searchInput: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
  },
  list: { flex: 1 },
  card: {
    backgroundColor: '#f0f4f8',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  cardTitle: { fontSize: 18, fontWeight: 'bold' },
  cardSubtitle: { fontSize: 14, color: '#666', marginBottom: 8 },
  deleteButton: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#e63946',
    borderRadius: 6,
  },
  deleteButtonText: { color: '#fff', fontSize: 14 },
  addButton: {
    backgroundColor: '#007aff',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12,
  },
  addButtonText: { color: '#fff', fontSize: 18, fontWeight: '600' },
  modalContainer: { flex: 1, padding: 16 },
  modalHeader: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  keyboardContainer: { flex: 1 },
  inputGroup: { marginBottom: 12 },
  label: { fontSize: 16, marginBottom: 4 },
  input: {
    borderColor: '#aaa',
    borderWidth: 1,
    borderRadius: 6,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
  },
  cancelButton: {
    backgroundColor: '#aaa',
    padding: 16,
    borderRadius: 6,
    flex: 1,
    marginRight: 8,
    alignItems: 'center',
  },
  submitButton: {
    backgroundColor: '#28a745',
    padding: 16,
    borderRadius: 6,
    flex: 1,
    marginLeft: 8,
    alignItems: 'center',
  },
  cancelButtonText: { color: '#fff', fontSize: 16 },
  submitButtonText: { color: '#fff', fontSize: 16 },
});
