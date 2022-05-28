import React from 'react';
import { Image, StyleSheet } from 'react-native';

export default function Logo() {
  return (
    <Image source={require('../../assets/logo2.png')} style={styles.image} />
  );
}

const styles = StyleSheet.create({
  image: {
    width: 155,
    height: 155,
    marginBottom: 8,
  },
});
