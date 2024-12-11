import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen'
import { View, Image, Text, TextInput, TouchableOpacity, Pressable, Alert } from 'react-native'
import { StatusBar } from 'expo-status-bar'
import { Octicons } from '@expo/vector-icons'
import { useRouter, useSegments } from 'expo-router'
import { useRef, useState, useEffect } from 'react'
import Loading from '../components/Loading'
import CustomKeyboardView from '../components/CustomKeyboardView'
import { useAuth } from '../context/authContext'

export default function SignIn() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const { login } = useAuth()

    const emailRef = useRef("")
    const passwordRef = useRef("")

    const handleLogin = async () => {
        if (!emailRef.current || !passwordRef.current) {
            Alert.alert('Sign In', 'Please fill all the fields!')
            return
        }
        setLoading(true)

        // handle login
        let response = await login(emailRef.current, passwordRef.current)
        setLoading(false)

        console.log('results: ', response)
        if (!response.success) {
            Alert.alert('SignIn', response.message)
        }
    }

    return (
        <CustomKeyboardView>
            <StatusBar style='dark' />
            <View style={{ paddingTop: hp(8), paddingHorizontal: wp(5) }} className="flex-1 gap-12">
                {/* SignIn Image */}
                <View className="items-center">
                    <Image style={{ height: hp(25) }} resizeMode='contain' source={require('../assets/images/splash-icon.png')} />
                </View>
                <View className="gap-10">
                    <Text style={{ fontSize: hp(4) }} className="font-bold tracking-wider text-center text-neutral-800">
                        SignIn
                    </Text>
                    {/* inputs */}
                    <View className="gap-3">
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
                        <Text style={{ fontSize: hp(1.8) }} className="font-semibold text-right text-neutral-500">
                            Forgot password?
                        </Text>
                    </View>
                    <View>
                        {
                            loading ? (
                                <View style={{height: hp(8)}} className="flex-row justify-center">
                                    <Loading size={hp(8)} />
                                </View>
                            ) : (
                                <TouchableOpacity onPress={handleLogin} style={{ height: hp(6.5) }} className="bg-red-500 rounded-xl justify-center items-center">
                                    <Text style={{ fontSize: hp(2.7) }} className="text-white font-semibold tracking-wider">
                                        Submit
                                    </Text>
                                </TouchableOpacity>
                            )
                        }
                    </View>
                    {/* signup text */}
                    <View className="flex-row justify-center">
                        <Text style={{ fontSize: hp(1.8) }} className="font-semibold text-neutral-500">Don't have an account? </Text>
                        <Pressable onPress={() => router.push('signup')}>
                            <Text style={{ fontSize: hp(1.8) }} className="font-bold text-red-500">Sign Up</Text>
                        </Pressable>
                    </View>
                </View>
            </View>
        </CustomKeyboardView >
    )
}