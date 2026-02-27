import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export const Watermark = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Isaac_E © 2025 All rights reserved</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    opacity: 0.5, 
    marginTop: 'auto',
  },
  text: {
    color: '#aaa', 
    fontSize: 10,
    fontWeight: '500',
    letterSpacing: 1,
    textTransform: 'uppercase'
  }
});