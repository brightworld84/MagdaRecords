import React, { useState } from 'react';
import { View, Text, Button, FlatList, Image, StyleSheet, ScrollView, Alert } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';

type FileAsset = DocumentPicker.DocumentPickerAsset;

export default function UploadScreen() {
  const [files, setFiles] = useState<FileAsset[]>([]);
  const [images, setImages] = useState<string[]>([]);

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
      mediaTypes: [ImagePicker.MediaType.IMAGE],
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
});
