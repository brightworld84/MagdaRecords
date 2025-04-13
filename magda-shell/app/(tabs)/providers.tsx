import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Modal,
  ScrollView
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

interface Provider {
  id: string;
  name: string;
  specialty: string;
  address?: string;
  phone?: string;
  email?: string;
  fax?: string;
  notes?: string;
}

const Providers = () => {
  const [search, setSearch] = useState("");
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const [providers, setProviders] = useState<Provider[]>([
    {
      id: "1",
      name: "Dr. Emily Smith",
      specialty: "Cardiology",
      address: "",
      phone: "",
      email: "",
      fax: "",
      notes: "",
    },
    {
      id: "2",
      name: "Central Clinic",
      specialty: "General Medicine",
      address: "",
      phone: "",
      email: "",
      fax: "",
      notes: "",
    },
  ]);

  const filteredProviders = providers.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelectProvider = (provider: Provider) => {
    setSelectedProvider(provider);
    setModalVisible(true);
  };

  const handleInputChange = (field: keyof Provider, value: string) => {
    if (selectedProvider) {
      setSelectedProvider({ ...selectedProvider, [field]: value });
    }
  };

  const handleCloseModal = () => {
    if (selectedProvider) {
      const updatedList = providers.map(p =>
        p.id === selectedProvider.id ? selectedProvider : p
      );
      setProviders(updatedList);
    }
    setModalVisible(false);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={{ flex: 1, backgroundColor: "#000" }}
    >
      <View style={{ padding: 16 }}>
        <TextInput
          placeholder="Search providers"
          placeholderTextColor="#ccc"
          value={search}
          onChangeText={setSearch}
          style={{
            backgroundColor: "#1c1c1e",
            color: "#fff",
            padding: 12,
            borderRadius: 8,
            marginBottom: 12,
          }}
          accessibilityLabel="Search providers"
        />
        <FlatList
          data={filteredProviders}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleSelectProvider(item)} accessibilityLabel={`Open details for ${item.name}`}>
              <View style={{ marginBottom: 16, borderBottomWidth: 1, borderBottomColor: "#333", paddingBottom: 8 }}>
                <Text style={{ color: "#fff", fontSize: 18, fontWeight: "bold" }}>{item.name}</Text>
                <Text style={{ color: "#aaa" }}>{item.specialty}</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      </View>

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={{ flex: 1, backgroundColor: "#000", padding: 20 }}>
          <ScrollView style={{ backgroundColor: "#1c1c1e", borderRadius: 12, padding: 16 }}>
            {[
              { label: "Name or Facility", field: "name" },
              { label: "Address", field: "address" },
              { label: "Phone Number", field: "phone" },
              { label: "Email", field: "email" },
              { label: "Fax", field: "fax" },
              { label: "Notes", field: "notes" },
            ].map(({ label, field }) => (
              <View key={field} style={{ marginBottom: 12 }}>
                <Text style={{ color: "#ccc", marginBottom: 4 }}>{label}</Text>
                <View style={{ flexDirection: "row", alignItems: "center", backgroundColor: "#2c2c2e", borderRadius: 8 }}>
                  <TextInput
                    value={selectedProvider?.[field as keyof Provider]?.toString()}
                    onChangeText={(text) => handleInputChange(field as keyof Provider, text)}
                    placeholder={label}
                    placeholderTextColor="#888"
                    style={{ flex: 1, color: "#fff", padding: 10 }}
                    accessibilityLabel={`${label} input`}
                  />
                  <TouchableOpacity
                    onPress={() => {
                      // Future: Add voice input logic here
                      alert(`Voice input for ${label} coming soon!`);
                    }}
                    accessibilityLabel={`Voice input for ${label}`}
                  >
                    <MaterialIcons name="keyboard-voice" size={24} color="#999" style={{ padding: 8 }} />
                  </TouchableOpacity>
                </View>
              </View>
            ))}

            <TouchableOpacity
              onPress={handleCloseModal}
              style={{
                backgroundColor: "#007AFF",
                padding: 14,
                borderRadius: 8,
                marginTop: 20,
                alignItems: "center",
              }}
              accessibilityLabel="Save and close provider details"
            >
              <Text style={{ color: "#fff", fontWeight: "600" }}>Save & Close</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
};

export default Providers;
