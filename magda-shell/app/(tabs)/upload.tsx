// app/(tabs)/upload.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  Button,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  TextInput,
  StyleSheet,
} from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';

export default function UploadPage() {
  const [selectedFiles, setSelectedFiles] = useState<any[]>([]);
  const [note, setNote] = useState('');

  const handlePickDocument = async () => {
    const result = await DocumentPicker.getDocumentAsync({ type: '*/*' });
    if (!result.canceled && result.assets?.length) {
      setSelectedFiles([...selectedFiles, result.assets[0]]);
    }
  };

  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });
    if (!result.canceled) {
      setSelectedFiles([...selectedFiles, result.assets[0]]);
    }
  };

  const handleSimulateEmail = () => {
    const mockFile = {
      name: 'Simulated_Emailed_Record.pdf',
      uri: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      type: 'application/pdf',
    };
    setSelectedFiles([...selectedFiles, mockFile]);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Upload Medical Records</Text>

        <Button title="Pick Document" onPress={handlePickDocument} />
        <View style={styles.spacer} />
        <Button title="Pick Image" onPress={handlePickImage} />
        <View style={styles.spacer} />
        <Button title="Simulate Emailed Record" onPress={handleSimulateEmail} />
        <View style={styles.spacer} />

        <Text style={styles.subtitle}>Notes (Optional)</Text>
        <TextInput
          placeholder="Write a note about this upload..."
          style={styles.textInput}
          value={note}
          onChangeText={setNote}
          multiline
        />

        <View style={styles.spacer} />
        <Text style={styles.subtitle}>Selected Files:</Text>
        {selectedFiles.map((file, index) => (
          <Text key={index} style={styles.fileName}>
            {file.name || file.uri}
          </Text>
        ))}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 100,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  spacer: {
    height: 12,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 8,
    padding: 10,
    minHeight: 60,
    textAlignVertical: 'top',
  },
  fileName: {
    fontSize: 14,
    color: '#333',
    marginTop: 4,
  },
});
