import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  AccessibilityInfo,
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

const initialProviders: Provider[] = [
  {
    id: '1',
    name: 'Dr. Jane Smith',
    specialty: 'Cardiologist',
    address: '',
    phone: '',
    email: '',
    fax: '',
    notes: '',
  },
  {
    id: '2',
    name: 'Wellness Clinic',
    specialty: 'General Practice',
    address: '',
    phone: '',
    email: '',
    fax: '',
    notes: '',
  },
];

export default function ProvidersScreen() {
  const [providers, setProviders] = useState<Provider[]>(initialProviders);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId(prev => (prev === id ? null : id));
  };

  const updateField = (id: string, field: keyof Provider, value: string) => {
    setProviders(prev =>
      prev.map(p => (p.id === id ? { ...p, [field]: value } : p))
    );
  };

  const renderProviderCard = ({ item }: { item: Provider }) => {
    const isExpanded = expandedId === item.id;

    return (
      <TouchableOpacity
        accessible
        accessibilityLabel={`Provider card for ${item.name}, ${item.specialty}`}
        accessibilityRole="button"
        onPress={() => toggleExpand(item.id)}
        style={styles.card}
      >
        <Text style={styles.providerTitle}>
          {item.name} ({item.specialty})
        </Text>

        {isExpanded && (
          <View style={styles.expandedSection}>
            <LabelInput
              label="🏥 Name or Facility"
              value={item.name}
              onChangeText={text => updateField(item.id, 'name', text)}
              placeholder="Enter provider or facility name"
            />
            <LabelInput
              label="🏠 Address"
              value={item.address}
              onChangeText={text => updateField(item.id, 'address', text)}
              placeholder="Enter address"
            />
            <LabelInput
              label="📞 Phone"
              value={item.phone}
              onChangeText={text => updateField(item.id, 'phone', text)}
              placeholder="Enter phone number"
            />
            <LabelInput
              label="✉️ Email"
              value={item.email}
              onChangeText={text => updateField(item.id, 'email', text)}
              placeholder="Enter email"
            />
            <LabelInput
              label="📠 Fax"
              value={item.fax}
              onChangeText={text => updateField(item.id, 'fax', text)}
              placeholder="Enter fax number"
            />
            <LabelInput
              label="📝 Notes"
              value={item.notes}
              onChangeText={text => updateField(item.id, 'notes', text)}
              placeholder="Add notes like visit dates or other details"
              multiline
            />
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.select({ ios: 'padding', android: undefined })}
      keyboardVerticalOffset={100}
    >
      <FlatList
        data={providers}
        keyExtractor={item => item.id}
        renderItem={renderProviderCard}
        contentContainerStyle={styles.list}
        accessibilityRole="list"
        accessibilityLabel="Provider list"
      />
    </KeyboardAvoidingView>
  );
}

const LabelInput = ({
  label,
  value,
  onChangeText,
  placeholder,
  multiline = false,
}: {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  multiline?: boolean;
}) => (
  <View style={styles.field}>
    <Text style={styles.label} accessibilityRole="text">
      {label}
    </Text>
    <TextInput
      style={[styles.input, multiline && styles.multiline]}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor="#888"
      accessibilityLabel={label}
      accessible
      multiline={multiline}
    />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafa',
  },
  list: {
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
  },
  providerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  expandedSection: {
    marginTop: 12,
  },
  field: {
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#444',
    marginBottom: 4,
  },
  input: {
    backgroundColor: '#f1f1f1',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    color: '#333',
  },
  multiline: {
    height: 80,
    textAlignVertical: 'top',
  },
});
