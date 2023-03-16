import { useState } from 'react';
import { ImageBackground, Image, StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';

//navigation prop is passed to every component included in the Stack.Navigator, and contains a set of methods used to navigate to other screens

const backgroundColors = {
    black: { backgroundColor: '#090C08' },
    purple: { backgroundColor: '#474056' },
    steel: { backgroundColor: '#8A95A5' },
    green: { backgroundColor: '#B9C6AE' },
}

const Start = ({ navigation }) => {
    const [name, setName] = useState('');
    const [color, setColor] = useState('');


    return (
        <View style={styles.container}>
            <ImageBackground source={require('../assets/Background-Image.png')} resizeMode="cover" style={styles.image}>
                <Text style={styles.title}>App Title</Text>
                <View style={styles.inputBox}>
                    <TextInput
                        style={styles.textInput}
                        value={name}
                        onChangeText={setName}
                        placeholder='Type your username here'
                        icon={
                            <Image
                                style={styles.icon}
                                source={require('../assets/icon.svg')}
                            />}
                    />

                    <View style={styles.colorSelectorWrapper}>
                        <Text style={styles.colorSelectorTitle}>Choose your Background:</Text>
                        <View style={styles.colorSelector}>
                            <TouchableOpacity
                                style={[styles.color, backgroundColors.black,
                                color === backgroundColors.black ? styles.colorSelected : {}]}
                                onPress={() =>
                                    setColor(backgroundColors.black)
                                }
                            />
                            <TouchableOpacity
                                style={[styles.color, backgroundColors.purple,
                                color === backgroundColors.purple ? styles.colorSelected : {}]}
                                onPress={() =>
                                    setColor(backgroundColors.purple)
                                } />
                            <TouchableOpacity
                                style={[styles.color, backgroundColors.steel,
                                color === backgroundColors.steel ? styles.colorSelected : {}]}
                                onPress={() =>
                                    setColor(backgroundColors.steel)
                                } />
                            <TouchableOpacity
                                style={[styles.color, backgroundColors.green,
                                color === backgroundColors.green ? styles.colorSelected : {}]}
                                onPress={() =>
                                    setColor(backgroundColors.green)
                                } />
                        </View>
                    </View>

                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => navigation.navigate('Chat', { name: name, color: color })}>
                        <Text style={styles.buttonText}>Start Chatting</Text>
                    </TouchableOpacity>
                </View>
            </ImageBackground>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    image: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    title: {
        fontSize: 45,
        fontWeight: 600,
        color: '#FFFFFF',
        marginTop: 60,
        textAlign: 'center',
    },
    inputBox: {
        height: "44%",
        width: "88%",
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 20,
        marginBottom: 15,
        backgroundColor: '#FFFFFF'
    },
    textInput: {
        width: "88%",
        padding: 15,
        borderWidth: 1,
        fontSize: 16,
        fontWeight: '300',
        color: '#757083',
        opacity: 50,
    },

    colorSelectorWrapper: {
        width: '88%'
    },
    colorSelectorTitle: {

        fontSize: 16,
        fontWeight: '300',
        color: '#757083',

    },
    colorSelector: {
        flexDirection: 'row',
    },
    color: {
        width: 40,
        height: 40,
        borderRadius: 25,
        margin: 10
    },
    button: {
        height: "20%",
        width: '88%',
        backgroundColor: '#757083',
        justifyContent: 'center',
        alignItems: 'center'
    },
    buttonText: {
        fontSize: 16,
        fontWeight: 600,
        color: '#FFFFFF',
    },
    icon: {
        width: 24,
        height: 24,
        marginRight: 8,
    },


});

export default Start;