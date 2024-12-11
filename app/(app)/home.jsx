import { View, ActivityIndicator } from 'react-native'
import { useAuth } from '../../context/authContext'
import { StatusBar } from 'expo-status-bar'
import { useEffect, useState } from 'react'
import ChatList from '../../components/ChatList'
import { heightPercentageToDP as hp } from 'react-native-responsive-screen'
import Loading from '../../components/Loading'
import { getDocs, query, where } from 'firebase/firestore'
import { userRef } from '../../firebase.config'

export default function Home() {
  const {user} = useAuth()
  const [users, setUsers] = useState([{
    userId: 'santa_claus',
    username: 'Santa Claus'
  }])
  // console.log('got user: ', user)

  useEffect(() => {
    // if(user?.uid)
    //   getUsers()
  },[])
  
  const getUsers = async () => {
    // fetch users
    const q = query(userRef, where('userId', '!=', user?.uid))
    const qSnap = await getDocs(q)
    let data = []
    qSnap.forEach(doc => {
      data.push({...doc.data()})
    })

    // console.log("all users: ", data)
    setUsers(data)
  }

  return (
    <View className="flex-1 bg-white">
      <StatusBar style='light' />
      {
        users.length ? (
          <ChatList users={users} currentUser={user} />
        ) : (
          <View className='flex items-center' style={{top: hp(30)}}>
            <ActivityIndicator size='large' />
            {/* <Loading size={hp(10)} /> */}
          </View>
        )
      }
    </View>
  )
}