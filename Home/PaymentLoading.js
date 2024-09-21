// CustomSuccessModal.js

import React from 'react';
import { View, Text, Modal, TouchableOpacity, ActivityIndicator } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const PaymentLoadingModal = ({ visible, closeModal, isFailer, content }) => {
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
                        padding: isFailer ? 40 : 20,
                        borderRadius: 10,
                        alignItems: 'center',
                    }}
                >
                    {/* <FontAwesome name={isFailer ? "times-circle" : "check-circle"} size={50} color={isFailer ? "red" : "green"} /> */}
                    <Text style={{ marginTop: 10, fontSize: 18, fontWeight: 'bold' }}>
                        <ActivityIndicator color={'black'} />
                    </Text>
                    <Text style={{ marginTop: 10 }}>
                        {content}
                    </Text>
                </View>
            </View>
        </Modal>
    );
};

export default PaymentLoadingModal;
