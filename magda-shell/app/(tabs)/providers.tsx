import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Modal,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
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
  const [modalVisible, setModalVisible] = useState(false);
  const [editingProvider, setEditingProvider] = useState<Provider | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const [formState, setFormState] = useState<Omit<Provider, 'id'>>({
    name: '',
    specialty: '',
    address: '',
    phone: '',
    email: '',
    fax: '',
    notes: '',
  });

  const handleInputChange = (field: keyof Omit<Provider, 'id'>, value: string) => {
    setFormState({ ...formState, [field]: value });
  };

  const handleAddOrUpdateProvider = () => {
    if (!formState.name) return;

    if (editingProvider) {
      setProviders(prev =>
        prev.map(p => (p.id === editingProvider.id ? { ...editingProvider, ...formState } : p))
      );
    } else {
      setProviders(prev => [...prev, { id: uuidv4(), ...formState }]);
    }

    setFormState({
      name: '',
      specialty: '',
      address: '',
      phone: '',
      email: '',
      fax: '',
      notes: '',
    });
    setEditingProvider(null);
    setModalVisible(false);
  };

  const handleEdit = (provider: Provider) => {
    setEditingProvider(provider);
    setFormState({ ...provider });
    setModalVisible(true);
  };

  const handleDelete = (id: string) => {
    setProviders(prev => prev.filter(p => p.id !== id));
  };

  const filteredProviders = providers.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.container}>
          <Text style={styles.title}>Your Providers</Text>

          <TextInput
            style={styles.searchInput}
            placeholder="🔍 Search providers"
            placeholderTextColor="#888"
            value={searchQuery}
            onChangeText={setSearchQuery}
            accessibilityLabel="Search providers"
          />

          <FlatList
            data={filteredProviders}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.card}
                onPress={() => handleEdit(item)}
                accessibilityLabel={`Tap to view or edit details for ${item.name}`}
              >
                <Text style={styles.cardTitle}>{item.name}</Text>
                <Text style={styles.cardSub}>{item.specialty}</Text>
                <TouchableOpacity
                  onPress={() => handleDelete(item.id)}
                  accessibilityLabel={`Delete provider ${item.name}`}
                >
                  <Ionicons name="trash" size={20} color="red" />
                </TouchableOpacity>
              </TouchableOpacity>
            )}
            ListEmptyComponent={<Text style={styles.empty}>No providers added yet.</Text>}
          />

          <TouchableOpacity
            style={styles.addButton}
            onPress={() => {
              setEditingProvider(null);
              setFormState({
                name: '',
                specialty: '',
                address: '',
                phone: '',
                email: '',
                fax: '',
                notes: '',
              });
              setModalVisible(true);
            }}
            accessibilityLabel="Add a new provider or facility"
          >
            <Ionicons name="add-circle-outline" size={24} color="#fff" />
            <Text style={styles.addButtonText}>Add Provider</Text>
          </TouchableOpacity>
        </View>

        <Modal animationType="slide" transparent={true} visible={modalVisible}>
          <View style={styles.modalContainer}>
            <ScrollView contentContainerStyle={styles.modalContent}>
              <Text style={styles.modalTitle}>
                {editingProvider ? 'Edit Provider' : 'Add New Provider'}
              </Text>

              {(
                Object.keys(formState) as Array<keyof Omit<Provider, 'id'>>
              ).map((field, index) => (
                <View key={index} style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>
                    {field.charAt(0).toUpperCase() + field.slice(1)}
                  </Text>
                  <TextInput
                    style={styles.input}
                    placeholder={`${
                      field === 'name'
                        ? '🏥 Name or Facility'
                        : field === 'address'
                        ? '🏠 Address'
                        : field === 'phone'
                        ? '📞 Phone'
                        : field === 'email'
                        ? '✉️ Email'
                        : field === 'fax'
                        ? '📠 Fax'
                        : '📝 Notes'
                    }`}
                    placeholderTextColor="#888"
                    value={formState[field]}
                    onChangeText={value => handleInputChange(field, value)}
                    accessibilityLabel={`Enter ${field}`}
                  />
                </View>
              ))}

              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => setModalVisible(false)}
                  accessibilityLabel="Cancel"
                >
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.submitButton}
                  onPress={handleAddOrUpdateProvider}
                  accessibilityLabel="Submit provider details"
                >
                  <Text style={styles.buttonText}>Submit</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </Modal>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 20, paddingTop: 10 },
  title: { fontSize: 24, fontWeight: '700', marginBottom: 15 },
  searchInput: {
    backgroundColor: '#f0f0f0',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    fontSize: 16,
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#aaa',
    shadowOpacity: 0.3,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  cardTitle: { fontSize: 18, fontWeight: '600' },
  cardSub: { fontSize: 14, color: '#555', marginTop: 4 },
  empty: { textAlign: 'center', color: '#888', marginTop: 20 },
  addButton: {
    backgroundColor: '#007AFF',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 14,
    borderRadius: 8,
    marginVertical: 15,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 18,
    marginLeft: 10,
    fontWeight: '500',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 10,
    textAlign: 'center',
  },
  inputGroup: { marginBottom: 12 },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 18,
  },
  cancelButton: {
    backgroundColor: '#aaa',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  submitButton: {
    backgroundColor: '#28a745',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  buttonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
});
