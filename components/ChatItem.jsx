import { View, Text, TouchableOpacity, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen'
import { Image } from 'expo-image'
import { blurhash, getDate, getRoomId } from '../utils/common'
import { addDoc, collection, doc, onSnapshot, orderBy, query, setDoc, Timestamp } from 'firebase/firestore'
import { db } from '../firebase.config'

export default function ChatItem({item, noBorder, router, currentUser}) {
  const [lastMessage, setLastMessage] = useState(undefined)

  useEffect(() => {
    const roomId = getRoomId(currentUser?.uid, item?.userId)
    const docRef = doc(db, 'rooms', roomId)
    const messageRef = collection(docRef, "messages")
    const q = query(messageRef, orderBy('createdAt', 'desc'))

    const unsub = onSnapshot(q, (snapshot) => {
        const allMessages = snapshot.docs.map(doc => doc.data())
        setLastMessage(allMessages[0] ? allMessages[0] : null)
      })

    return unsub
  }, [])

  const openChatRoom = () => {
    router.push({pathname: '/chatroom', params: item})
  }

  const renderTime = () => {
    if (lastMessage) {
      let date = lastMessage?.createdAt
      return getDate(new Date(date?.seconds * 1000))
    }
  }

  const renderLastMessage = () => {
    if (typeof lastMessage === undefined) return "Loading..."
    if (lastMessage) {
      if (currentUser?.uid === lastMessage?.userId) 
        return "You: " + lastMessage?.content
      return lastMessage?.content
    } else 
      return "Say Hi 👋🏻"
  }

  return (
    <TouchableOpacity onPress={openChatRoom} className={`flex-row justify-between mx-4 items-center gap-3 mb-4 pb-2 ${noBorder ? '' : 'border-b border-b-neutral-200'}`}>
      {/* this image components uses the cache */}
      <Image
        style={{height: hp(6), width: wp(12), borderRadius: 100}}
        source={require('../assets/images/icon.png')}
        placeholder={blurhash}
        transition={500}
      />
      <View className='flex-1 gap-1'>
        <View className='flex-row justify-between'>
          <Text style={{fontSize: hp(1.8)}} className='font-semibold text-neutral-800'>{item.username}</Text>
          <Text style={{fontSize: hp(1.8)}} className='font-medium text-neutral-500'>{renderTime()}</Text>
        </View>
        <Text style={{fontSize: hp(1.6)}} className='font-medium text-neutral-500 line-clamp-2'>{renderLastMessage()}</Text>
      </View>
    </TouchableOpacity>
  )
}