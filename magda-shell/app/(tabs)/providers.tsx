import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import { v4 as uuidv4 } from "uuid";
import { Ionicons } from "@expo/vector-icons";

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
  const [formData, setFormData] = useState<Omit<Provider, "id">>({
    name: "",
    specialty: "",
    address: "",
    phone: "",
    email: "",
    fax: "",
    notes: ""
  });

  const handleAddProvider = () => {
    const newProvider: Provider = { id: uuidv4(), ...formData };
    setProviders([...providers, newProvider]);
    setFormData({ name: "", specialty: "", address: "", phone: "", email: "", fax: "", notes: "" });
    setSelectedProviderId(null);
  };

  const handleRemoveProvider = (id: string) => {
    setProviders(providers.filter(p => p.id !== id));
  };

  const handleInputChange = (field: keyof Provider, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={100}
    >
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 16 }}>Your Providers</Text>

        {providers.map((provider) => (
          <TouchableOpacity
            key={provider.id}
            onPress={() =>
              setSelectedProviderId(provider.id === selectedProviderId ? null : provider.id)
            }
            style={{
              backgroundColor: "#fff",
              borderRadius: 10,
              padding: 16,
              marginBottom: 12,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 2,
            }}
            accessibilityRole="button"
            accessibilityLabel={`View details for ${provider.name}`}
          >
            <Text style={{ fontSize: 18, fontWeight: "600", marginBottom: 4 }}>
              {provider.name}
            </Text>
            <Text style={{ color: "#666" }}>{provider.specialty}</Text>

            {selectedProviderId === provider.id && (
              <View style={{ marginTop: 12 }}>
                <Text>🏠 {provider.address}</Text>
                <Text>📞 {provider.phone}</Text>
                <Text>✉️ {provider.email}</Text>
                <Text>📠 {provider.fax}</Text>
                <Text>📝 {provider.notes}</Text>
                <TouchableOpacity
                  onPress={() => handleRemoveProvider(provider.id)}
                  style={{ marginTop: 10 }}
                  accessibilityRole="button"
                  accessibilityLabel="Remove provider"
                >
                  <Text style={{ color: "red" }}>Remove</Text>
                </TouchableOpacity>
              </View>
            )}
          </TouchableOpacity>
        ))}

        <Text style={{ fontSize: 20, fontWeight: "bold", marginTop: 24, marginBottom: 8 }}>
          Add New Provider or Facility
        </Text>

        {["name", "specialty", "address", "phone", "email", "fax", "notes"].map((field) => (
          <View key={field} style={{ marginBottom: 12 }}>
            <Text style={{ fontWeight: "600", marginBottom: 4 }}>
              {field.charAt(0).toUpperCase() + field.slice(1)}
            </Text>
            <TextInput
              style={{
                borderWidth: 1,
                borderColor: "#ccc",
                borderRadius: 8,
                padding: 10,
                fontSize: 16,
              }}
              placeholder={`${
                field === "name"
                  ? "🏥 Name or Facility"
                  : field === "address"
                  ? "🏠 Address"
                  : field === "phone"
                  ? "📞 Phone"
                  : field === "email"
                  ? "✉️ Email"
                  : field === "fax"
                  ? "📠 Fax"
                  : "📝 Notes"
              }`}
              placeholderTextColor="#999"
              value={formData[field as keyof Provider]}
              onChangeText={(text) => handleInputChange(field as keyof Provider, text)}
              accessibilityLabel={`${field} input`}
              accessibilityHint={`Enter ${field} for the provider`}
            />
          </View>
        ))}

        <TouchableOpacity
          onPress={handleAddProvider}
          style={{
            backgroundColor: "#007bff",
            padding: 14,
            borderRadius: 10,
            alignItems: "center",
            marginTop: 16,
          }}
          accessibilityRole="button"
          accessibilityLabel="Add new provider or facility"
        >
          <Text style={{ color: "#fff", fontSize: 16, fontWeight: "600" }}>
            ➕ Add Provider or Facility
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
