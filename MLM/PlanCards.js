import { View, Text, TouchableOpacity } from 'react-native'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import React from 'react'

const PlanCards = ({ plan, activeIndex, handlePress }) => {
    return (
        <TouchableOpacity style={{ height: 100, width: 180, borderRadius: 10, borderColor: activeIndex ? 'black' : 'lightgrey', borderWidth: 1, margin: 10, overflow: 'hidden', padding: 10, paddingHorizontal: 13, justifyContent: 'space-between' }} onPress={handlePress}>
            
            <Text style={{ fontSize: 17, fontFamily: 'Manrope-Bold', color: activeIndex ? 'black' : 'grey' }}>{plan.plan_name}</Text>
            <Text style={{ fontFamily: 'Manrope-Regular', color: activeIndex ? 'black' : 'grey' }}><Text style={{ fontSize: 40, fontFamily: 'Manrope-Bold', color: activeIndex ? 'black' : 'grey' }}>₹{plan.plan_price}</Text>/Year</Text>
        </TouchableOpacity>
    )
}

export default PlanCards