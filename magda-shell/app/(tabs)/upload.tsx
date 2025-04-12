import React, { useState } from 'react';
import {
  View,
  Text,
  Button,
  FlatList,
  Image,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import * as AuthSession from 'expo-auth-session';

type FileAsset = DocumentPicker.DocumentPickerAsset;

const discovery = {
  authorizationEndpoint: 'https://open-ic.epic.com/Authorization/OAuth2/Authorize',
  tokenEndpoint: 'https://open-ic.epic.com/Authorization/OAuth2/Token',
};

const clientId = 'acbd5e4e-ec89-4f26-b25b-9b9ff2e40985';
const redirectUri = 'https://auth.expo.dev/@brightworld/magda-shell';
console.log('Redirect URI:', redirectUri);

export default function UploadScreen() {
  const [files, setFiles] = useState<FileAsset[]>([]);
  const [images, setImages] = useState<string[]>([]);
  const [patient, setPatient] = useState<any>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  const pickDocument = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: '*/*',
      multiple: true,
      copyToCacheDirectory: true,
    });

    if (result.assets) {
      setFiles((prev) => [...prev, ...result.assets]);
    }
  };

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission needed', 'Camera roll access is required.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImages((prev) => [...prev, result.assets[0].uri]);
    }
  };

  const takePhoto = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission needed', 'Camera access is required.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImages((prev) => [...prev, result.assets[0].uri]);
    }
  };

  const simulateEmailUpload = async () => {
    const fakeFile = {
      name: 'EmailedRecord.pdf',
      uri: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      mimeType: 'application/pdf',
      size: 23456,
    };

    setFiles((prev) => [...prev, fakeFile as DocumentPicker.DocumentPickerAsset]);
  };

  const connectToFhir = async () => {
    const authRequest = new AuthSession.AuthRequest({
      clientId,
      redirectUri,
      scopes: ['launch', 'patient/*.read', 'offline_access', 'openid', 'fhirUser'],
      responseType: AuthSession.ResponseType.Code,
    });

    // @ts-expect-error: useProxy is not typed but works at runtime
    const result = await authRequest.promptAsync(discovery, { useProxy: true });

    if (result.type === 'success') {
      const code = result.params.code;

      const tokenResponse = await AuthSession.exchangeCodeAsync(
        {
          clientId,
          redirectUri,
          code,
          extraParams: {
            grant_type: 'authorization_code',
          },
        },
        discovery
      );

      const token = tokenResponse.accessToken;
      setAccessToken(token);

      const patientRes = await fetch('https://open-ic.epic.com/FHIR/api/FHIR/R4/Patient', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await patientRes.json();
      const patientData = data.entry?.[0]?.resource;

      if (patientData) {
        setPatient({
          name: `${patientData.name?.[0]?.given?.[0] || ''} ${patientData.name?.[0]?.family || ''}`,
          birthDate: patientData.birthDate,
          gender: patientData.gender,
        });
      }
    } else {
      Alert.alert('Login failed', 'Unable to authenticate with Epic sandbox.');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>⬆️ Upload Medical Records</Text>

      <Button title="📂 Select Files" onPress={pickDocument} />
      <View style={styles.spacer} />

      <Button title="🖼️ Choose Image from Gallery" onPress={pickImage} />
      <View style={styles.spacer} />

      <Button title="📸 Take Photo" onPress={takePhoto} />
      <View style={styles.spacer} />

      <Button title="📧 Simulate Emailed Record" onPress={simulateEmailUpload} />
      <View style={styles.spacer} />

      <Button title="🌐 Connect to Hospital System" onPress={connectToFhir} />
      <View style={styles.sectionTitle}>
        <Text style={styles.subHeader}>Selected Files:</Text>
      </View>

      {files.length > 0 && (
        <FlatList
          data={files}
          keyExtractor={(item) => item.uri}
          renderItem={({ item }) => (
            <View style={styles.fileItem}>
              <Text>{item.name}</Text>
              <Text style={styles.size}>
                {item.size ? `${(item.size / 1024).toFixed(2)} KB` : 'Unknown size'}
              </Text>
            </View>
          )}
        />
      )}

      {images.length > 0 && (
        <View style={styles.imagePreview}>
          <Text style={styles.subHeader}>Photos:</Text>
          {images.map((uri, index) => (
            <Image key={index} source={{ uri }} style={styles.image} />
          ))}
        </View>
      )}

      {patient && (
        <View style={styles.fhirBox}>
          <Text style={styles.subHeader}>✅ Connected to Hospital System</Text>
          <Text>Name: {patient.name}</Text>
          <Text>DOB: {patient.birthDate}</Text>
          <Text>Gender: {patient.gender}</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
  spacer: { height: 10 },
  fileItem: { marginTop: 10, padding: 10, borderBottomWidth: 1, borderColor: '#ccc' },
  size: { fontSize: 12, color: '#777' },
  sectionTitle: { marginTop: 20 },
  subHeader: { fontSize: 16, fontWeight: '600', marginBottom: 5 },
  imagePreview: { marginTop: 20 },
  image: { width: '100%', height: 200, marginBottom: 10, borderRadius: 8 },
  fhirBox: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#E9F7EF',
    borderRadius: 10,
    borderColor: '#2ECC71',
    borderWidth: 1,
  },
});
