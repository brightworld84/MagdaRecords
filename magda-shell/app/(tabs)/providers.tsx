// app/(tabs)/providers.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Modal, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { v4 as uuidv4 } from 'uuid';
import { Ionicons } from '@expo/vector-icons';

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

const ProvidersPage = () => {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [search, setSearch] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
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
    const newProvider: Provider = { id: uuidv4(), ...form };
    setProviders(prev => [...prev, newProvider]);
    setForm({ name: '', specialty: '', address: '', phone: '', email: '', fax: '', notes: '' });
    setModalVisible(false);
  };

  const filteredProviders = providers.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.specialty.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ padding: 16 }} keyboardShouldPersistTaps="handled">
        <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 12 }}>Providers</Text>

        <TextInput
          placeholder="Search providers"
          value={search}
          onChangeText={setSearch}
          accessibilityLabel="Search providers"
          style={{
            borderWidth: 1,
            borderColor: '#ccc',
            borderRadius: 8,
            padding: 12,
            marginBottom: 16,
            backgroundColor: '#fff'
          }}
        />

        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          style={{
            backgroundColor: '#007AFF',
            padding: 12,
            borderRadius: 8,
            marginBottom: 16,
            alignItems: 'center',
          }}
          accessibilityLabel="Add a provider or facility"
        >
          <Text style={{ color: '#fff', fontWeight: '600' }}>+ Add Provider or Facility</Text>
        </TouchableOpacity>

        {filteredProviders.map(provider => (
          <TouchableOpacity
            key={provider.id}
            accessibilityLabel={`Provider ${provider.name}`}
            style={{
              backgroundColor: '#f5f5f5',
              padding: 16,
              borderRadius: 8,
              marginBottom: 12
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{provider.name}</Text>
            <Text style={{ color: '#555' }}>{provider.specialty}</Text>
          </TouchableOpacity>
        ))}

        <Modal visible={modalVisible} animationType="slide" transparent={true}>
          <View style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.5)',
            justifyContent: 'center',
            padding: 16
          }}>
            <View style={{
              backgroundColor: '#fff',
              borderRadius: 12,
              padding: 20,
              shadowColor: '#000',
              shadowOpacity: 0.25,
              shadowRadius: 4
            }}>
              {Object.keys(form).map((field) => (
                <View key={field} style={{ marginBottom: 12 }}>
                  <Text style={{ fontWeight: '600', marginBottom: 4 }}>{field.charAt(0).toUpperCase() + field.slice(1)}</Text>
                  <TextInput
                    value={form[field as keyof typeof form]}
                    onChangeText={(value) => setForm(prev => ({ ...prev, [field]: value }))}
                    placeholder={`Enter ${field}`}
                    accessibilityLabel={`Enter ${field}`}
                    style={{
                      borderWidth: 1,
                      borderColor: '#ccc',
                      borderRadius: 8,
                      padding: 10,
                      backgroundColor: '#fafafa'
                    }}
                  />
                </View>
              ))}

              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 }}>
                <TouchableOpacity onPress={() => setModalVisible(false)}>
                  <Text style={{ color: '#007AFF', fontWeight: 'bold' }}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleAddProvider}>
                  <Text style={{ color: '#007AFF', fontWeight: 'bold' }}>Submit</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default ProvidersPage;
