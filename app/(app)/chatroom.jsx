import { Alert, ImageBackground, Keyboard, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import ChatRoomHeader from '../../components/ChatRoomHeader'
import MessageList from '../../components/MessageList'
import { heightPercentageToDP as hp, widthPercentageToDP } from 'react-native-responsive-screen'
import { Feather } from '@expo/vector-icons'
import CustomKeyboardView from '../../components/CustomKeyboardView'
import { getRoomId } from '../../utils/common'
import { useAuth } from '../../context/authContext'
import { addDoc, collection, doc, onSnapshot, orderBy, query, setDoc, Timestamp } from 'firebase/firestore'
import { db } from '../../firebase.config'

export default function ChatRoom() {
    const item = useLocalSearchParams()
    const router = useRouter()
    const { user } = useAuth()
    const [messages, setMessages] = useState([])
    const textRef = useRef('')
    const inputRef = useRef(null)
    const scrollViewRef = useRef(null)

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
            'keyboardDidShow', updateScrollView
        )

        return () => {
            unsub()
            keyboardDidShowListener.remove()
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
            textRef.current = ""
            if (inputRef) {
                inputRef?.current?.clear()
            }
            const newDoc = await addDoc(messageRef, {
                userId: user?.uid,
                text: message,
                senderName: user?.username,
                createdAt: Timestamp.fromDate(new Date())
            })

            // console.log("new message id: ", newDoc.id)
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
        <CustomKeyboardView inChat={true}>
            <View className="flex-1">
                <StatusBar style='dark' />
                <ChatRoomHeader user={item} router={router} />
                <View className='bg-red-400 h-3' />
                <ImageBackground
                    className='flex-1 justify-center'
                    resizeMode="cover"
                    source={require('../../assets/images/image.png')}
                >
                    <View className='flex-1 justify-between overflow-visible'>
                        <View className='flex-1'>
                            <MessageList scrollViewRef={scrollViewRef} messages={messages} currentUser={user} />
                        </View>
                        <View style={{ marginBottom: hp(2.7) }} className='pt-2'>
                            <View className='flex-row mx-3 justify-between bg-white border p-2 border-neutral-300 rounded-full pl-5'>
                                <TextInput
                                    ref={inputRef}
                                    onChangeText={value => textRef.current = value}
                                    placeholder='Type message...'
                                    className='flex-1 mr-2'
                                    style={{ fontSize: hp(2) }}
                                />
                                <TouchableOpacity onPress={handleSendMessage} className='bg-neutral-200 p-2 mr-[1px] rounded-full'>
                                    <Feather name='send' size={hp(2.7)} color={'#737373'} />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </ImageBackground>

            </View>
        </CustomKeyboardView>
    )
}