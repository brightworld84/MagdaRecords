import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Modal,
  StyleSheet,
  SafeAreaView,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  Pressable
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

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
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [newProvider, setNewProvider] = useState<Omit<Provider, "id">>({
    name: "",
    specialty: "",
    address: "",
    phone: "",
    email: "",
    fax: "",
    notes: "",
  });

  const insets = useSafeAreaInsets();

  const handleAddProvider = () => {
    const id = Date.now().toString();
    setProviders([...providers, { id, ...newProvider }]);
    setNewProvider({
      name: "",
      specialty: "",
      address: "",
      phone: "",
      email: "",
      fax: "",
      notes: "",
    });
    setModalVisible(false);
  };

  const handleSelectProvider = (provider: Provider) => {
    setSelectedProvider(provider);
  };

  return (
    <SafeAreaView style={[styles.safeArea, { paddingTop: insets.top || 20 }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <View style={styles.container}>
          <Text style={styles.title}>Your Providers</Text>

          <FlatList
            data={providers}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.list}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.card}
                onPress={() => handleSelectProvider(item)}
                accessible
                accessibilityLabel={`View details for ${item.name}, ${item.specialty}`}
              >
                <Text style={styles.cardTitle}>{item.name}</Text>
                <Text style={styles.cardSubtitle}>{item.specialty}</Text>
              </TouchableOpacity>
            )}
          />

          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setModalVisible(true)}
            accessible
            accessibilityLabel="Add new provider"
          >
            <AntDesign name="pluscircle" size={28} color="#fff" />
          </TouchableOpacity>

          <Modal visible={modalVisible} animationType="slide">
            <SafeAreaView style={styles.modalContainer}>
              <ScrollView
                contentContainerStyle={styles.scrollContainer}
                keyboardShouldPersistTaps="handled"
              >
                <Text style={styles.modalTitle}>Add Provider</Text>
                {Object.keys(newProvider).map((key) => (
                  <View key={key} style={styles.inputGroup}>
                    <Text style={styles.label}>{key[0].toUpperCase() + key.slice(1)}</Text>
                    <TextInput
                      style={styles.input}
                      placeholder={`Enter ${key}`}
                      placeholderTextColor="#999"
                      value={newProvider[key as keyof typeof newProvider]}
                      onChangeText={(text) =>
                        setNewProvider((prev) => ({ ...prev, [key]: text }))
                      }
                      accessible
                      accessibilityLabel={`${key} input`}
                    />
                  </View>
                ))}
                <View style={styles.modalActions}>
                  <Pressable
                    style={[styles.button, styles.cancel]}
                    onPress={() => setModalVisible(false)}
                    accessibilityLabel="Cancel adding provider"
                  >
                    <Text style={styles.buttonText}>Cancel</Text>
                  </Pressable>
                  <Pressable
                    style={[styles.button, styles.submit]}
                    onPress={handleAddProvider}
                    accessibilityLabel="Submit new provider"
                  >
                    <Text style={styles.buttonText}>Submit</Text>
                  </Pressable>
                </View>
              </ScrollView>
            </SafeAreaView>
          </Modal>

          <Modal visible={!!selectedProvider} animationType="slide">
            <SafeAreaView style={styles.modalContainer}>
              <ScrollView contentContainerStyle={styles.scrollContainer}>
                <Text style={styles.modalTitle}>Provider Details</Text>
                {selectedProvider &&
                  Object.entries(selectedProvider).map(([key, value]) => (
                    key !== "id" && (
                      <View key={key} style={styles.inputGroup}>
                        <Text style={styles.label}>{key[0].toUpperCase() + key.slice(1)}</Text>
                        <Text style={styles.detail}>{value}</Text>
                      </View>
                    )
                  ))}
                <Pressable
                  style={[styles.button, styles.cancel]}
                  onPress={() => setSelectedProvider(null)}
                  accessibilityLabel="Close provider details"
                >
                  <Text style={styles.buttonText}>Close</Text>
                </Pressable>
              </ScrollView>
            </SafeAreaView>
          </Modal>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f9f9f9",
  },
  title: {
    fontSize: 22,
    fontWeight: "600",
    marginBottom: 12,
    color: "#333",
  },
  list: {
    paddingBottom: 80,
  },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111",
  },
  cardSubtitle: {
    fontSize: 14,
    color: "#555",
  },
  addButton: {
    position: "absolute",
    right: 20,
    bottom: 20,
    backgroundColor: "#007AFF",
    borderRadius: 30,
    padding: 10,
    elevation: 5,
  },
  modalContainer: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  scrollContainer: {
    paddingBottom: 40,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 14,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 4,
    color: "#222",
  },
  input: {
    height: 44,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: "#fafafa",
  },
  detail: {
    fontSize: 16,
    color: "#333",
    paddingVertical: 6,
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 8,
    marginHorizontal: 8,
  },
  cancel: {
    backgroundColor: "#ccc",
  },
  submit: {
    backgroundColor: "#007AFF",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
  },
});
