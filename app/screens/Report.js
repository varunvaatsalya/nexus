import React, {useContext, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  Image,
  Alert,
  Modal,
  Button,
} from 'react-native';
import {launchImageLibrary} from 'react-native-image-picker';
import {AuthContext} from '../../context/AuthContext';

const Report = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [photo, setPhoto] = useState(null);
  const [name, setName] = useState('');
  const {user} = useContext(AuthContext);

  const handleImageUpload = () => {
    launchImageLibrary({mediaType: 'photo'}, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.log('Image Picker Error: ', response.errorMessage);
      } else {
        const uri = response.assets[0].uri;
        setPhoto(uri); // Save selected image URI
      }
    });
  };

  const handleSubmit = async () => {
    if (!photo) {
      Alert.alert(
        'No photo selected!',
        'Please select a photo before submitting.',
      );
      return;
    }

    // Create FormData
    const formData = new FormData();
    formData.append('photo', {
      uri: photo,
      type: 'image/jpeg',
      name: 'person.jpg',
    });
    formData.append('name', name);
    formData.append('reportedBy', user.id);

    try {
      const URL = 'https://server-sih-1.onrender.com/report';
      // const URL = 'http://192.168.123.24:5000/report';
      const response = await fetch(URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });

      const result = await response.json();
      if (result.success) {
        Alert.alert('Success', 'Image uploaded successfully!');
        console.log('Server Response:', result);
      } else {
        Alert.alert('Error', 'Failed to upload image.');
        console.log('Error Response:', result);
      }
    } catch (error) {
      console.error('Upload Error:', error);
      Alert.alert('Error', 'An error occurred while uploading.');
    }
  };
  return (
    <View className="flex-1 bg-amber-400 p-2 justify-center items-center">
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View className="flex-1"></View>
        <View className="bg-white rounded-t-3xl p-4 flex flex-col justify-center items-center w-full">
          <View className="flex flex-row justify-between items-center px-3 w-full">
            <Text className="px-6 font-extrabold text-gray-800"></Text>
            <Text className="text-4xl font-extrabold text-gray-800">
              Report
            </Text>
            <Text
              onPress={() => {
                setModalVisible(false);
              }}
              className="text-xl text-gray-800">
              Close
            </Text>
          </View>
          <Text className="text-xl font-extrabold mb-5 text-gray-700">
            Missing Person Details
          </Text>
          <TextInput
            placeholder="Person's Name"
            onChangeText={text => {
              setName(text);
            }}
            className="w-full bg-gray-100 p-4 my-2 text-xl font-semibold rounded-xl border border-gray-800"
          />
          {photo && (
            <Image
              source={{uri: photo}}
              className="w-full aspect-square rounded-2xl my-2"
            />
          )}
          {photo ? (
            <View className='flex flex-row justify-center w-full gap-3 items-center'>
              <Pressable
              className="px-3 h-16 rounded-xl my-2 bg-violet-400 active:bg-violet-700 flex justify-center items-center"
              onPress={handleImageUpload}>
              <Text className="font-semibold text-2xl text-white">
              Change Photo
              </Text>
            </Pressable>
            <Pressable
              className="px-3 h-16 rounded-xl my-2 bg-red-400 active:bg-red-700 flex justify-center items-center"
              onPress={()=>{setPhoto(null)}}>
              <Text className="font-semibold text-2xl text-white">
                Delete Photo
              </Text>
            </Pressable>
            </View>
          ) : (
            <Pressable
              className="w-full h-16 rounded-xl my-2 bg-violet-400 active:bg-violet-700 flex justify-center items-center"
              onPress={handleImageUpload}>
              <Text className="font-semibold text-3xl text-white">
                Upload Photo
              </Text>
            </Pressable>
          )}
          <Pressable
            className="w-full h-16 rounded-xl my-2 bg-violet-400 active:bg-violet-700 flex justify-center items-center"
            onPress={handleSubmit}>
            <Text className="font-semibold text-3xl text-white">
              Submit
            </Text>
          </Pressable>
        </View>
      </Modal>
      <Button
        onPress={() => {
          setModalVisible(!modalVisible);
        }}
        className="bg-red-500"
        title="open"
      />
    </View>
  );
};

export default Report;
