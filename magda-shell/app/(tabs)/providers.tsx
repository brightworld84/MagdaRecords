import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

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

const initialFormState: Omit<Provider, 'id'> = {
  name: '',
  specialty: '',
  address: '',
  phone: '',
  email: '',
  fax: '',
  notes: '',
};

export default function ProvidersScreen() {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [selectedProviderId, setSelectedProviderId] = useState<string | null>(null);
  const [formData, setFormData] = useState(initialFormState);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProviders = providers.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.specialty.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = () => {
    if (!formData.name.trim()) {
      Alert.alert('Provider name is required');
      return;
    }

    if (selectedProviderId) {
      setProviders(prev =>
        prev.map(p =>
          p.id === selectedProviderId ? { ...p, ...formData } : p
        )
      );
    } else {
      const newProvider: Provider = {
        id: Date.now().toString(), // fallback unique ID
        ...formData,
      };
      setProviders(prev => [...prev, newProvider]);
    }

    setFormData(initialFormState);
    setSelectedProviderId(null);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const handleEdit = (provider: Provider) => {
    setFormData({ ...provider });
    setSelectedProviderId(provider.id);
  };

  const handleDelete = (id: string) => {
    Alert.alert('Confirm Delete', 'Are you sure you want to delete this provider?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => setProviders(prev => prev.filter(p => p.id !== id)),
      },
    ]);
  };

  const simulateAIDetection = () => {
    const simulatedProvider: Omit<Provider, 'id'> = {
      name: 'Dr. Jane Doe',
      specialty: 'Cardiology',
      address: '123 Heart St, Pulse City',
      phone: '555-123-4567',
      email: 'jane.doe@healthcare.com',
      fax: '555-123-9876',
      notes: 'Initial visit: Jan 2024',
    };

    Alert.alert('AI Provider Detected', 'Would you like to add or update this provider?', [
      {
        text: 'Add New',
        onPress: () => setProviders(prev => [...prev, { id: Date.now().toString(), ...simulatedProvider }]),
      },
      {
        text: 'Update Existing',
        onPress: () => {
          const match = providers.find(p => p.name === simulatedProvider.name);
          if (match) {
            handleEdit({ ...match, ...simulatedProvider });
          } else {
            Alert.alert('No matching provider found');
          }
        },
      },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: '#f5f5f5' }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <Text style={{ fontSize: 26, fontWeight: 'bold', marginBottom: 12 }}>Your Providers</Text>

        <View style={{ marginBottom: 16 }}>
          <TextInput
            placeholder="🔍 Search providers..."
            placeholderTextColor="#888"
            value={searchTerm}
            onChangeText={setSearchTerm}
            style={{
              backgroundColor: '#fff',
              padding: 12,
              borderRadius: 8,
              fontSize: 18,
              marginBottom: 8,
              borderWidth: 1,
              borderColor: '#ddd',
            }}
            accessible
            accessibilityLabel="Search providers"
          />
        </View>

        <TouchableOpacity
          onPress={simulateAIDetection}
          style={{
            backgroundColor: '#007AFF',
            padding: 14,
            borderRadius: 10,
            alignItems: 'center',
            marginBottom: 20,
          }}
          accessible
          accessibilityLabel="Use AI to detect provider"
        >
          <Text style={{ color: 'white', fontSize: 18 }}>🧠 Use AI to Detect Provider</Text>
        </TouchableOpacity>

        <View style={{ marginBottom: 28 }}>
          <Text style={{ fontSize: 20, fontWeight: '600', marginBottom: 8 }}>Add or Edit Provider</Text>

          {Object.entries(formData).map(([key, value]) => (
            <View key={key} style={{ marginBottom: 14 }}>
              <Text style={{ fontSize: 16, fontWeight: '500', marginBottom: 4 }}>
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </Text>
              <TextInput
                placeholder={`Enter ${key}...`}
                placeholderTextColor="#888"
                value={value}
                onChangeText={text => handleInputChange(key as keyof typeof formData, text)}
                style={{
                  backgroundColor: '#fff',
                  padding: 12,
                  borderRadius: 8,
                  fontSize: 18,
                  borderWidth: 1,
                  borderColor: '#ccc',
                }}
                accessible
                accessibilityLabel={`${key} input`}
              />
            </View>
          ))}

          <TouchableOpacity
            onPress={handleSubmit}
            style={{
              backgroundColor: '#34C759',
              padding: 16,
              borderRadius: 12,
              alignItems: 'center',
              marginTop: 10,
            }}
            accessible
            accessibilityLabel="Submit provider"
          >
            <Text style={{ color: 'white', fontSize: 18 }}>
              {selectedProviderId ? 'Update Provider' : 'Add Provider'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={{ marginTop: 12 }}>
          {filteredProviders.map(provider => (
            <View
              key={provider.id}
              style={{
                backgroundColor: '#fff',
                borderRadius: 10,
                padding: 14,
                marginBottom: 12,
                borderWidth: 1,
                borderColor: '#ddd',
              }}
              accessible
              accessibilityRole="button"
              accessibilityLabel={`Provider: ${provider.name}`}
            >
              <Text style={{ fontSize: 18, fontWeight: '600', marginBottom: 4 }}>{provider.name}</Text>
              <Text style={{ fontSize: 16, color: '#555', marginBottom: 8 }}>{provider.specialty}</Text>

              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <TouchableOpacity onPress={() => handleEdit(provider)} accessibilityLabel="Edit provider">
                  <Ionicons name="create-outline" size={24} color="#007AFF" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDelete(provider.id)} accessibilityLabel="Delete provider">
                  <Ionicons name="trash-outline" size={24} color="#FF3B30" />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
