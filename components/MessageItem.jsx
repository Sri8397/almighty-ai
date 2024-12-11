import { View, Text } from 'react-native'
import React from 'react'
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen'
import Markdown from 'react-native-markdown-display'

export default function MessageItem({ message, currentUser }) {
    if (message?.userId === currentUser?.uid) {
        return (
            <View className="flex-row justify-end mr-3 mb-3">
                <View style={{width: wp(80)}}>
                <View className="flex self-end px-2 rounded-2xl bg-white border border-neutral-200">
                    {/* <Text style={{fontSize: hp(1.9)}}>
                        {message?.content}
                    </Text> */}
                    <Markdown style={{fontSize: hp(1.9)}}>
                        {message?.content}
                    </Markdown>
                </View>
                </View>
            </View>
        )
    } else {
        return (
            <View style={{width: wp(80)}} className="ml-3 mb-3">
                <View className="flex self-start px-4 rounded-2xl bg-red-100 border border-red-200">
                    {/* <Text style={{fontSize: hp(1.9)}}>
                        {message?.content}
                    </Text> */}
                    <Markdown style={{fontSize: hp(1.9)}}>
                        {message?.content}
                    </Markdown>
                </View>
            </View>
        )
    }
}