// app/(tabs)/providers.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Modal,
  StyleSheet,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native';

// Define a Provider type
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

export default function Providers() {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [formData, setFormData] = useState<Omit<Provider, 'id'>>({
    name: '',
    specialty: '',
    address: '',
    phone: '',
    email: '',
    fax: '',
    notes: '',
  });

  const handleAddProvider = () => {
    if (!formData.name) return;
    const newProvider: Provider = {
      id: Date.now().toString(),
      ...formData,
    };
    setProviders([...providers, newProvider]);
    setFormData({
      name: '',
      specialty: '',
      address: '',
      phone: '',
      email: '',
      fax: '',
      notes: '',
    });
    setModalVisible(false);
  };

  const renderProvider = ({ item }: { item: Provider }) => (
    <TouchableOpacity
      accessible
      accessibilityLabel={`Tap to view details for provider ${item.name}`}
      style={styles.card}
      onPress={() => setFormData({ ...item })}
    >
      <Text style={styles.cardTitle}>{item.name}</Text>
      {item.specialty ? <Text style={styles.cardSubtitle}>{item.specialty}</Text> : null}
    </TouchableOpacity>
  );

  const fields: Array<keyof Omit<Provider, 'id'>> = [
    'name',
    'specialty',
    'address',
    'phone',
    'email',
    'fax',
    'notes',
  ];

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <ScrollView>
        <Text accessibilityRole="header" style={styles.header}>
          My Providers
        </Text>

        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          accessibilityRole="button"
          accessibilityLabel="Add a new provider"
          style={styles.addButton}
        >
          <Text style={styles.addButtonText}>➕ Add New Provider</Text>
        </TouchableOpacity>

        <FlatList
          data={providers}
          keyExtractor={(item) => item.id}
          renderItem={renderProvider}
          contentContainerStyle={{ paddingBottom: 120 }}
        />

        <Modal visible={modalVisible} animationType="slide">
          <ScrollView contentContainerStyle={styles.modalContent}>
            {fields.map((field) => (
              <View key={field} style={styles.inputGroup}>
                <Text style={styles.label}>
                  {field === 'name'
                    ? '🏥 Name or Facility'
                    : field === 'specialty'
                    ? '💼 Specialty'
                    : field === 'address'
                    ? '🏠 Address'
                    : field === 'phone'
                    ? '📞 Phone'
                    : field === 'email'
                    ? '✉️ Email'
                    : field === 'fax'
                    ? '📠 Fax'
                    : '📝 Notes'}
                </Text>
                <TextInput
                  style={styles.input}
                  value={formData[field]}
                  onChangeText={(text) =>
                    setFormData((prev) => ({
                      ...prev,
                      [field]: text,
                    }))
                  }
                  placeholder={`Enter ${field}`}
                  accessibilityLabel={`Input for ${field}`}
                />
              </View>
            ))}

            <TouchableOpacity
              onPress={handleAddProvider}
              style={styles.saveButton}
              accessibilityRole="button"
              accessibilityLabel="Save provider"
            >
              <Text style={styles.saveButtonText}>Save Provider</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={styles.cancelButton}
              accessibilityRole="button"
              accessibilityLabel="Cancel and close form"
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </ScrollView>
        </Modal>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  addButton: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  addButtonText: { color: 'white', textAlign: 'center', fontSize: 16 },
  card: {
    padding: 16,
    backgroundColor: '#f2f2f2',
    borderRadius: 8,
    marginBottom: 10,
  },
  cardTitle: { fontSize: 18, fontWeight: 'bold' },
  cardSubtitle: { fontSize: 14, color: '#666' },
  modalContent: { padding: 16 },
  inputGroup: { marginBottom: 12 },
  label: { fontSize: 14, marginBottom: 4 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 10,
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: '#34C759',
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
  },
  saveButtonText: { color: 'white', textAlign: 'center', fontSize: 16 },
  cancelButton: {
    backgroundColor: '#ff3b30',
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
  },
  cancelButtonText: { color: 'white', textAlign: 'center', fontSize: 16 },
});
