import { View, Text } from 'react-native'
import React from 'react'
import { MenuOption } from 'react-native-popup-menu'
import { heightPercentageToDP as hp } from 'react-native-responsive-screen'

export default function MenuItem({text, value, action, icon}) {
  return (
    <MenuOption onSelect={() => action(value)}>
        <View className='px-4 py-1 flex-row justify-between items-center'>
            <Text style={{fontSize: hp(1.7)}} className='font-semibold text-neutral-600'>{text}</Text>
            {icon}
        </View>
    </MenuOption>
  )
}