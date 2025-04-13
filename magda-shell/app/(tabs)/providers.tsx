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
  ScrollView,
  KeyboardAvoidingView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
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

const ProvidersScreen = () => {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [activeProvider, setActiveProvider] = useState<Provider | null>(null);

  const handleOpenProvider = (provider: Provider) => {
    setActiveProvider(provider);
    setModalVisible(true);
  };

  const handleDeleteProvider = (id: string) => {
    Alert.alert('Delete Provider', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          setProviders(prev => prev.filter(p => p.id !== id));
          setModalVisible(false);
        },
      },
    ]);
  };

  const handleSaveProvider = () => {
    if (activeProvider) {
      setProviders(prev => {
        const exists = prev.find(p => p.id === activeProvider.id);
        if (exists) {
          return prev.map(p => (p.id === activeProvider.id ? activeProvider : p));
        } else {
          return [...prev, { ...activeProvider, id: uuidv4() }];
        }
      });
      setModalVisible(false);
    }
  };

  const renderProviderCard = ({ item }: { item: Provider }) => (
    <TouchableOpacity
      onPress={() => handleOpenProvider(item)}
      accessibilityLabel={`Open details for ${item.name}`}
      style={styles.card}
    >
      <Text style={styles.cardTitle}>{item.name}</Text>
      <Text style={styles.cardSubtitle}>{item.specialty}</Text>
    </TouchableOpacity>
  );

  const renderInput = (
    label: string,
    field: keyof Omit<Provider, 'id'>,
    placeholderIcon: keyof typeof Ionicons.glyphMap,
  ) => (
    <View style={styles.inputGroup}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputWrapper}>
        <Ionicons name={placeholderIcon} size={20} color="#666" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder={label}
          placeholderTextColor="#888"
          value={activeProvider?.[field] || ''}
          onChangeText={text => setActiveProvider(prev => prev ? { ...prev, [field]: text } : prev)}
          accessibilityLabel={label}
        />
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Providers & Facilities</Text>

      <FlatList
        data={providers}
        keyExtractor={item => item.id}
        renderItem={renderProviderCard}
        contentContainerStyle={styles.list}
        accessibilityRole="list"
      />

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => {
          setActiveProvider({
            id: '',
            name: '',
            specialty: '',
            address: '',
            phone: '',
            email: '',
            fax: '',
            notes: '',
          });
          setModalVisible(true);
        }}
        accessibilityRole="button"
        accessibilityLabel="Add a provider or facility"
      >
        <Ionicons name="add-circle-outline" size={24} color="#fff" />
        <Text style={styles.addButtonText}>Add Provider</Text>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={styles.modalContainer}
          >
            <ScrollView contentContainerStyle={styles.form}>
              <Text style={styles.modalTitle}>
                {activeProvider?.id ? 'Edit Provider' : 'Add New Provider'}
              </Text>

              {renderInput('Name or Facility', 'name', 'business')}
              {renderInput('Specialty', 'specialty', 'medkit')}
              {renderInput('Address', 'address', 'location')}
              {renderInput('Phone Number', 'phone', 'call')}
              {renderInput('Email', 'email', 'mail')}
              {renderInput('Fax Number', 'fax', 'print')}
              {renderInput('Notes (visit dates, etc.)', 'notes', 'document-text')}

              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => setModalVisible(false)}
                  accessibilityLabel="Cancel"
                >
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.modalButton, styles.saveButton]}
                  onPress={handleSaveProvider}
                  accessibilityLabel="Submit provider info"
                >
                  <Text style={styles.buttonText}>Submit</Text>
                </TouchableOpacity>
              </View>

              {activeProvider?.id && (
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleDeleteProvider(activeProvider.id)}
                  accessibilityLabel="Delete provider"
                >
                  <Ionicons name="trash" size={20} color="#fff" />
                  <Text style={styles.buttonText}>Delete</Text>
                </TouchableOpacity>
              )}
            </ScrollView>
          </KeyboardAvoidingView>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default ProvidersScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eef2f5',
  },
  header: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    marginVertical: 16,
  },
  list: {
    paddingHorizontal: 16,
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  addButton: {
    flexDirection: 'row',
    backgroundColor: '#007AFF',
    padding: 14,
    margin: 20,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 18,
    marginLeft: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: '#0006',
    justifyContent: 'center',
  },
  modalContainer: {
    margin: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
    textAlign: 'center',
  },
  form: {
    paddingBottom: 32,
  },
  inputGroup: {
    marginBottom: 14,
  },
  label: {
    fontSize: 14,
    marginBottom: 6,
    color: '#333',
    fontWeight: '500',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: '#f8f9fb',
  },
  icon: {
    marginRight: 6,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#000',
    paddingVertical: 10,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  modalButton: {
    flex: 1,
    padding: 14,
    borderRadius: 10,
    marginHorizontal: 6,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#aaa',
  },
  saveButton: {
    backgroundColor: '#007AFF',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  deleteButton: {
    marginTop: 16,
    backgroundColor: '#FF3B30',
    borderRadius: 10,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
