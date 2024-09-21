import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import LinearGradient from 'react-native-linear-gradient'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { useNavigation } from '@react-navigation/native'

const VisitingA4Btn = () => {
    const navigation = useNavigation();
    return (
        <View style={{ paddingHorizontal: 15, flexDirection: 'row', justifyContent:'space-between' }}>
            <TouchableOpacity style={{ width: '48%' }} onPress={() => { navigation.navigate("VisitingScreen") }}>
                <LinearGradient colors={['#000000', '#ffc4c4']} start={{ x: -0.2, y: 0 }}
                    style={{ borderRadius: 20, width: '100%', padding: 10, paddingHorizontal: 10, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', gap: 10 }} >
                    <View style={{ padding: 8, backgroundColor: 'white', borderRadius: 10 }}>
                        <MaterialCommunityIcons name="card-account-details-star" size={18} color={"black"} />
                    </View>
                    <Text style={{ fontFamily: 'Manrope-Bold', }}>E Visiting Card</Text>
                </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity style={{ width: '48%' }} onPress={() => { navigation.navigate("A4Screen") }}>
                <LinearGradient colors={['#000000', '#ffc4c4']} start={{ x: -0.2, y: 0 }}
                    style={{ borderRadius: 20, width: '100%', padding: 10, paddingHorizontal: 10, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', gap: 10 }} >
                    <View style={{ padding: 8, backgroundColor: 'white', borderRadius: 10 }}>
                        <MaterialCommunityIcons name="cards" size={18} color={"black"} />
                    </View>
                    <Text style={{ fontFamily: 'Manrope-Bold', }}>A4 Size Content</Text>
                </LinearGradient>
            </TouchableOpacity>
        </View>
    )
}

export default VisitingA4Btn