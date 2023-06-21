import React, { useState } from "react";
import { ActivityIndicator, Button, Image, Text, TouchableOpacity, View } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { storage } from "./firebase.config";
import { deleteObject, getDownloadURL, ref, uploadBytes } from "firebase/storage";

const SafeArea = Platform.select({
  ios: () => require("react-native").SafeAreaView,
  android: () => require("react-native-safe-area-context").SafeAreaView,
})();

const App = () => {
  const [image, setImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const pickImage = async () => {
    setIsLoading(true);
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const uploadURL = await uploadImageAsync(result.assets[0].uri);
      setImage(uploadURL);
      setInterval(() => {
        // setIsLoading(false);
      }, 2000);
    } else {
      setImage(null);
      setInterval(() => {
        setIsLoading(false);
      }, 2000);
    }
  };

  const uploadImageAsync = async (uri) => {
    setIsLoading(true);
    // Why are we using XMLHttpRequest? See:
    // https://github.com/expo/expo/issues/2402#issuecomment-443726662
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(xhr.response);
      };
      xhr.onerror = function (e) {
        console.log(e);
        reject(new TypeError("Network request failed"));
      };
      xhr.responseType = "blob";
      xhr.open("GET", uri, true);
      xhr.send(null);
    });

    try {
      const storageRef = ref(storage, `Image/image-${Date.now()}`);
      const result = await uploadBytes(storageRef, blob);
      blob.close();
      return await getDownloadURL(storageRef);
    } catch (error) {
      alert(`Error: ${error}`);
    }

    alert("Uploaded successfully");
    setIsLoading(false);
  };

  const deleteImage = async () => {
    setIsLoading(true);
    const deleteRef = ref(storage, image);
    try {
      deleteObject(deleteRef).then(() => {
        setImage(null);
        setInterval(() => {
          setIsLoading(false);
        }, 2000);
  
      });
    } catch (error) {
      alert(`Error: ${error}`);
    }
  };

  return (
    <SafeArea className="flex-1 items-center justify-center">
      <View className="px-6 w-full">
        {!image ? (
          // This is for pick an image section
          <>
            <TouchableOpacity
              className="w-full h-64 border-2 border-dashed border-gray-200 rounded-md bg-gray-50 flex items-center justify-center"
              onPress={pickImage}
            >
              {isLoading ? (
                <View className="flex items-center justify-center">
                  <ActivityIndicator color={"#ff0000"} animating size={"large"} />
                </View>
              ) : (
                <Text className="text-xl text-gray-700 font-semibold">Pick an Image</Text>
              )}
            </TouchableOpacity>
          </>
        ) : (
          // This for display the image section
          <>
            {image && (
              <View className="w-full h-64 rounded-md overflow-hidden flex justify-center items-center">
                <Image source={{ uri: image }} className="w-full h-full" />
              </View>
            )}

            <Button title="Delete this image" onPress={deleteImage} />
          </>
        )}
      </View>
    </SafeArea>
  );
};

export default App;
