import React from 'react';
import { TextInput, Text, View } from 'react-native';
import { Controller } from 'react-hook-form';
import { TextInputMask } from 'react-native-masked-text';

type CustomInputProps = {
  control: any;
  label: string;
  name: string;
  placeholder: string;
  error?: string;
  mask?: string;
  keyboardType?: string;
  maxLength?: number;
  onBlur?: () => void;
  children?: any
  style? : {}
};

export default function CustomInput({ control, label, name, placeholder, error, mask, keyboardType, maxLength, onBlur, children, style } : CustomInputProps) {
  return (
    <View className="mb-4">
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, value } }) => (
          <View>
            <Text className='font-bold mb-1 text-lg' >{label}</Text>
            {mask ? (
              <TextInputMask
                type="custom"
                options={{ mask }}
                className="border border-gray-300 p-3 rounded"
                style={{borderWidth: 1, borderColor: "#d1d5db", padding: 12, ...style}}
                placeholder={placeholder}
                keyboardType={keyboardType}
                value={value}
                onChangeText={onChange}
                maxLength={maxLength}
                onBlur={onBlur}
              />
            ) : (
              <TextInput
                className="border border-gray-300 p-3 rounded"
                placeholder={placeholder}
                keyboardType={keyboardType}
                value={value}
                onChangeText={onChange}
                maxLength={maxLength}
                onBlur={onBlur}
                style={{...style}}
              />
            )}
            {children}
            {error && <Text className="text-red-500 text-xs">{error}</Text>}
          </View>
        )}
      />
    </View>
  );
};

