import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'
import { Entypo, Ionicons } from '@expo/vector-icons'
import { heightPercentageToDP as hp } from 'react-native-responsive-screen'
import { Image } from 'expo-image'

export default function ChatRoomHeader({ user, router }) {
    return (
        <Stack.Screen
            options={{
                title: '',
                headerLeft: () => (
                    <View className='flex-row items-center gap-4'>
                        <TouchableOpacity onPress={() => router.back()}>
                            <Entypo name='chevron-left' size={hp(4)} color="white" />
                        </TouchableOpacity>
                        <View className='flex-row items-center gap-3'>
                            <Image
                                source={require('../assets/images/icon.png')}
                                style={{ height: hp(4.5), aspectRatio: 1, borderRadius: 100 }}
                            />
                            {/* for name */}
                            <Text style={{ height: (hp(2.5)) }} className='text-white font-medium'>
                                {user?.username}
                            </Text>
                        </View>
                    </View>
                ),
                headerRight: () => (
                    <TouchableOpacity className='flex-row items-center gap-8 '>
                        <Ionicons name='call' size={hp(2.8)} color={'white'} />
                        {/* <Ionicons name='videocam' size={hp(2.8)} color={'white'} /> */}
                    </TouchableOpacity>
                ),
                headerStyle: { backgroundColor: '#f87171' },
            }}
        />
    )
}