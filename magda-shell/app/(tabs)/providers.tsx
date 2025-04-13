import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  Modal,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { v4 as uuidv4 } from 'uuid';
import { Ionicons } from '@expo/vector-icons';
import * as Speech from 'expo-speech';
import * as FileSystem from 'expo-file-system';

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

const defaultForm: Omit<Provider, 'id'> = {
  name: '',
  specialty: '',
  address: '',
  phone: '',
  email: '',
  fax: '',
  notes: '',
};

const ProvidersScreen = () => {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [form, setForm] = useState<Omit<Provider, 'id'>>(defaultForm);
  const [selectedProviderId, setSelectedProviderId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    simulateAIAutoDetection();
  }, []);

  const simulateAIAutoDetection = () => {
    const newAIProvider: Provider = {
      id: uuidv4(),
      name: 'Dr. Evelyn Chase',
      specialty: 'Pulmonology',
      address: '456 Respiratory Ln, Lungtown, CA',
      phone: '555-901-2345',
      email: 'evelyn.chase@lungclinic.com',
      fax: '555-901-2346',
      notes: 'Visit dates: Jan 10, 2023; Feb 20, 2023',
    };

    Alert.alert(
      'AI Detected Provider Info',
      'Would you like to create a new provider card using the detected data?',
      [
        {
          text: 'Update Existing',
          onPress: () => {
            // Simulate update (choose first one for demo)
            if (providers.length > 0) {
              const updated = [...providers];
              updated[0] = { ...updated[0], ...newAIProvider };
              setProviders(updated);
            } else {
              setProviders((prev) => [...prev, newAIProvider]);
            }
          },
        },
        {
          text: 'Create New',
          onPress: () => {
            setProviders((prev) => [...prev, newAIProvider]);
          },
        },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const filteredProviders = providers.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleInputChange = (key: keyof typeof form, value: string) => {
    setForm({ ...form, [key]: value });
  };

  const handleAddProvider = () => {
    if (!form.name) {
      Alert.alert('Error', 'Provider name is required.');
      return;
    }

    const newProvider: Provider = {
      id: uuidv4(),
      ...form,
    };
    setProviders((prev) => [...prev, newProvider]);
    setForm(defaultForm);
    setModalVisible(false);
  };

  const handleVoiceInput = (field: keyof typeof form) => {
    Speech.speak(`Please say your ${field}`, {
      onDone: () => console.log(`${field} voice input complete`),
    });
  };

  const handleCardPress = (id: string) => {
    setSelectedProviderId(selectedProviderId === id ? null : id);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1, backgroundColor: '#f9f9f9' }}
    >
      <View style={{ padding: 16 }}>
        <Text
          accessibilityRole="header"
          style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 12 }}
        >
          Providers & Facilities
        </Text>

        <TextInput
          placeholder="🔍 Search providers"
          accessibilityLabel="Search providers"
          style={{
            backgroundColor: 'white',
            padding: 12,
            borderRadius: 8,
            marginBottom: 16,
            fontSize: 16,
          }}
          value={search}
          onChangeText={setSearch}
        />

        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          accessibilityRole="button"
          accessibilityLabel="Add a provider or facility"
          style={{
            backgroundColor: '#007AFF',
            padding: 14,
            borderRadius: 8,
            marginBottom: 16,
            alignItems: 'center',
          }}
        >
          <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>
            ➕ Add a Provider or Facility
          </Text>
        </TouchableOpacity>

        <FlatList
          data={filteredProviders}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 80 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => handleCardPress(item.id)}
              accessibilityHint="Tap to view provider details"
              style={{
                backgroundColor: 'white',
                padding: 16,
                borderRadius: 8,
                marginBottom: 12,
                shadowColor: '#000',
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 2,
              }}
            >
              <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{item.name}</Text>
              <Text style={{ fontSize: 16, color: '#555' }}>{item.specialty}</Text>

              {selectedProviderId === item.id && (
                <View style={{ marginTop: 12 }}>
                  <Text style={{ fontSize: 15 }}>🏠 {item.address}</Text>
                  <Text style={{ fontSize: 15 }}>📞 {item.phone}</Text>
                  <Text style={{ fontSize: 15 }}>✉️ {item.email}</Text>
                  <Text style={{ fontSize: 15 }}>📠 {item.fax}</Text>
                  <Text style={{ fontSize: 15 }}>📝 {item.notes}</Text>
                </View>
              )}
            </TouchableOpacity>
          )}
        />

        <Modal visible={modalVisible} animationType="slide">
          <ScrollView contentContainerStyle={{ padding: 16 }}>
            <Text style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 16 }}>
              Add New Provider
            </Text>

            {Object.keys(form).map((field) => (
              <View key={field} style={{ marginBottom: 12 }}>
                <Text style={{ fontSize: 16, marginBottom: 4 }}>{field.charAt(0).toUpperCase() + field.slice(1)}</Text>
                <TextInput
                  placeholder={`Type ${field}`}
                  style={{
                    borderColor: '#ccc',
                    borderWidth: 1,
                    padding: 12,
                    borderRadius: 8,
                    fontSize: 16,
                  }}
                  accessibilityLabel={`Input field for ${field}`}
                  value={form[field as keyof typeof form]}
                  onChangeText={(text) => handleInputChange(field as keyof typeof form, text)}
                />
              </View>
            ))}

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }}>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={{ padding: 12, backgroundColor: '#ccc', borderRadius: 8 }}
              >
                <Text style={{ fontSize: 16 }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleAddProvider}
                style={{ padding: 12, backgroundColor: '#28a745', borderRadius: 8 }}
              >
                <Text style={{ color: 'white', fontSize: 16 }}>Submit</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </Modal>
      </View>
    </KeyboardAvoidingView>
  );
};

export default ProvidersScreen;
