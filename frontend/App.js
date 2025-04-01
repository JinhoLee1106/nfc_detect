import React, { useEffect, useState } from 'react';
import { View, Text, Button, Alert, TextInput, StyleSheet } from 'react-native';
import NfcManager, { NfcTech } from 'react-native-nfc-manager';

export default function App() {
  const [tagInfo, setTagInfo] = useState(null);
  const [userName, setUserName] = useState('');
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    NfcManager.start()
      .then(() => console.log('✅ NFC Manager started'))
      .catch(err => console.warn('❌ NFC Init Error', err));
  }, []);

  const readTag = async () => {
    try {
      await NfcManager.requestTechnology(NfcTech.Ndef);
      const tag = await NfcManager.getTag();
      console.log('📡 Tag detected:', tag);

      const tagId = tag.id.toLowerCase();
      if (!tagId) {
        Alert.alert('⚠️ Error', 'Cannot read NFC tag ID.');
        return;
      }

      const response = await fetch(`http://10.136.18.45:8000/api/tags/${tagId}/`);

      if (response.ok) {
        const data = await response.json();
        data.tag_id = data.tag_id.toLowerCase();
        setTagInfo(data);
        setUserName(data.user_name);
        setUserRole(data.user_role);
      } else if (response.status === 404) {
        const doubleCheck = await fetch(`http://10.136.18.45:8000/api/tags/${tagId}/`);
          if (doubleCheck.ok) {
            const data = await doubleCheck.json();
            setTagInfo(data);
            setUserName(data.user_name);
            setUserRole(data.user_role);
            return;
          }
        const newTag = {
          tag_id: tagId,
          user_name: 'Sample',
          user_role: 'Sample',
          auth_hash: 'some_random_hash_here',
        };

        const createResponse = await fetch(`http://10.136.18.45:8000/api/tags/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newTag),
        });

        if (createResponse.ok) {
          const createdData = await createResponse.json();
          createdData.tag_id = createdData.tag_id.toLowerCase();
          setTagInfo(createdData);
          setUserName(createdData.user_name);
          setUserRole(createdData.user_role);
          Alert.alert('✅ New tag registered', tagId);
        } else {
          Alert.alert('❌ Register failed ', 'Server Error');
        }
      }

      await NfcManager.cancelTechnologyRequest();
    } catch (e) {
      console.warn('❌ Fail to read tag', e);
      NfcManager.cancelTechnologyRequest();
    }
  };

  const updateTag = async () => {
    if (!tagInfo || !tagInfo.tag_id) {
      Alert.alert('⚠️ Error', 'No tag info.');
      return;
    }

    const updatedData = {
      user_name: userName,
      user_role: userRole,
    };

    const res = await fetch(`http://10.136.18.45:8000/api/tags/${tagInfo.tag_id}/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ...tagInfo, ...updatedData }),
    });

    if (res.ok) {
      const updated = await res.json();
      setTagInfo(updated);
      Alert.alert('✅ Tag info. edited');
    } else {
      Alert.alert('❌ Edit failed', 'Server Error');
    }
  };

  const deleteTag = async () => {
    if (!tagInfo || !tagInfo.tag_id) {
      Alert.alert('⚠️ Error', 'No tag info.');
      return;
    }

    const res = await fetch(`http://10.136.18.45:8000/api/tags/${tagInfo.tag_id}/`, {
      method: 'DELETE',
    });

    if (res.ok) {
      Alert.alert('🗑️ Tag deleted');
      setTagInfo(null);
      setUserName('');
      setUserRole('');
    } else {
      Alert.alert('❌ Fail to delete', 'Server Error');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>NFC App</Text>
      <Button title="Read NFC tag" onPress={readTag} />

      {tagInfo && (
        <View style={styles.form}>
          <Text style={styles.label}>name</Text>
          <TextInput style={styles.input} value={userName} onChangeText={setUserName} />

          <Text style={styles.label}>role</Text>
          <TextInput style={styles.input} value={userRole} onChangeText={setUserRole} />

          <Button title="Edit info." onPress={updateTag} />
          <View style={{ height: 10 }} />
          <Button title="Delete Tag" color="red" onPress={deleteTag} />

          <Text style={styles.meta}>
            Register: {new Date(tagInfo.created_at).toLocaleString()}
            {"\n"}
            Edit: {new Date(tagInfo.updated_at).toLocaleString()}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 24, marginBottom: 20 },
  form: { marginTop: 30, width: '100%' },
  label: { marginTop: 10, fontSize: 16 },
  input: {
    borderWidth: 1, borderColor: '#ccc', borderRadius: 4,
    padding: 10, marginTop: 5, marginBottom: 10
  },
  meta: { marginTop: 20, fontSize: 12, color: '#666', textAlign: 'center' },
});
