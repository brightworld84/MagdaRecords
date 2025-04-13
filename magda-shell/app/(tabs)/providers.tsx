import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  Modal,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
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
  const insets = useSafeAreaInsets();
  const [providers, setProviders] = useState<Provider[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [newProvider, setNewProvider] = useState<Provider>({
    id: '',
    name: '',
    specialty: '',
    address: '',
    phone: '',
    email: '',
    fax: '',
    notes: '',
  });

  const filteredProviders = providers.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.specialty.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddProvider = () => {
    if (!newProvider.name.trim()) return;
    const newEntry = { ...newProvider, id: uuidv4() };
    setProviders(prev => [...prev, newEntry]);
    setNewProvider({
      id: '',
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

  const simulateAIDetection = () => {
    const aiProvider: Provider = {
      id: uuidv4(),
      name: 'Dr. Jane Smith',
      specialty: 'Endocrinology',
      address: '456 Wellness Blvd, Healthville',
      phone: '(987) 654-3210',
      email: 'jane.smith@endoclinic.com',
      fax: '(987) 654-3211',
      notes: 'Visit on March 3, 2025',
    };
    setProviders(prev => [...prev, aiProvider]);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1 }}
      keyboardVerticalOffset={100}
    >
      <View style={{ flex: 1, paddingTop: insets.top + 10, padding: 16, backgroundColor: '#fff' }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 16 }}>Your Providers</Text>

        <View style={{ flexDirection: 'row', marginBottom: 12 }}>
          <TextInput
            placeholder="🔍 Search by name or specialty"
            placeholderTextColor="#999"
            style={{
              flex: 1,
              borderWidth: 1,
              borderColor: '#ccc',
              borderRadius: 8,
              padding: 10,
              fontSize: 16
            }}
            value={searchTerm}
            onChangeText={setSearchTerm}
          />
        </View>

        <FlatList
          data={filteredProviders}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={<Text style={{ color: '#777', marginTop: 20 }}>No providers found.</Text>}
          renderItem={({ item }) => (
            <View
              style={{
                backgroundColor: '#f9f9f9',
                borderRadius: 12,
                padding: 14,
                marginBottom: 12,
                borderColor: '#ddd',
                borderWidth: 1
              }}
            >
              <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{item.name}</Text>
              {item.specialty ? (
                <Text style={{ color: '#555', marginBottom: 8 }}>{item.specialty}</Text>
              ) : null}
              <Text style={{ marginBottom: 2 }}>🏠 {item.address}</Text>
              <Text style={{ marginBottom: 2 }}>📞 {item.phone}</Text>
              <Text style={{ marginBottom: 2 }}>✉️ {item.email}</Text>
              <Text style={{ marginBottom: 2 }}>📠 {item.fax}</Text>
              <Text style={{ color: '#555', marginTop: 6 }}>📝 {item.notes}</Text>
            </View>
          )}
        />

        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          style={{
            backgroundColor: '#007AFF',
            padding: 14,
            borderRadius: 10,
            alignItems: 'center',
            marginTop: 12
          }}
        >
          <Text style={{ color: 'white', fontSize: 16 }}>➕ Add a Provider or Facility</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={simulateAIDetection}
          style={{
            backgroundColor: '#34C759',
            padding: 14,
            borderRadius: 10,
            alignItems: 'center',
            marginTop: 10
          }}
        >
          <Text style={{ color: 'white', fontSize: 16 }}>🧠 Detect Provider from Uploaded Files</Text>
        </TouchableOpacity>

        <Modal visible={modalVisible} animationType="slide">
          <ScrollView
            contentContainerStyle={{
              padding: 20,
              paddingBottom: 40,
              backgroundColor: '#fff'
            }}
          >
            <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 20 }}>
              Add New Provider
            </Text>

            {[
              { key: 'name', label: 'Name or Facility', placeholder: '🏥 Enter name or facility' },
              { key: 'specialty', label: 'Specialty', placeholder: '💼 Enter specialty' },
              { key: 'address', label: 'Address', placeholder: '🏠 Enter address' },
              { key: 'phone', label: 'Phone', placeholder: '📞 Enter phone number' },
              { key: 'email', label: 'Email', placeholder: '✉️ Enter email' },
              { key: 'fax', label: 'Fax', placeholder: '📠 Enter fax number' },
              { key: 'notes', label: 'Notes', placeholder: '📝 Notes (e.g., visit dates)' }
            ].map((field) => (
              <View key={field.key} style={{ marginBottom: 16 }}>
                <Text style={{ fontWeight: '600', marginBottom: 4 }}>{field.label}</Text>
                <TextInput
                  placeholder={field.placeholder}
                  placeholderTextColor="#999"
                  style={{
                    borderWidth: 1,
                    borderColor: '#ccc',
                    borderRadius: 8,
                    padding: 10,
                    fontSize: 16
                  }}
                  value={(newProvider as any)[field.key]}
                  onChangeText={(text) =>
                    setNewProvider((prev) => ({ ...prev, [field.key]: text }))
                  }
                />
              </View>
            ))}

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }}>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={{
                  backgroundColor: '#ccc',
                  padding: 12,
                  borderRadius: 8,
                  flex: 0.45,
                  alignItems: 'center'
                }}
              >
                <Text style={{ fontWeight: '600' }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleAddProvider}
                style={{
                  backgroundColor: '#007AFF',
                  padding: 12,
                  borderRadius: 8,
                  flex: 0.45,
                  alignItems: 'center'
                }}
              >
                <Text style={{ color: 'white', fontWeight: '600' }}>Submit</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </Modal>
      </View>
    </KeyboardAvoidingView>
  );
}
