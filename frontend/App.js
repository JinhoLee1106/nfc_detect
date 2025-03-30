import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

export default function App() {
  const [tags, setTags] = useState([]);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/tags/')
      .then(res => res.json())
      .then(data => setTags(data))
      .catch(err => console.error('API fetch error:', err));
  }, []);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>등록된 NFC 태그</Text>
      {tags.map((tag) => (
        <View key={tag.tag_id} style={styles.tagItem}>
          <Text>ID: {tag.tag_id}</Text>
          <Text>이름: {tag.user_name}</Text>
          <Text>역할: {tag.user_role}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    marginTop: 50,
  },
  title: {
    fontSize: 20,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  tagItem: {
    marginBottom: 15,
    padding: 10,
    borderWidth: 1,
    borderRadius: 5,
  },
});
