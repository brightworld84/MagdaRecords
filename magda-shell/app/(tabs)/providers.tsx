import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Modal,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
// ✅ Use this safe UUID generator instead:
import uuid from 'react-native-uuid';

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

const ProvidersScreen = () => {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [search, setSearch] = useState('');

  const [form, setForm] = useState<Omit<Provider, 'id'>>({
    name: '',
    specialty: '',
    address: '',
    phone: '',
    email: '',
    fax: '',
    notes: '',
  });

  const handleAddProvider = () => {
    if (!form.name.trim()) {
      Alert.alert('Validation', 'Provider name or facility is required.');
      return;
    }

    const newProvider: Provider = { id: uuid.v4().toString(), ...form };
    setProviders([...providers, newProvider]);
    resetForm();
    setModalVisible(false);
  };

  const resetForm = () => {
    setForm({
      name: '',
      specialty: '',
      address: '',
      phone: '',
      email: '',
      fax: '',
      notes: '',
    });
    setSelectedProvider(null);
  };

  const handleDelete = (id: string) => {
    Alert.alert('Confirm Delete', 'Are you sure you want to delete this provider?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => {
        setProviders(providers.filter(p => p.id !== id));
      }},
    ]);
  };

  const handleAIUploadDetection = () => {
    // Simulate AI detection from uploaded file
    const detected: Omit<Provider, 'id'> = {
      name: 'Dr. Marcus Welby',
      specialty: 'Family Medicine',
      address: '123 Health St, Medtown',
      phone: '555-1010',
      email: 'marcus@example.com',
      fax: '555-2020',
      notes: 'Visit: 2023-12-01\nVisit: 2024-01-10',
    };

    Alert.alert(
      'AI Detected Provider Info',
      'AI found provider information. Would you like to add as a new provider or update an existing one?',
      [
        {
          text: 'Create New',
          onPress: () => setProviders([...providers, { id: uuid.v4().toString()
            , ...detected }]),
        },
        {
          text: 'Update Existing',
          onPress: () => {
            if (providers.length > 0) {
              const updated = [...providers];
              updated[0] = { ...updated[0], ...detected };
              setProviders(updated);
            } else {
              Alert.alert('No existing providers to update.');
            }
          },
        },
      ]
    );
  };

  useEffect(() => {
    handleAIUploadDetection(); // Automatically run on screen load (simulate upload detection)
  }, []);

  const filteredProviders = providers.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.specialty.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={80}
      >
        <ScrollView contentContainerStyle={{ padding: 20 }}>
          <Text style={{ fontSize: 28, fontWeight: 'bold', marginBottom: 20 }}>Providers</Text>

          <TextInput
            placeholder="Search providers"
            value={search}
            onChangeText={setSearch}
            style={{
              borderWidth: 1,
              borderColor: '#ccc',
              padding: 12,
              borderRadius: 8,
              marginBottom: 20,
              fontSize: 16,
            }}
            accessibilityLabel="Search Providers"
          />

          {filteredProviders.map((provider) => (
            <TouchableOpacity
              key={provider.id}
              onPress={() => {
                setSelectedProvider(provider);
                setModalVisible(true);
              }}
              style={{
                borderWidth: 1,
                borderColor: '#ccc',
                padding: 15,
                borderRadius: 8,
                marginBottom: 12,
              }}
              accessibilityLabel={`Open ${provider.name} details`}
            >
              <Text style={{ fontSize: 18, fontWeight: '600' }}>{provider.name}</Text>
              {provider.specialty ? (
                <Text style={{ fontSize: 14, color: '#666' }}>{provider.specialty}</Text>
              ) : null}
            </TouchableOpacity>
          ))}

          <TouchableOpacity
            onPress={() => {
              resetForm();
              setModalVisible(true);
            }}
            style={{
              backgroundColor: '#007AFF',
              padding: 15,
              borderRadius: 8,
              alignItems: 'center',
              marginTop: 10,
            }}
            accessibilityRole="button"
            accessibilityLabel="Add a provider or facility"
          >
            <Text style={{ color: '#fff', fontSize: 18, fontWeight: '600' }}>➕ Add Provider or Facility</Text>
          </TouchableOpacity>

          <Modal visible={modalVisible} animationType="slide">
            <SafeAreaView style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
              <ScrollView contentContainerStyle={{ padding: 20 }}>
                <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>
                  {selectedProvider ? 'Edit Provider' : 'Add New Provider'}
                </Text>

                {(
                  Object.keys(form) as (keyof Omit<Provider, 'id'>)[]
                ).map((key) => (
                  <View key={key} style={{ marginBottom: 16 }}>
                    <Text style={{ fontSize: 16, fontWeight: '500', marginBottom: 4 }}>
                      {key.charAt(0).toUpperCase() + key.slice(1)}
                    </Text>
                    <TextInput
                      value={form[key]}
                      onChangeText={(text) =>
                        setForm((prev) => ({ ...prev, [key]: text }))
                      }
                      placeholder={
                        {
                          name: '🏥 Name or Facility',
                          specialty: 'Specialty',
                          address: '🏠 Address',
                          phone: '📞 Phone',
                          email: '✉️ Email',
                          fax: '📠 Fax',
                          notes: '📝 Notes',
                        }[key]
                      }
                      style={{
                        borderWidth: 1,
                        borderColor: '#ccc',
                        padding: 12,
                        borderRadius: 8,
                        fontSize: 16,
                        backgroundColor: '#fff',
                      }}
                      multiline={key === 'notes'}
                      accessibilityLabel={`${key} input`}
                    />
                  </View>
                ))}

                <TouchableOpacity
                  onPress={handleAddProvider}
                  style={{
                    backgroundColor: '#28a745',
                    padding: 15,
                    borderRadius: 8,
                    alignItems: 'center',
                    marginTop: 10,
                  }}
                  accessibilityRole="button"
                  accessibilityLabel="Submit new provider"
                >
                  <Text style={{ color: '#fff', fontSize: 18, fontWeight: '600' }}>Submit</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => setModalVisible(false)}
                  style={{
                    marginTop: 12,
                    padding: 12,
                    alignItems: 'center',
                  }}
                  accessibilityRole="button"
                  accessibilityLabel="Cancel adding provider"
                >
                  <Text style={{ color: '#007AFF', fontSize: 18 }}>Cancel</Text>
                </TouchableOpacity>
              </ScrollView>
            </SafeAreaView>
          </Modal>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ProvidersScreen;
