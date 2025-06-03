import Share from "react-native-share";

const shareFile = async (filePath) => {
  try {
    // Ensure necessary permissions for Android
    // if (Platform.OS === 'android') {
    //   const granted = await PermissionsAndroid.request(
    //     PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
    //     {
    //       title: 'Storage Permission',
    //       message: 'App needs access to storage to share the file',
    //       buttonNeutral: 'Ask Me Later',
    //       buttonNegative: 'Cancel',
    //       buttonPositive: 'OK',
    //     }
    //   );
    //   if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
    //     console.log('Storage permission denied');
    //     return;
    //   }
    // }

    // Share the file
    const shareOptions = {
      title: "Share File",
      url: `file://${filePath}`, // The file path in the file system
      type: "application/vnd.openxmlformats-officedocument.presentationml.presentation", // Adjust to your file type
      subject: "Here is your file", // For email or other services
    };

    await Share.open(shareOptions);
  } catch (error) {
    console.log("Error sharing file:", error);
  }
};

export default shareFile;

