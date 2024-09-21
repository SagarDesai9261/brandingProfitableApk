// CustomSuccessModal.js

import React from 'react';
import { View, Text, Modal, TouchableOpacity } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const CustomSuccessModal = ({ visible, closeModal, isFailer }) => {
    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={() => closeModal()}
        >
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.8)' }}>
                <View
                    style={{
                        backgroundColor: 'white',
                        padding: isFailer?40:20,
                        borderRadius: 10,
                        alignItems: 'center',
                    }}
                >
                    <FontAwesome name={isFailer ? "times-circle" : "check-circle"} size={50} color={isFailer ? "red" : "green"} />
                    <Text style={{ marginTop: 10, fontSize: 18, fontWeight: 'bold' }}>
                        {isFailer?"Transaction Failed":"Transaction Success!"}
                    </Text>
                    <Text style={{ marginTop: 10 }}>
                        {
                            isFailer ? "Your transaction has been failed..." : "You have Successfully Subscribed..!"
                        }
                    </Text>
                    <Text style={{ marginTop: 0 }}>
                        {
                            isFailer ? "Please try again!" : "Congratulations."
                        }
                    </Text>
                    <TouchableOpacity
                        style={{
                            marginTop: 30,
                            padding: 10,
                            paddingHorizontal: 20,
                            backgroundColor: isFailer ? 'red' : 'green',
                            borderRadius: 5,
                        }}
                        onPress={() => closeModal()}
                    >
                        <Text style={{ color: 'white', fontWeight: 'bold' }}>OK</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

export default CustomSuccessModal;
