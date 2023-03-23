//import gifted Messages library
import { GiftedChat, Bubble } from "react-native-gifted-chat";
// gives users offline access to their sent/received message
import AsyncStorage from "@react-native-async-storage/async-storage";

import { useEffect, useState } from 'react';
import { StyleSheet, View, Text, TextInput, KeyboardAvoidingView, Platform, TouchableOpacity, FlatList, Alert, LogBox } from 'react-native';
import { collection, getDocs, addDoc, onSnapshot, query, where, orderBy, doc } from "firebase/firestore";


const Chat = ({ route, db, navigation, isConnected }) => {
    const { name, color, userID } = route.params;
    const [messages, setMessages] = useState([]);
    const [messageName, setMessageName] = useState("");
    const [item1, setItem1] = useState("");
    const [item2, setItem2] = useState("");

    /**
     * 
     * @param {previousMessage} newMessages 
     */
    const onSend = (newMessages) => {
        addDoc(collection(db, "messages"), newMessages[0]);
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

    const fetchMessages = async () => {
        const messagesDocuments = await getDocs(collection(db, "messages"));
        if (messagesDocuments.exists()) {
            console.log("data: ", messagesDocuments.data())
            let newMessages = [];
            messagesDocuments.data().forEach(docObject => {
                newMessages.push({ id: docObject.id, ...docObject.data() })
            });
            setMessages(newMessages);
        } else {
            console.log("something went wrong")
        }

    }

    useEffect(() => {
        fetchMessages();
    }, [messages]);


    // works with bubble and gifted chat 
    useEffect(() => {
        navigation.setOptions({ title: name });
        const q = query(collection(db, "messages"), orderBy("createdAt", "desc"));
        const unsubMessages = onSnapshot(q, (docs) => {
            let newMessages = [];
            docs.forEach(doc => {
                newMessages.push({
                    id: doc.id,
                    ...doc.data(),
                    createdAt: new Date(doc.data().createdAt.toMillis())
                })
            })
            setMessages(newMessages);
        })
        return () => {
            if (unsubMessages) unsubMessages();
        }
    }, []);
    // works with the list example 
    //try-catch function as a safety measure to prevent the app from crashing in case AsyncStorage fails to store the data
    //JSON.stringify() converts object to string 

    let unsubMessages;
    // code after refactoring
    useEffect(() => {

        if (isConnected === true) {
            // unregister current onSnapshot() listener to avoid registering multiple listeners when
            // useEffect code is re-executed.
            if (unsubMessages) unsubMessages();
            unsubMessages = null;

            const q = query(collection(db, "messages"), where("uid", "==", userID));
            unsubMessages = onSnapshot(q, (documentsSnapshot) => {
                let newMessages = [];
                documentsSnapshot.forEach(doc => {
                    newMessages.push({ id: doc.id, ...doc.data() })
                });
                cacheMessages(newMessages)
                setMessages(newMessages);
            });
        } else loadCachedMessages();
        // Clean up code
        return () => {
            if (unsubMessages) unsubMessages();
        }
    }, [isConnected]);

    const cacheMessages = async (messagesToCache) => {
        try {
            await AsyncStorage.setItem("messages", JSON.stringify(messagesToCache));
        } catch (error) {
            console.log(error.message);
        };
    }
    const loadCachedMessages = async () => {
        const loadCachedMessages = await AsyncStorage.getItem("messages") || [];
        setMessages(JSON.parse(cachedMessages));
    }

    const addMessage = async (newMessage) => {
        const newMessageRef = await addDoc(collection(db, "messages"), newMessage);
        if (newMessageRef.id) {
            setMessages([newMessage, ...messages]);
            Alert.alert(`The message "${messageName}" has been added.`);
        } else {
            Alert.alert("Unable to add. Please try later");
        }
    }
    /** whenever query(collection(db, "shoppinglists"),
    * where("uid", "==", userID)), is changed 
    * by an add, remove, or update query, 
    * the onSnapshot() callback will be called
    */

    // set the state with a static message
    // able to see each element of the UI displayed on screen right away

    /*The basic operations you can carry out with AsyncStorage are the same as for web storage:
    * gives users offline access to their sent/received message
    * AsyncStorage.setItem(): sets/stores an item;
    * AsyncStorage.getItem(): reads an item;
    * AsyncStorage.removeItem(): deletes an item.
    */

    return (
        <View style={[styles.container, { backgroundColor: color }]}>
            <FlatList
                //style={styles.messagesContainer}
                data={messages}
                renderItem={({ item }) =>
                    <Text>{item.name}: {item.items.join(", ")}</Text>} />
            {(isConnected === true) ?
                <View style={styles.messageForm}>
                    <TextInput
                        style={styles.messageName}
                        placeholder="message Name"
                        value={messageName}
                        onChangeText={setMessageName}
                    />
                    <TextInput
                        style={styles.item}
                        placeholder="Item #1"
                        value={item1}
                        onChangeText={setItem1}
                    />
                    <TextInput
                        style={styles.item}
                        placeholder="Item #2"
                        value={item2}
                        onChangeText={setItem2}
                    />
                    <TouchableOpacity
                        style={styles.addButton}
                        onPress={() => {
                            const newMessage = {
                                uid: userID,
                                name: messageName,
                                items: [item1, item2]
                            }
                            addMessage(newMessage);
                        }}
                    >
                        <Text style={styles.addButtonText}>Add</Text>
                    </TouchableOpacity>
                </View> : null}
            <Text>Welcome in the Messages</Text>
            <GiftedChat
                messages={messages}
                renderBubble={renderBubble}
                onSend={messages => onSend(messages)}
                user={{
                    _id: userID,
                    name: name
                }}
            />

            {Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    messageItem: {
        height: 70,
        justifyContent: "center",
        paddingHorizontal: 30,
        borderBottomWidth: 1,
        borderBottomColor: "#AAA",
        flex: 1,
        flexGrow: 1
    },
    messageForm: {
        flexBasis: 275,
        flex: 0,
        margin: 15,
        padding: 15,
        backgroundColor: "#CCC"
    },
    messageName: {
        height: 50,
        padding: 15,
        fontWeight: "600",
        marginRight: 50,
        marginBottom: 15,
        borderColor: "#555",
        borderWidth: 2
    },
    item: {
        height: 50,
        padding: 15,
        marginLeft: 50,
        marginBottom: 15,
        borderColor: "#555",
        borderWidth: 2
    },
    addButton: {
        justifyContent: "center",
        alignItems: "center",
        height: 50,
        backgroundColor: "#000",
        color: "#FFF"
    },
    addButtonText: {
        color: "#FFF",
        fontWeight: "600",
        fontSize: 20
    },
});
export default Chat


//{ backgroundColor: color }]
/**
 * const onSend = (newMessages) => {
        setMessages(previousMessages => GiftedMessages.append(previousMessages, newMessages))
    }
 * useEffect(() => {
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
 */
