import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  Button,
  Modal,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type Provider = {
  id: string;
  name: string;
  specialty?: string;
  address?: string;
  phone?: string;
  email?: string;
  fax?: string;
  notes?: string;
};

export default function ProvidersScreen() {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [search, setSearch] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [newProvider, setNewProvider] = useState<Partial<Provider>>({});
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);

  const filteredProviders = providers.filter((p) =>
    p.name?.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddProvider = () => {
    if (!newProvider.name) return;

    const newEntry: Provider = {
      ...newProvider,
      id: Date.now().toString(),
    } as Provider;

    setProviders((prev) => [...prev, newEntry]);
    setNewProvider({});
    setModalVisible(false);
  };

  const handleDelete = (id: string) => {
    setProviders((prev) => prev.filter((p) => p.id !== id));
    setSelectedProvider(null);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>My Providers</Text>

      <TextInput
        placeholder="Search providers..."
        value={search}
        onChangeText={setSearch}
        style={styles.searchInput}
      />

      <FlatList
        data={filteredProviders}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.listItem}
            onPress={() => setSelectedProvider(item)}
          >
            <Text style={styles.listName}>{item.name}</Text>
            <Text style={styles.listSpecialty}>
              {item.specialty || 'Specialty not provided'}
            </Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text style={styles.empty}>No providers added yet</Text>}
      />

      <TouchableOpacity style={styles.fab} onPress={() => setModalVisible(true)}>
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>

      {/* Add new provider modal */}
      <Modal visible={modalVisible} animationType="slide">
        <ScrollView contentContainerStyle={styles.modalContainer}>
          <Text style={styles.modalTitle}>Add New Provider</Text>

          <View style={styles.formGroup}>
            <Text style={styles.label}>🏥 Name or Facility</Text>
            <TextInput
              placeholder="Enter provider or facility name"
              value={newProvider.name || ''}
              onChangeText={(text) => setNewProvider({ ...newProvider, name: text })}
              style={styles.input}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Specialty</Text>
            <TextInput
              placeholder="e.g. Cardiologist, Dentist"
              value={newProvider.specialty || ''}
              onChangeText={(text) => setNewProvider({ ...newProvider, specialty: text })}
              style={styles.input}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>🏠 Address</Text>
            <TextInput
              placeholder="e.g. 123 Main St, Springfield"
              value={newProvider.address || ''}
              onChangeText={(text) => setNewProvider({ ...newProvider, address: text })}
              style={styles.input}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>📞 Phone</Text>
            <TextInput
              placeholder="e.g. (555) 123-4567"
              value={newProvider.phone || ''}
              onChangeText={(text) => setNewProvider({ ...newProvider, phone: text })}
              style={styles.input}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>✉️ Email</Text>
            <TextInput
              placeholder="e.g. info@clinic.com"
              value={newProvider.email || ''}
              onChangeText={(text) => setNewProvider({ ...newProvider, email: text })}
              style={styles.input}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>📠 Fax</Text>
            <TextInput
              placeholder="e.g. (555) 987-6543"
              value={newProvider.fax || ''}
              onChangeText={(text) => setNewProvider({ ...newProvider, fax: text })}
              style={styles.input}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>📝 Notes</Text>
            <TextInput
              placeholder="e.g. Visited 01/01/2024 for yearly exam"
              value={newProvider.notes || ''}
              onChangeText={(text) => setNewProvider({ ...newProvider, notes: text })}
              style={[styles.input, { height: 80 }]}
              multiline
            />
          </View>

          <View style={styles.modalButtons}>
            <Button title="Cancel" onPress={() => setModalVisible(false)} />
            <Button title="Save" onPress={handleAddProvider} />
          </View>
        </ScrollView>
      </Modal>

      {/* Provider detail modal */}
      <Modal
        visible={!!selectedProvider}
        animationType="fade"
        transparent
        onRequestClose={() => setSelectedProvider(null)}
      >
        <View style={styles.overlay}>
          <View style={styles.detailCard}>
            <ScrollView>
              <Text style={styles.detailHeader}>{selectedProvider?.name}</Text>

              <Text style={styles.label}>🏥 Name or Facility</Text>
              <Text style={styles.detailValue}>
                {selectedProvider?.name || 'Not provided'}
              </Text>

              <Text style={styles.label}>Specialty</Text>
              <Text style={styles.detailValue}>
                {selectedProvider?.specialty || 'Not provided'}
              </Text>

              <Text style={styles.label}>🏠 Address</Text>
              <Text style={styles.detailValue}>
                {selectedProvider?.address || 'Not provided'}
              </Text>

              <Text style={styles.label}>📞 Phone</Text>
              <Text style={styles.detailValue}>
                {selectedProvider?.phone || 'Not provided'}
              </Text>

              <Text style={styles.label}>✉️ Email</Text>
              <Text style={styles.detailValue}>
                {selectedProvider?.email || 'Not provided'}
              </Text>

              <Text style={styles.label}>📠 Fax</Text>
              <Text style={styles.detailValue}>
                {selectedProvider?.fax || 'Not provided'}
              </Text>

              <Text style={styles.label}>📝 Notes</Text>
              <Text style={styles.detailValue}>
                {selectedProvider?.notes || 'Not provided'}
              </Text>

              <View style={styles.modalButtons}>
                <Button title="Close" onPress={() => setSelectedProvider(null)} />
                <Button
                  title="Delete"
                  color="#d11a2a"
                  onPress={() => handleDelete(selectedProvider!.id)}
                />
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 12 },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginBottom: 12,
  },
  listItem: {
    backgroundColor: '#f4f4f4',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  listName: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  listSpecialty: { fontSize: 14, color: '#555', marginTop: 4 },
  empty: {
    textAlign: 'center',
    marginTop: 60,
    fontSize: 16,
    color: '#aaa',
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    backgroundColor: '#007AFF',
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
  },
  modalContainer: {
    padding: 20,
    backgroundColor: '#fff',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  formGroup: { marginBottom: 12 },
  label: { fontWeight: '600', marginBottom: 4 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
    padding: 20,
  },
  detailCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    elevation: 4,
  },
  detailHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  detailValue: {
    fontSize: 16,
    color: '#555',
    marginBottom: 8,
  },
});
