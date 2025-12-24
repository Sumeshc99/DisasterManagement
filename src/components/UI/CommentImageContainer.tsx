import React from 'react';
import { View, Image, StyleSheet } from 'react-native';

interface Props {
  data: { blob_url: string }[];
}

const CommentImageContainer = ({ data }: Props) => {
  return (
    <View style={styles.container}>
      {data.map((item, index) => (
        <Image
          key={index}
          source={{ uri: item.blob_url }}
          style={styles.image}
        />
      ))}
    </View>
  );
};

export default CommentImageContainer;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
    gap: 8,
  },
  image: {
    width: 150,
    height: 100,
    borderRadius: 6,
    backgroundColor: '#eee',
  },
});
