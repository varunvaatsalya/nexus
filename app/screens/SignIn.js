import {View, Text, TextInput, Pressable, Alert} from 'react-native';
import React, {useContext, useState} from 'react';
import {AuthContext} from '../../context/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SignIn = ({navigation}) => {
  const [contact, setContact] = useState('');
  const [password, setPassword] = useState('');
  const {
    user,
    setUser,
    isLocationPermissionGranted,
    isBackgroundLocationPermissionGranted,
    isNotificationPermissionGranted,
    fcmToken,
  } = useContext(AuthContext);

  async function handleSubmit() {
    try {
      let data = {
        contact,
        password,
        isLocationPermissionGranted,
        isBackgroundLocationPermissionGranted,
        isNotificationPermissionGranted,
        firebaseToken:fcmToken,
      };
      console.log(data);
      const URL = 'https://server-sih-1.onrender.com/login';
      // const URL = 'http://192.168.123.24:5000/login';
      const response = await fetch(URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      console.log(result.Success, result);
      if (result.Success) {
        Alert.alert('Success', 'Signed In successfully!');
        console.log('Server Response:', result);
        setUser({role: result.isAuthority, id: result.userId});
        await AsyncStorage.setItem(
          'user',
          JSON.stringify({role: result.isAuthority, id: result.userId}),
        );
        navigation.navigate('Welcome');
      } else {
        Alert.alert('Error', 'Failed to req.');
        console.log('Error Response:', result);
      }
    } catch (error) {
      console.error('Upload Error:', error);
      Alert.alert('Error', 'An error occurred while uploading.');
    }
  }

  return (
    <View className="flex-1 bg-amber-400 p-2 justify-center items-center">
      <View className="bg-white rounded-2xl p-4 flex flex-col justify-center items-center w-full">
        <Text className="text-xl font-extrabold text-gray-800">Sign In</Text>
        <Text className="text-xl font-bold text-gray-800">
          {user ? user.id : 'no'}
        </Text>
        <TextInput
          placeholder="Mobile Contact"
          value={contact}
          onChangeText={text => {
            setContact(text);
          }}
          className="w-full bg-gray-200 p-4 my-2 text-xl font-semibold rounded-xl border border-gray-800"
        />
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={text => {
            setPassword(text);
          }}
          className="w-full bg-gray-200 p-4 my-2 text-xl font-semibold rounded-xl border border-gray-800"
        />
        <Pressable
          className="w-full h-16 rounded-xl my-4 bg-violet-400 active:bg-violet-700 flex justify-center items-center"
          onPress={handleSubmit}>
          <Text className="font-semibold text-3xl text-white">Login</Text>
        </Pressable>
        <Pressable
          className="w-full h-16 rounded-xl my-1 bg-violet-400 active:bg-violet-700 flex justify-center items-center"
          onPress={() => navigation.navigate('SignUp')}>
          <Text className="font-semibold text-3xl text-white">SignUp</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default SignIn;
