import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Modal,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

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
  const [newProvider, setNewProvider] = useState<Omit<Provider, 'id'>>({
    name: '',
    specialty: '',
    address: '',
    phone: '',
    email: '',
    fax: '',
    notes: '',
  });

  const addProvider = () => {
    setProviders((prev) => [
      ...prev,
      { id: Date.now().toString(), ...newProvider },
    ]);
    setNewProvider({
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
      style={styles.providerCard}
      accessibilityLabel={`View details for ${item.name}`}
      onPress={() => {
        alert(
          `🏥 ${item.name}\n📋 Specialty: ${item.specialty}\n🏠 ${item.address}\n📞 ${item.phone}\n✉️ ${item.email}\n📠 ${item.fax}\n📝 ${item.notes}`
        );
      }}
    >
      <Text style={styles.providerName}>{item.name}</Text>
      <Text style={styles.providerSpecialty}>{item.specialty}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={providers}
        keyExtractor={(item) => item.id}
        renderItem={renderProvider}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            No providers saved yet. Add your doctor, clinic, or specialist.
          </Text>
        }
        contentContainerStyle={styles.listContainer}
      />

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setModalVisible(true)}
        accessibilityLabel="Add a new provider or facility"
      >
        <Ionicons name="add-circle-outline" size={28} color="#fff" />
        <Text style={styles.addButtonText}>Add Provider or Facility</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <KeyboardAvoidingView
          style={styles.modalContainer}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <ScrollView
            style={styles.modalContent}
            contentContainerStyle={{ paddingBottom: 100 }}
            keyboardShouldPersistTaps="handled"
          >
            <Text style={styles.modalTitle}>Add Provider or Facility</Text>

            {[
              { label: '🏥 Name or Facility', key: 'name' },
              { label: '📋 Specialty', key: 'specialty' },
              { label: '🏠 Address', key: 'address' },
              { label: '📞 Phone', key: 'phone' },
              { label: '✉️ Email', key: 'email' },
              { label: '📠 Fax', key: 'fax' },
              { label: '📝 Notes (e.g. visit dates)', key: 'notes' },
            ].map((field) => (
              <View key={field.key} style={styles.inputGroup}>
                <Text style={styles.label}>{field.label}</Text>
                <TextInput
                  style={styles.input}
                  placeholder={field.label}
                  value={newProvider[field.key as keyof typeof newProvider]}
                  onChangeText={(text) =>
                    setNewProvider((prev) => ({
                      ...prev,
                      [field.key]: text,
                    }))
                  }
                  accessibilityLabel={`Enter ${field.label}`}
                  placeholderTextColor="#999"
                />
              </View>
            ))}

            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.submitButton]}
                onPress={addProvider}
              >
                <Text style={styles.buttonText}>Submit</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  listContainer: {
    padding: 16,
  },
  providerCard: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 12,
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  providerName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111',
  },
  providerSpecialty: {
    fontSize: 14,
    color: '#555',
    marginTop: 4,
  },
  addButton: {
    backgroundColor: '#2563EB',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 50,
    margin: 16,
    alignSelf: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
    marginLeft: 8,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '90%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 20,
    color: '#111',
    alignSelf: 'center',
  },
  inputGroup: {
    marginBottom: 14,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  input: {
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: '#111',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#E5E7EB',
  },
  submitButton: {
    backgroundColor: '#10B981',
  },
  buttonText: {
    color: '#111',
    fontWeight: '600',
    textAlign: 'center',
    fontSize: 16,
  },
  emptyText: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginTop: 32,
  },
});
