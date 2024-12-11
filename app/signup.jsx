import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen'
import { View, Image, Text, TextInput, TouchableOpacity, Pressable, Alert } from 'react-native'
import { StatusBar } from 'expo-status-bar'
import { Feather, Octicons } from '@expo/vector-icons'
import { useRouter, useSegments } from 'expo-router'
import { useRef, useState, useEffect } from 'react'
import { useAuth } from "../context/authContext"
import Loading from '../components/Loading'
import CustomKeyboardView from '../components/CustomKeyboardView'

export default function SignUp() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const { register } = useAuth()

    const emailRef = useRef("")
    const usernameRef = useRef("")
    const passwordRef = useRef("")

    const handleRegister = async () => {
        if (!emailRef.current || !passwordRef.current || !usernameRef.current) {
            Alert.alert('Sign In', 'Please fill all the fields!')
            return
        }
        setLoading(true)

        // setTimeout(() => {
        //     setLoading(false)
        // }, 5000)

        // handle login
        let response = await register(emailRef.current, passwordRef.current, usernameRef.current)
        setLoading(false)

        console.log('results: ', response)
        if (!response.success) {
            Alert.alert('SignUp', response.message)
        }
    }

    return (
        <CustomKeyboardView>
            <StatusBar style='dark' />
            <View style={{ paddingTop: hp(7), paddingHorizontal: wp(5) }} className="flex-1 gap-12">
                {/* SignIn Image */}
                <View className="items-center">
                    <Image style={{ height: hp(25) }} resizeMode='contain' source={require('../assets/images/splash-icon.png')} />
                </View>
                <View className="gap-10">
                    <Text style={{ fontSize: hp(4) }} className="font-bold tracking-wider text-center text-neutral-800">
                        SignUp
                    </Text>
                    {/* inputs */}
                    <View className="gap-3">
                        <View style={{ height: hp(7) }} className="flex-row gap-4 px-4 bg-neutral-100 items-center rounded-xl">
                            <Feather name="user" size={hp(2.7)} color='gray' />
                            <TextInput
                                onChangeText={value => usernameRef.current = value}
                                style={{ fontSize: hp(2) }}
                                className="flex-1 font-semibold text-neutral-700"
                                placeholder="Username"
                                placeholderTextColor="gray"
                            />
                        </View>
                        <View style={{ height: hp(7) }} className="flex-row gap-4 px-4 bg-neutral-100 items-center rounded-xl">
                            <Octicons name="mail" size={hp(2.7)} color='gray' />
                            <TextInput
                                onChangeText={value => emailRef.current = value}
                                style={{ fontSize: hp(2) }}
                                className="flex-1 font-semibold text-neutral-700"
                                placeholder="Email Address"
                                placeholderTextColor="gray"
                            />
                        </View>
                        <View style={{ height: hp(7) }} className="flex-row gap-4 px-4 bg-neutral-100 items-center rounded-xl">
                            <Octicons name="lock" size={hp(2.7)} color='gray' />
                            <TextInput
                                onChangeText={value => passwordRef.current = value}
                                style={{ fontSize: hp(2) }}
                                className="flex-1 font-semibold text-neutral-700"
                                placeholder="Password"
                                placeholderTextColor="gray"
                                secureTextEntry
                            />
                        </View>
                    </View>
                    <View>
                        {
                            loading ? (
                                <View className="flex-row justify-center">
                                    <Loading size={hp(8)} />
                                </View>
                            ) : (
                                <TouchableOpacity onPress={handleRegister} style={{ height: hp(6.5) }} className="bg-red-500 rounded-xl justify-center items-center">
                                    <Text style={{ fontSize: hp(2.7) }} className="text-white font-semibold tracking-wider">
                                        Submit
                                    </Text>
                                </TouchableOpacity>
                            )
                        }
                    </View>
                    {/* signup text */}
                    <View className="flex-row justify-center">
                        <Text style={{ fontSize: hp(1.8) }} className="font-semibold text-neutral-500">Already have an account? </Text>
                        <Pressable onPress={() => router.push('signin')}>
                            <Text style={{ fontSize: hp(1.8) }} className="font-bold text-red-500">Sign In</Text>
                        </Pressable>
                    </View>
                </View>
            </View>
        </CustomKeyboardView>
    )
}