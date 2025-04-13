import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Modal, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
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
  const [selectedProviderId, setSelectedProviderId] = useState<string | null>(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [formData, setFormData] = useState<Omit<Provider, 'id'>>({
    name: '',
    specialty: '',
    address: '',
    phone: '',
    email: '',
    fax: '',
    notes: '',
  });

  const openModal = () => {
    setFormData({
      name: '',
      specialty: '',
      address: '',
      phone: '',
      email: '',
      fax: '',
      notes: '',
    });
    setSelectedProviderId(null);
    setModalVisible(true);
  };

  const handleSubmit = () => {
    const newProvider: Provider = { id: uuidv4(), ...formData };
    setProviders([...providers, newProvider]);
    setModalVisible(false);
  };

  const handleInputChange = (field: keyof Provider, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const renderProvider = ({ item }: { item: Provider }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => setSelectedProviderId(item.id === selectedProviderId ? null : item.id)}
      accessibilityRole="button"
      accessibilityLabel={`Provider: ${item.name}`}
    >
      <Text style={styles.cardTitle}>{item.name}</Text>
      {item.specialty ? <Text style={styles.cardSub}>{item.specialty}</Text> : null}

      {selectedProviderId === item.id && (
        <View style={styles.details}>
          <Text style={styles.label}>Address:</Text>
          <Text style={styles.info}>{item.address}</Text>
          <Text style={styles.label}>Phone:</Text>
          <Text style={styles.info}>{item.phone}</Text>
          <Text style={styles.label}>Email:</Text>
          <Text style={styles.info}>{item.email}</Text>
          <Text style={styles.label}>Fax:</Text>
          <Text style={styles.info}>{item.fax}</Text>
          <Text style={styles.label}>Notes:</Text>
          <Text style={styles.info}>{item.notes}</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.container}>
      <FlatList
        data={providers}
        renderItem={renderProvider}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={<Text style={styles.emptyText}>No providers added yet.</Text>}
        contentContainerStyle={styles.list}
      />

      <TouchableOpacity style={styles.addButton} onPress={openModal} accessibilityRole="button" accessibilityLabel="Add a provider">
        <Text style={styles.addButtonText}>➕ Add a Provider or Facility</Text>
      </TouchableOpacity>

      <Modal visible={isModalVisible} animationType="slide">
        <ScrollView contentContainerStyle={styles.modalContainer} keyboardShouldPersistTaps="handled">
          <Text style={styles.modalTitle}>Add Provider</Text>

          {[
            { label: '🏥 Name or Facility', key: 'name' },
            { label: 'Specialty', key: 'specialty' },
            { label: '🏠 Address', key: 'address' },
            { label: '📞 Phone', key: 'phone' },
            { label: '✉️ Email', key: 'email' },
            { label: '📠 Fax', key: 'fax' },
            { label: '📝 Notes', key: 'notes' },
          ].map(({ label, key }) => (
            <View key={key} style={styles.inputGroup}>
              <Text style={styles.inputLabel}>{label}</Text>
              <TextInput
                style={styles.input}
                placeholder={label}
                placeholderTextColor="#999"
                value={formData[key as keyof Provider]}
                onChangeText={(text) => handleInputChange(key as keyof Provider, text)}
                accessibilityLabel={label}
              />
            </View>
          ))}

          <View style={styles.modalButtons}>
            <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
              <Text style={styles.submitButtonText}>Submit</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  list: {
    padding: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 18,
    marginBottom: 14,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
  },
  cardSub: {
    fontSize: 16,
    color: '#666',
    marginTop: 2,
  },
  details: {
    marginTop: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginTop: 8,
    color: '#555',
  },
  info: {
    fontSize: 16,
    color: '#333',
  },
  addButton: {
    backgroundColor: '#007AFF',
    margin: 20,
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#999',
    marginTop: 40,
  },
  modalContainer: {
    padding: 24,
    backgroundColor: '#F8F9FA',
    flexGrow: 1,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 20,
    color: '#222',
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    color: '#333',
  },
  input: {
    backgroundColor: '#fff',
    padding: 14,
    fontSize: 16,
    borderRadius: 8,
    borderColor: '#ccc',
    borderWidth: 1,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 28,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#E0E0E0',
    padding: 14,
    borderRadius: 8,
    marginRight: 12,
  },
  cancelButtonText: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  submitButton: {
    flex: 1,
    backgroundColor: '#007AFF',
    padding: 14,
    borderRadius: 8,
  },
  submitButtonText: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});
