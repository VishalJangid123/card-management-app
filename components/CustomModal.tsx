import { PropsWithChildren } from "react";
import { StyleSheet, Text, View, Modal, TouchableOpacity } from "react-native";
type Props = PropsWithChildren<{
  height: string;
  isVisible: boolean;
  onClose: () => void;
}>;
export default function CustomModal({
  height,
  isVisible,
  children,
  onClose,
}: Props) {
  return (
    <Modal animationType="slide" transparent={true} visible={isVisible}>
      <TouchableOpacity
        style={{ flex: 1 }}
        onPress={() => {
          onClose();
        }}
      ></TouchableOpacity>
      <View className={`bg-white elevation ${height} rounded-3xl`}>
        <View className="h-[10%] rounded-t-full justify-center items-center">
          <View className="w-20 bg-gray-400 h-1 rounded-full"></View>
        </View>
        {children}
      </View>
    </Modal>
  );
}
