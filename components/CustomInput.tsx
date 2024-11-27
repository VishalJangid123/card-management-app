import React from 'react';
import { TextInput, Text, View } from 'react-native';
import { TextInputMask } from 'react-native-masked-text';

type CustomInputProps = {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  error?: string;
  mask?: string;
  keyboardType?: string;
  maxLength?: number;
  onBlur?: () => void;
  children?: any;
  style?: {};
};

export default function CustomInput({
  label,
  value,
  onChangeText,
  placeholder,
  error,
  mask,
  keyboardType,
  maxLength,
  onBlur,
  children,
  style,
}: CustomInputProps) {
  return (
    <View style={{ marginBottom: 16 }}>
      <Text style={{ fontWeight: 'bold', marginBottom: 4, fontSize: 16 }}>{label}</Text>
      {mask ? (
        <TextInputMask
          type="custom"
          options={{ mask }}
          style={{
            borderWidth: 1,
            borderColor: error ? 'red' : '#d1d5db',
            padding: 12,
            borderRadius: 4,
            ...style,
          }}
          placeholder={placeholder}
          keyboardType={keyboardType}
          value={value}
          onChangeText={onChangeText}
          maxLength={maxLength}
          onBlur={onBlur}
        />
      ) : (
        <TextInput
          style={{
            borderWidth: 1,
            borderColor: error ? 'red' : '#d1d5db',
            padding: 12,
            borderRadius: 4,
            ...style,
          }}
          placeholder={placeholder}
          keyboardType={keyboardType}
          value={value}
          onChangeText={onChangeText}
          maxLength={maxLength}
          onBlur={onBlur}
        />
      )}
      {children}
      {error && <Text style={{ color: 'red', fontSize: 12 }}>{error}</Text>}
    </View>
  );
}
