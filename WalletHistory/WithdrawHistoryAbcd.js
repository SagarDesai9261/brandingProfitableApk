import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import React, { useState, useEffect } from 'react';
import LinearGradient from 'react-native-linear-gradient';
import axios from 'axios';
import Icon from 'react-native-vector-icons/FontAwesome';

const WithdrawHistoryAbcd = ({ route }) => {
    const { mobileNumber } = route.params
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [count, setCount] = useState(0)
    const [totalPage, setTotalPage] = useState(0);
    const [buttonLoad, isButtonLoad] = useState(false);
    const [isLoadMore, setIsLoadMore] = useState(false);

    const fetchData = async () => {
        try {
            isButtonLoad(true)
            const response = await axios.get(`https://api.brandingprofitable.com/abcd_withdrawal/history/${mobileNumber}`);
            const result = response.data;
            setData(result.data)
            // if (data.length != 0) {
            //     data.push(...result.history)
            //     // setData(array)
                isButtonLoad(false)
            // } else {
            //     setData(result.history);
            //     setTotalPage((result.total_pages) - 1);
            //     isButtonLoad(false);
            // }
            // if ((result.total_pages) - 1 != count) {
            //     console.log("set load more...")
            //     setIsLoadMore(true)
            // }
        } catch (error) {
            console.log('Error fetching data...all transation history:', error);
            isButtonLoad(false)
        }
        setLoading(false);
    };


    useEffect(() => {
        fetchData();
    }, [count]);

    const handleLoad = () => {
        if (count == totalPage) {
            console.log("not found more data...");
            setIsLoadMore(false);
            return;
        }
        setCount(count+1)
    }

    return (
        <LinearGradient colors={['#050505', '#1A2A3D']} style={{ flex: 1 }}>
            <Text style={styles.header}>Withdraw History</Text>
            <ScrollView style={styles.container}>
                {loading ? (
                    <Text style={styles.loadingText}>Loading...</Text>
                ) : (data.length == 0) ? (
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={styles.loadingText}>No Transactions Found</Text>
                    </View>
                ) : (
                    data.map((item, index) => (
                        <View key={index} style={styles.transactionContainer}>
                            {/* <View style={styles.transactionHeader}>
                                <Icon name="exchange" size={20} color="#FFD700" />
                                <Text style={styles.transactionHeaderText}>Transaction ID: {item.transaction_id}</Text>
                            </View>
                            <Text style={styles.transactionText}>Amount: {item.amount}</Text>
                            <Text style={styles.transactionText}>Date: {item.date}</Text>
                            <Text style={styles.transactionText}>Income Type: {item.income_type}</Text>
                            <Text style={styles.transactionText}>Reason: {item.reson}</Text>
                            <Text style={styles.transactionText}>User Number: {item.user_number}</Text>
                            <Text style={styles.transactionText}>Transaction ID: {item.transaction_id}</Text> */}

                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', }}>

                                <View style={{ flexDirection: 'row', gap: 15, justifyContent: 'center' }}>
                                    {/* icon */}
                                    <View style={styles.transactionHeader}>
                                        <Icon name="exchange" size={20} color="red" />
                                    </View>

                                    <View>
                                        <Text style={[styles.transactionText1, { fontSize: 15 }]}>{item.Bank_Name}</Text>
                                        <Text style={styles.transactionText2}>IFSC - {item.Ifsc}</Text>
                                        <Text style={[styles.transactionText2]}>AC NO - {item.Account_Number}</Text>
                                        {item?.reason && <Text style={[styles.transactionText2]}>Reason - {item.reason}</Text>}
                                        <Text style={[styles.transactionText2, { fontSize: 15, color: item.status == 'fail' ? 'red' : 'lightgreen' }]}>{item.status}</Text>
                                    </View>
                                </View>

                                <View style={{ alignItems: 'flex-end' }}>
                                    <Text style={[styles.transactionText1, { fontSize: 17 }]}>₹ {item.withdraw_amount}</Text>
                                    <Text style={[styles.transactionText2]}>{""}</Text>
                                </View>

                            </View>

                            <View>
                                <Text style={[styles.transactionText2, { alignSelf: 'flex-end', fontSize: 13, opacity: 0.7 }]}>{item.date.split(' ')[0]} - {item.date.split(' ')[1]}</Text>
                            </View>

                            {/* <Text style={[styles.transactionText2,{fontSize:11,opacity:0.7}]}>{item.date}</Text> */}
                        </View>
                    ))
                )}

                {
                    isLoadMore &&
                    <View style={{ width: '100%', alignItems: 'center', justifyContent: 'center' }}>
                        <TouchableOpacity onPress={handleLoad} style={{ paddingVertical: 5, paddingHorizontal: 15, backgroundColor: 'white', borderRadius: 5 }}>
                            {
                                buttonLoad ? <ActivityIndicator color={'black'} /> : <Text style={{ color: 'black' }}>Load More</Text>
                            }
                            
                        </TouchableOpacity>
                    </View>
                }
            </ScrollView>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    header: {
        fontSize: 20,
        color: 'white',
        margin: 20,
        fontFamily: 'Manrope-Bold',
    },
    container: {
        margin: 20,
    },
    transactionContainer: {
        marginBottom: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 10,
        padding: 10,

    },
    transactionHeader: {
        alignItems: 'center',
        padding: 10,
        margin: 5,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderRadius: 10,
        height: 45
    },
    transactionHeaderText: {
        fontSize: 16,
        color: 'white',
        marginLeft: 10,
    },
    transactionText1: {
        fontSize: 16,
        fontFamily: 'Manrope-Bold',
        color: 'white',
    },
    transactionText2: {
        fontSize: 13,
        color: 'white',
        fontFamily: 'Manrope-Bold',
    },
    loadingText: {
        fontSize: 15,
        color: 'white',
        textAlign: 'center',
        fontFamily: 'Manrope-Bold',
    },
});

export default WithdrawHistoryAbcd;
