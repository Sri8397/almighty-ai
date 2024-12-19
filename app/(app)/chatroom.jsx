import { Alert, ImageBackground, Keyboard, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import ChatRoomHeader from '../../components/ChatRoomHeader'
import MessageList from '../../components/MessageList'
import { heightPercentageToDP as hp, widthPercentageToDP } from 'react-native-responsive-screen'
import { Feather } from '@expo/vector-icons'
import { getRoomId } from '../../utils/common'
import { useAuth } from '../../context/authContext'
import { addDoc, collection, doc, onSnapshot, orderBy, query, setDoc, Timestamp } from 'firebase/firestore'
import { db } from '../../firebase.config'
import Animated, { useSharedValue, withSpring } from 'react-native-reanimated'
import axios from 'axios'

export default function ChatRoom() {
    const item = useLocalSearchParams()
    const router = useRouter()
    const { user } = useAuth()
    const [messages, setMessages] = useState([])
    const textRef = useRef('')
    const inputRef = useRef(null)
    const scrollViewRef = useRef(null)
    // const [marginBottom, setMarginBottom] = useState(0)
    const marginBottom = useSharedValue(0)

    useEffect(() => {
        createRoomIfNotExists()

        const roomId = getRoomId(user?.uid, item?.userId)
        const docRef = doc(db, 'rooms', roomId)
        const messageRef = collection(docRef, "messages")
        const q = query(messageRef, orderBy('createdAt', 'asc'))

        const unsub = onSnapshot(q, (snapshot) => {
            const allMessages = snapshot.docs.map(doc => doc.data())
            setMessages([...allMessages])
        })

        const keyboardDidShowListener = Keyboard.addListener(
            'keyboardDidShow', (e) => {
                // setMarginBottom(e.endCoordinates.height)
                marginBottom.value = withSpring(e.endCoordinates.height)
                updateScrollView()
            }
        )

        const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
            // setMarginBottom(0)
            marginBottom.value = withSpring(0)
        })

        return () => {
            unsub()
            keyboardDidShowListener.remove()
            hideSubscription.remove()
        }
    }, [])

    const createRoomIfNotExists = async () => {
        let roomId = getRoomId(user?.uid, item?.userId)
        await setDoc(doc(db, 'rooms', roomId), {
            roomId,
            createdAt: Timestamp.fromDate(new Date())
        })
    }

    const handleSendMessage = async () => {
        let message = textRef.current.trim()
        if (!message) return
        try {
            let roomId = getRoomId(user?.uid, item?.userId)
            const docRef = doc(db, 'rooms', roomId)
            const messageRef = collection(docRef, "messages")

            const OPENAI_API_KEY = "your_key"

            const userMessage = { role: 'user', content: message }
            const newMessages = [ userMessage]

            let botMessage = { role: 'assistant', content: 'Loading...' }
            setMessages([...newMessages, botMessage])

            await addDoc(messageRef, {
                ...userMessage,
                userId: user?.uid,
                createdAt: Timestamp.fromDate(new Date())
            })

            textRef.current = ""
            if (inputRef) {
                inputRef?.current?.clear()
            }

            const response = await axios.post(
                'https://api.openai.com/v1/chat/completions',
                {
                    model: 'gpt-4o-mini',
                    messages: newMessages,
                    max_tokens: 100,
                    temperature: 0.7,
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${OPENAI_API_KEY}`,
                    },
                }
            )
            botMessage = response.data.choices[0].message;
            setMessages([...newMessages, botMessage])

            await addDoc(messageRef, {
                ...botMessage,
                userId: item?.userId,
                createdAt: Timestamp.fromDate(new Date())
            })
        } catch (err) {
            Alert.alert('Message', err.message)
        }
    }

    const updateScrollView = () => {
        setTimeout(() => {
            scrollViewRef?.current?.scrollToEnd({ animated: false })
        }, 100)
    }

    useEffect(() => {
        updateScrollView()
    }, [messages])

    return (
        <View className="flex-1">
            <StatusBar style='dark' />
            <ChatRoomHeader user={item} router={router} />
            <ImageBackground
                className='flex-1 justify-center'
                resizeMode="cover"
                source={require('../../assets/images/image.png')}
            >
                <View className='flex-1 justify-between overflow-visible'>
                    <View className='flex-1'>
                        <MessageList scrollViewRef={scrollViewRef} messages={messages} currentUser={user} />
                    </View>
                    <View style={{ marginBottom: hp(1.7) }} className='pt-2'>
                        <Animated.View
                            style={{ marginBottom }}
                            className='flex-row mx-3 bg-white justify-between border p-2 border-neutral-300 rounded-2xl pl-5'
                        >
                            <TextInput
                                ref={inputRef}
                                onChangeText={value => textRef.current = value}
                                placeholder="Type message..."
                                multiline
                                className='bg-red-100 bottom-0 flex-1 mr-2 rounded-2xl p-2'
                                style={{ fontSize: hp(2), maxHeight: hp(14) }}
                            />
                            <TouchableOpacity onPress={handleSendMessage} style={{ height: hp(4.8) }} className='bg-red-500 p-2 mr-[1px] mt-auto rounded-full'>
                                <Feather name='send' size={hp(2.7)} color={'white'} />
                            </TouchableOpacity>
                        </Animated.View>
                    </View>
                </View>
            </ImageBackground>
        </View>
    )
}