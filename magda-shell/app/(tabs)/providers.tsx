import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import uuid from 'react-native-uuid';
import Icon from 'react-native-vector-icons/Ionicons';

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

export default function ProvidersScreen() {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [selectedProviderId, setSelectedProviderId] = useState<string | null>(null);
  const [newProvider, setNewProvider] = useState<Omit<Provider, 'id'>>({
    name: '',
    specialty: '',
    address: '',
    phone: '',
    email: '',
    fax: '',
    notes: '',
  });

  const handleAddProvider = () => {
    const id = uuid.v4() as string;
    const provider: Provider = { id, ...newProvider };
    setProviders(prev => [...prev, provider]);
    setNewProvider({
      name: '',
      specialty: '',
      address: '',
      phone: '',
      email: '',
      fax: '',
      notes: '',
    });
  };

  const handleDeleteProvider = (id: string) => {
    setProviders(prev => prev.filter(p => p.id !== id));
    setSelectedProviderId(null);
  };

  const handleUpdateProvider = (updated: Provider) => {
    setProviders(prev => prev.map(p => (p.id === updated.id ? updated : p)));
  };

  const handleInputChange = (field: keyof Omit<Provider, 'id'>, value: string) => {
    setNewProvider(prev => ({ ...prev, [field]: value }));
  };

  const selectedProvider = providers.find(p => p.id === selectedProviderId);

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={100}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Text style={styles.title}>Add New Provider or Facility</Text>

          {Object.entries(newProvider).map(([field, value]) => (
            <TextInput
              key={field}
              placeholder={`Enter ${field}`}
              placeholderTextColor="#999"
              style={styles.input}
              value={value}
              accessibilityLabel={`Enter ${field}`}
              onChangeText={val =>
                handleInputChange(field as keyof Omit<Provider, 'id'>, val)
              }
            />
          ))}

          <TouchableOpacity
            style={styles.addButton}
            onPress={handleAddProvider}
            accessibilityRole="button"
            accessibilityLabel="Add a new provider or facility"
          >
            <Text style={styles.addButtonText}>➕ Add Provider or Facility</Text>
          </TouchableOpacity>

          <Text style={styles.title}>Your Providers</Text>

          {providers.length === 0 && (
            <Text style={styles.noProviders}>No providers added yet.</Text>
          )}

          {providers.map(provider => (
            <TouchableOpacity
              key={provider.id}
              onPress={() =>
                setSelectedProviderId(
                  selectedProviderId === provider.id ? null : provider.id
                )
              }
              style={[
                styles.card,
                selectedProviderId === provider.id && styles.selectedCard,
              ]}
              accessibilityRole="button"
              accessibilityLabel={`Provider card for ${provider.name}`}
            >
              <Text style={styles.cardTitle}>{provider.name}</Text>
              <Text style={styles.cardSubtitle}>{provider.specialty}</Text>

              {selectedProviderId === provider.id && (
                <>
                  {Object.entries(provider).map(([key, val]) =>
                    key !== 'id' ? (
                      <Text key={key} style={styles.cardDetail}>
                        {key}: {val}
                      </Text>
                    ) : null
                  )}
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() =>
                      Alert.alert(
                        'Delete Provider',
                        'Are you sure you want to delete this provider?',
                        [
                          { text: 'Cancel', style: 'cancel' },
                          { text: 'Delete', onPress: () => handleDeleteProvider(provider.id) },
                        ]
                      )
                    }
                    accessibilityRole="button"
                    accessibilityLabel={`Delete provider ${provider.name}`}
                  >
                    <Text style={styles.deleteButtonText}>🗑️ Delete</Text>
                  </TouchableOpacity>
                </>
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  scrollContainer: {
    paddingBottom: 100,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    paddingVertical: 12,
    textAlign: 'center',
    color: '#212529',
  },
  input: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 16,
    fontSize: 18,
    marginBottom: 12,
    borderColor: '#ced4da',
    borderWidth: 1,
    color: '#212529',
  },
  addButton: {
    backgroundColor: '#0d6efd',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 24,
  },
  addButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  noProviders: {
    fontSize: 16,
    textAlign: 'center',
    color: '#6c757d',
    padding: 12,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    borderColor: '#dee2e6',
    borderWidth: 1,
  },
  selectedCard: {
    backgroundColor: '#e7f1ff',
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
    color: '#212529',
  },
  cardSubtitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
    color: '#495057',
  },
  cardDetail: {
    fontSize: 16,
    color: '#343a40',
    marginVertical: 2,
  },
  deleteButton: {
    backgroundColor: '#dc3545',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12,
  },
  deleteButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});
