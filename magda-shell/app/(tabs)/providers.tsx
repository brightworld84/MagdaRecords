import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Modal,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from 'react-native';

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
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);

  const openProvider = (provider: Provider) => {
    setSelectedProvider(provider);
    setModalVisible(true);
  };

  const closeProvider = () => {
    setSelectedProvider(null);
    setModalVisible(false);
  };

  const renderProvider = ({ item }: { item: Provider }) => (
    <TouchableOpacity onPress={() => openProvider(item)} style={styles.item}>
      <Text style={styles.title}>{item.name}</Text>
      <Text style={styles.subtitle}>{item.specialty}</Text>
    </TouchableOpacity>
  );

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.container}>
        <FlatList
          data={providers}
          renderItem={renderProvider}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={<Text style={styles.empty}>No providers yet</Text>}
        />

        <TouchableOpacity
          onPress={() => openProvider({
            id: Date.now().toString(),
            name: '',
            specialty: '',
            address: '',
            phone: '',
            email: '',
            fax: '',
            notes: '',
          })}
          style={styles.addButton}
        >
          <Text style={styles.addButtonText}>➕ Add Provider</Text>
        </TouchableOpacity>

        <Modal visible={modalVisible} animationType="slide">
          <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          >
            <ScrollView contentContainerStyle={styles.modalContainer}>
              {selectedProvider && (
                <>
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
                      <Text style={styles.label}>{label}</Text>
                      <TextInput
                        placeholder={label}
                        style={styles.input}
                        value={selectedProvider[key as keyof Provider]}
                        onChangeText={(text) =>
                          setSelectedProvider({
                            ...selectedProvider,
                            [key]: text,
                          })
                        }
                        multiline={key === 'notes'}
                      />
                    </View>
                  ))}

                  <TouchableOpacity
                    onPress={() => {
                      setProviders((prev) => {
                        const exists = prev.find((p) => p.id === selectedProvider.id);
                        return exists
                          ? prev.map((p) => (p.id === selectedProvider.id ? selectedProvider : p))
                          : [...prev, selectedProvider];
                      });
                      closeProvider();
                    }}
                    style={styles.saveButton}
                  >
                    <Text style={styles.saveButtonText}>💾 Save</Text>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={closeProvider}>
                    <Text style={styles.cancelButton}>Cancel</Text>
                  </TouchableOpacity>
                </>
              )}
            </ScrollView>
          </KeyboardAvoidingView>
        </Modal>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  item: {
    padding: 16,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    marginBottom: 10,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  subtitle: {
    fontSize: 14,
    color: 'gray',
  },
  empty: {
    textAlign: 'center',
    marginTop: 50,
    color: 'gray',
  },
  addButton: {
    marginTop: 20,
    padding: 12,
    backgroundColor: '#007AFF',
    borderRadius: 8,
    alignItems: 'center',
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  modalContainer: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 6,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 8,
    padding: 10,
  },
  saveButton: {
    backgroundColor: '#28a745',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  saveButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  cancelButton: {
    textAlign: 'center',
    color: '#FF3B30',
    marginTop: 12,
  },
});
