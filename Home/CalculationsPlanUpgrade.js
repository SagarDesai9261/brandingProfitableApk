// CustomSuccessModal.js

import React from 'react';
import { View, Text, Modal, TouchableOpacity } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const CalculationPlanUpgrade = ({ visible, closeModal, isFailer, selectedPlan, currentPlan, onlyCloseModal }) => {
    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={() => onlyCloseModal()}
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
                    <Text style={{ marginTop: 10, fontSize: 18, fontFamily:'Manrope-Bold' }}>
                        {isFailer ? "Subscription Upgrade" : "Transaction Success!"}
                    </Text>

                    <View style={{ marginTop: 30, flexDirection: 'row', justifyContent: 'space-between', width: 200 }}>
                        <Text style={{fontFamily:'Manrope-Regular'}}>
                            Selected Plan
                        </Text>
                        <Text style={{ marginTop: 0, fontFamily:'Manrope-Bold' }}>
                            {selectedPlan?.plan_price}
                        </Text>
                    </View>
                    <View style={{
                        flexDirection: 'row', justifyContent: 'space-between', width: 200, paddingBottom: 15, borderBottomWidth: 1, borderBottomColor
                            : 'lightgrey'
                    }}>
                        <Text style={{fontFamily:'Manrope-Regular'}}>
                            Current Plan
                        </Text>
                        <Text style={{ marginTop: 0, fontFamily:'Manrope-Bold' }}>
                            {currentPlan?.plan_price}
                        </Text>
                    </View>
                    <View style={{
                        flexDirection: 'row', justifyContent: 'space-between', width: 200, paddingTop: 10,}}>
                        <Text style={{fontFamily:'Manrope-Regular'}}>
                            Payment Amount
                        </Text>
                        <Text style={{ marginTop: 0, fontFamily:'Manrope-Bold' }}>
                            {parseInt(selectedPlan?.plan_price) - parseInt(currentPlan?.plan_price)}
                        </Text>
                    </View>

<View style={{flexDirection:'row', marginTop: 40, gap:20}}>
                    <TouchableOpacity
                        style={{
                            
                            padding: 10,
                            paddingHorizontal: 20,
                            backgroundColor: 'red',
                            borderRadius: 5,
                            
                        }}
                        onPress={() => onlyCloseModal()}
                    >
                        <Text style={{ color: 'white', fontFamily:'Manrope-Bold' }}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={{
                            
                            padding: 10,
                            paddingHorizontal: 20,
                            backgroundColor: 'green',
                            borderRadius: 5,
                            
                        }}
                        onPress={() => closeModal()}
                    >
                        <Text style={{ color: 'white', fontFamily:'Manrope-Bold' }}>Pay</Text>
                    </TouchableOpacity>

                    </View>
                </View>
            </View>
        </Modal>
    );
};

export default CalculationPlanUpgrade;
