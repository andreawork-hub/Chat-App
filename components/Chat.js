//import gifted chat library
import { GiftedChat, Bubble } from "react-native-gifted-chat";
import { useEffect, useState } from 'react';
import { StyleSheet, View, Text, KeyboardAvoidingView, Platform, } from 'react-native';

const Chat = ({ route, navigation }) => {
    const { name, color, } = route.params;
    const [messages, setMessages] = useState([]);

    /**
     * 
     * @param {previousMessage} newMessages 
     */
    const onSend = (newMessages) => {
        setMessages(previousMessages => GiftedChat.append(previousMessages, newMessages))
    }
    const renderBubble = (props) => {
        return <Bubble
            {...props}
            wrapperStyle={{
                right: {
                    backgroundColor: "#000"
                },
                left: {
                    backgroundColor: "#FFF"
                }
            }}
        />
    }
    // called only once, passing an empty array 
    useEffect(() => {
        navigation.setOptions({ title: name });
    }, []);

    // set the state with a static message
    // able to see each element of the UI displayed on screen right away
    useEffect(() => {
        setMessages([
            {
                _id: 1,
                text: "Hello Andrea, have a great day! <3",
                createdAt: new Date(),
                user: {
                    _id: 2,
                    name: "React Native",
                    avatar: "https://placeimg.com/140/140/any",
                },
            },
            {
                _id: 2,
                text: 'This is a system message',
                createdAt: new Date(),
                system: true,
            },
        ]);
    }, []);

    return (
        <View style={[styles.container, { backgroundColor: color }]}>
            <Text>Welcome in the Chat</Text>
            <GiftedChat
                messages={messages}
                renderBubble={renderBubble}
                onSend={messages => onSend(messages)}
                user={{
                    _id: 1
                }}
            />
            {Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    }
})

export default Chat;
