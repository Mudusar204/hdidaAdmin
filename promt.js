i have reactnative app and now i am making the admin penal of that. so read the given instructions carefully.
User is creating and updating the post from the app. 
The functionality for create and update post is handled in same file.
My Task: I want to add Update Post functionality in admin penal same as working in the app.
I am giving you the all code of reactnative app for create and update post in chunks. including backend API for updatePost.
Your Task: you have to make component for update post in react using tailwind css. 
Create the page design by yourself. just functionality of update post should work.
The purpose of code is to understand the flow of updatePost not to copy.
if you are required any thing then you can ask before moving to next step.
Code: 
Backend Api: router.post("/update", async (req, res) => {
  try {
    console.log(req.body);
    if (!req.body?.id) {
      return res.status(400).send({
        status: false,
        message: "Post id is required",
      });
    }
    updatePost({ ...req.body }, (err, post) => {
      if (err) {
        return res.status(400).send({
          status: false,
          message: err,
        });
      } else {
        return res.status(200).send({
          status: true,
          message: "Post updated",
          data: post,
        });
      }
    });
  } catch (err) {
    console.log(err);
    res.send({
      status: false,
      message: "Server Error",
    });
  }
});

async function updatePost(
  {
    id,
    title,
    images,
    description,
    price,
    fixedPrice,
    userId,
    location,
    features,
    info,
    coordinates,
    city,
    country,
    addressDetail,
  },
  done
) {
  try {
    if (userId == null) {
      return done("User not found");
    }
    if (userId == "guest") {
      return done("Guest cannot create post");
    }
    info = JSON.parse(info);
    const post = await Post.findById(id.toString());
    if (!post) {
      return done("Post not found");
    }
    if (post.author.toString() !== userId.toString()) {
      return done("You are not authorized to update this post");
    }

    if (title) {
      post.title = title;
    }
    if (images) {
      post.images = images;
    }
    if (description) {
      post.description = description;
    }
    if (price) {
      post.price = price;
    }
    if (fixedPrice) {
      post.fixedPrice = fixedPrice;
    }

    if (coordinates && city && country && addressDetail) {
      post.location = {
        coordinates: [
          parseFloat(coordinates.split(",")[0]),
          parseFloat(coordinates.split(",")[1]),
        ],
        city: city,
        country: country,
        addressDetail: addressDetail,
      };
    }
    if (info) {
      post.info = info;
    }
    if (features) {
      post.features = features;
    }

    post.save();
    return done(null, post);
  } catch (err) {
    return done(err.message);
  }
}

Reactnative App files(
File 1: import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Dimensions,
  FlatList,
  Image,
  ScrollView,
  ImageBackground,
  Touchable,
  TouchableOpacity,
  PermissionsAndroid,
  Alert,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Header from '../../Components/Header';
import {SCREEN_WIDTH, SVG, svgWithColor} from '../../SVGS/SVG';
import StepCounterComp from '../../Components/StepCounterComp';
import {Colors, DarkColors} from '../../Utils/Colors';
import InputWithIcon from '../../Components/Input/InputWithIcon';
import {SvgFromXml} from 'react-native-svg';
import {SCREEN_HEIGHT} from '@gorhom/bottom-sheet';
import Button from '../../Components/Button';
import ImageCropPicker from 'react-native-image-crop-picker';
import {useLanguage} from '../../Provider/LanguageProvider';
import {useToast} from 'react-native-toast-notifications';
import {useMMKVStorage} from 'react-native-mmkv-storage';
import {global_storage} from '../../Utils/Utils';
const Sell = ({navigation, route}) => {
  const [theme] = useMMKVStorage('theme', global_storage, 'light');
  const styles = styling(theme);
  const toast = useToast();
  const editInfo = route.params?.data;
  const {localized, selectedLanguage} = useLanguage();
  const [title, setTitle] = React.useState('');
  const [images, setImages] = React.useState([]);
  const [location, setLocation] = useState({
    addressDetail: editInfo?.addressDetail || '',
    cordinates: editInfo?.coordinates || '',
  });

  useEffect(() => {
    if (location) {
      console.log('location', location);
    }
  }, [location]);

  const pickerImages = async () => {
    try {
      const respone = await ImageCropPicker.openPicker({
        multiple: true,
        freeStyleCropEnabled: true,
      });
      let newImages = images;
      respone.forEach(item => {
        newImages.push({uri: item.path, type: item.mime});
      });
      setImages(prev => [...newImages]);
      console.log('images', images);
    } catch (err) {
      console.log(err);
    }
  };
  const filterImages = (item, index) => {
    setImages(images.filter(i => i !== item));
  };
  const openCamera = async () => {
    try {
      await getPermissons();
      const respone = await ImageCropPicker.openCamera({
        multiple: true,
        freeStyleCropEnabled: true,
      });
      let newImages = [];
      console.log('respone', respone);
      newImages.push({
        uri: respone.path,
        type: respone.mime,
        name: respone.path.split('/').pop(),
      });
      setImages(prev => [...prev, ...newImages]);
      console.log('images', images);
    } catch (err) {
      console.log(err);
    }
  };
  // get camera permissons
  const getPermissons = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'App Camera Permission',
          message: 'App needs access to your camera ',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Camera permission given');
      } else {
        console.log('Camera permission denied');
      }
    } catch (err) {
      console.log('getPermissons', 'Error', err);
    }
  };
  const checkValidation = () => {
    if (title == '') {
      Alert.alert('Error', 'Please enter title');
      toast.show('Please add images', {title: 'Error'});
      return false;
    }
    if (images.length == 0 && !editInfo) {
      Alert.alert('Error', 'Please add images');
      return false;
    }
    if (!location || !location?.cordinates || !location?.addressDetail) {
      console.log('CheckValidation():', 'location', location);
      toast.show('Please select location', {title: 'Error'});
      return false;
    }
    return true;
  };

  useEffect(() => {
    handleEditInfo();
  }, []);

  const handleEditInfo = () => {
    editInfo?.title && setTitle(editInfo?.title);
    console.warn('edit', editInfo?.info);
  };

  return (
    <SafeAreaView style={styles.SafeAreaView}>
      <ScrollView contentContainerStyle={{flexGrow: 1}}>
        <View style={styles.container}>
          <View
            style={[
              theme == 'dark' && {
                backgroundColor: DarkColors.GrayLighter,
                marginHorizontal: -16,
                paddingHorizontal: 16,
              },
              {marginBottom: 24},
            ]}>
            <Header
              startIcon={
                theme == 'dark'
                  ? svgWithColor('back', false, 'white')
                  : SVG.back
              }
              title={localized.sell_car}
            />
            <StepCounterComp count={1} />
            <View style={styles.border} />
          </View>
          <Text style={styles.label}>{localized.ad_title}</Text>
          <InputWithIcon
            style={[
              {marginBottom: 20},
              theme == 'dark' && {
                backgroundColor: DarkColors.GrayLightest,
                borderWidth: 1,
                borderColor: DarkColors.GrayDarker,
              },
            ]}
            textInputProps={{
              placeholder: localized.enter_title,
              placeholderTextColor: theme == 'dark' ? 'white' : Colors.Black,
              value: title,
              onChangeText: setTitle,
            }}
          />
          {!editInfo && (
            <>
              <Text style={styles.label}>{localized.add_image_of_car}</Text>
              {images.length > 0 && (
                <ImageList images={images} onPress={filterImages} />
              )}
              <View style={{alignItems: 'center', marginHorizontal: -20}}>
                <SvgFromXml
                  onPress={pickerImages}
                  xml={
                    theme == 'dark'
                      ? SVG.uploadImageBtnDark
                      : SVG.uploadImageBtn
                  }
                  width={Dimensions.get('window').width - 32}
                  height={SCREEN_WIDTH * 0.38}
                />
              </View>

              <Button
                title={localized.take_photo}
                onPress={openCamera}
                style={{
                  backgroundColor:
                    theme == 'dark'
                      ? DarkColors.GrayLighter
                      : Colors.LightWhite,
                  borderWidth: 1,
                  borderColor: Colors.Secondary,
                }}
                starIcon={SVG.camera}
                titleStyle={[
                  {color: Colors.Secondary},
                  selectedLanguage == 'ar' && {marginEnd: 10},
                ]}
                starIconSize={24}
              />
            </>
          )}
          <Button
            title={location?.addressDetail || localized.select_address}
            onPress={() => navigation.navigate('Address', {setLocation})}
            style={{
              backgroundColor:
                theme == 'dark' ? DarkColors.GrayLighter : Colors.LightWhite,
              borderWidth: 1,
              borderColor: Colors.Secondary,
            }}
            titleStyle={[
              {color: Colors.Secondary},
              selectedLanguage == 'ar' && {marginEnd: 10},
            ]}
            starIconSize={24}
          />
        </View>
        <Button
          titleStyle={[
            {flex: 1},
            selectedLanguage == 'ar' && {marginStart: -53},
          ]}
          style={{
            marginHorizontal: 16,
            backgroundColor:
              theme == 'dark' ? DarkColors.Primary : Colors.Secondary,
          }}
          title={localized.continue}
          onPress={() => {
            if (checkValidation())
              navigation.navigate('SellStep2', {
                title,
                images,
                info: editInfo?.info,
                des: editInfo?.description,
                price: editInfo?.price,
                isFixed: editInfo?.fixedPrice,
                id: editInfo?._id,
                location,
              });
          }}
          icon={SVG.continue}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const ImageList = ({images, onPress}) => {
  const [theme] = useMMKVStorage('theme', global_storage, 'light');
  const styles = styling(theme);
  return (
    <FlatList
      data={images}
      style={{
        flexGrow: 0,
        marginBottom: 16,
        marginHorizontal: -16,
      }}
      contentContainerStyle={{flexGrow: 0, paddingHorizontal: 8}}
      keyExtractor={(item, index) => index.toString()}
      extraData={images}
      renderItem={({item, index}) => (
        <ImageBackground style={styles.selectedImageView} source={item}>
          <TouchableOpacity style={styles.closeBtn}>
            <SvgFromXml
              height={16}
              width={16}
              xml={SVG.close}
              onPress={() => onPress(item, index)}
            />
          </TouchableOpacity>
        </ImageBackground>
      )}
      numColumns={3}
      showsHorizontalScrollIndicator={false}
    />
  );
};

export default Sell;

const styling = theme =>
  StyleSheet.create({
    SafeAreaView: {
      flex: 1,
      backgroundColor: theme == 'dark' ? DarkColors.GrayLightest : 'white',
    },
    container: {
      flex: 1,
      backgroundColor: theme == 'dark' ? DarkColors.GrayLightest : 'white',
      paddingHorizontal: 16,
    },
    border: {
      height: 1,
      backgroundColor:
        theme == 'dark' ? DarkColors.GrayLighter : Colors.GrayLighter,
      marginTop: 20,
      marginHorizontal: -16,
    },
    label: {
      color: theme == 'dark' ? DarkColors.GrayDarkest : Colors.GrayMedium,
      fontWeight: '600',
      lineHeight: 23,
      marginBottom: 4,
    },
    uploadImageView: {
      height: 150,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
      borderRadius: 12,
      borderStyle: 'dashed',
      borderColor: Colors.GrayLighter,
    },
    selectedImageView: {
      height: 150,
      width: Dimensions.get('window').width / 3 - 22,
      borderWidth: 1,
      borderColor: theme == 'dark' ? DarkColors.GrayDarker : Colors.GrayLighter,
      borderRadius: 8,
      marginHorizontal: 8,
      marginVertical: 8,
      overflow: 'hidden',
    },
    closeBtn: {
      alignSelf: 'flex-end',
      padding: 2,
      backgroundColor: theme == 'dark' ? '#0e0e0e' : 'white',
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 5,
      marginEnd: 5,
    },
  }); )

////////////////////////////////////

File 2: import React, {useEffect, useState} from 'react';
import {View, Text, SafeAreaView, Alert, StyleSheet} from 'react-native';
import Header from '../Components/Header';
import StepCounterComp from '../Components/StepCounterComp';
import Button from '../Components/Button';
import DropDownPicker from 'react-native-dropdown-picker';
import {Colors, DarkColors} from '../Utils/Colors';
import {SVG} from '../SVGS/SVG';
import {DROPDOWNS_LIST, FEATURES} from '../Utils/Data';
import {ScrollView} from 'react-native-gesture-handler';
import InputWithIcon from '../Components/Input/InputWithIcon';
import {SvgFromXml} from 'react-native-svg';
import {getRequest} from '../Utils/API';
import LoadingComp from '../Components/LoadingComp';
import {
  arrayToObj,
  global_storage,
  parseObjectToArray,
  savedFeatures,
} from '../Utils/Utils';
import {useMMKVStorage} from 'react-native-mmkv-storage';
import {useLanguage} from '../Provider/LanguageProvider';
import {Dropdown} from 'react-native-element-dropdown';
import DropdownComponent from '../Components/DropDownPicker';

const SellStep2 = ({route, navigation}) => {
  const [theme] = useMMKVStorage('theme', global_storage, 'light');
  const styles = styling(theme);
  const TAG = 'SellStep2.js';
  const {localized} = useLanguage();
  const info = route.params?.info || false;
  const des = route.params?.des || false;
  const price = route.params?.price || false;
  const isFix = route.params?.isFix || false;
  const location = route.params?.location || false;
  const id = route.params?.id;
  const [user, setUser] = useMMKVStorage('user', global_storage, {});
  const title = route.params?.title;
  const images = route.params?.images;
  const [openStates, setOpenStates] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [apiResponse, setApiResponse] = useMMKVStorage(
    'pickers',
    global_storage,
    [],
  );
  const [pickers, setPickers] = useState(apiResponse);
  const [values, setValues] = useState({});
  const [description, setDescription] = useState(des);
  const [features, setFeatures] = useState([]);

  const getCat = async () => {
    try {
      if (apiResponse.length == 0) setIsLoading(true);
      const respone = await getRequest('category/getCat', user.token);
      setIsLoading(false);
      if (respone.status) {
        setApiResponse(respone.data);
      } else Alert.alert('Error', respone.message);
      console.log(TAG, 'GetCat() : Reponse :', respone);
    } catch (err) {
      console.log(TAG, 'GetCat() : Error :', err);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getCat();
    handleInfo();
  }, []);

  const handleInfo = () => {
    if (info) {
      console.log('info', info);
      let parsedObj = {};
      info.forEach((item, index) => {
        parsedObj[item.label] = {
          value: item.value,
        };
      });
      console.log('parsedObj', parsedObj);
      setValues({...values, ...parsedObj});
      console.log('values', values);
    }
  };
  const checkValidation = () => {
    console.log(values);
    if (parseObjectToArray(values).length != apiResponse.length) {
      Alert.alert('Error', 'Please fill all the fields');
      return false;
    }
    if (description.length == 0) {
      Alert.alert('Error', 'Please fill all the fields');
      return false;
    }
    if (features.length == 0) {
      Alert.alert('Error', 'Please fill all the fields');
      return false;
    }
    return true;
  };

  const handleSubValues = (value, index, item) => {
    const subValues = item.values.find(i => i.name == value).subValues;
    let newPickers = [...pickers];
    newPickers[index] = {
      ...pickers[index],
      subValuesToShow: subValues,
    };
    setPickers(newPickers);
  };
  return (
    <SafeAreaView style={styles.safeAreaView}>
      <View style={styles.container}>
        <View
          style={[
            theme == 'dark' && {
              backgroundColor: DarkColors.GrayLighter,
              marginHorizontal: -16,
              paddingHorizontal: 16,
              paddingBottom: 20,
            },
          ]}>
          <Header startIcon={SVG.back} title={localized.sell_car} />
          <StepCounterComp count={2} />
        </View>
        <View style={styles.border} />
        <ScrollView showsVerticalScrollIndicator={false}>
          {pickers.map((item, index) => {
            return (
              <View style={styles.itemContainer} key={index}>
                <Text style={styles.label}>{item.name}</Text>
                {item.type != 'dropdown' && (
                  <InputWithIcon
                    style={[
                      theme == 'dark' && {
                        backgroundColor: DarkColors.GrayLightest,
                        borderWidth: 1,
                        borderColor: DarkColors.GrayDarker,
                      },
                    ]}
                    inputStyle={[
                      {marginHorizontal: 0},
                      theme == 'dark' && {
                        backgroundColor: DarkColors.GrayLightest,
                      },
                    ]}
                    textInputProps={{
                      placeholder: 'Enter ' + item.name,
                      placeholderTextColor:
                        theme == 'dark'
                          ? DarkColors.GrayDarkest
                          : Colors.GrayMedium,
                      value: values[item.name]?.value,
                      onChangeText: value => {
                        setValues(prev => {
                          return {
                            ...prev,
                            [item.name]: {...prev[item.name], value},
                          };
                        });
                      },
                    }}
                  />
                )}
                {(!item.type || item.type == 'dropdown') && (
                  <>
                    <DropdownComponent
                      items={item.values.map(i => ({
                        label: i.name,
                        value: i.name,
                      }))}
                      label={item.name}
                      setValues={setValues}
                      value={values[item.name]?.value}
                      setSubValues={value => {
                        handleSubValues(value, index, item);
                      }}
                    />

                    {item?.subValuesToShow?.length > 0 && (
                      <>
                        <Text style={[styles.label, {marginTop: 10}]}>
                          {'Sub ' + item.name}
                        </Text>
                        <DropdownComponent
                          items={item.subValuesToShow.map(i => ({
                            label: i,
                            value: i,
                          }))}
                          label={item.name}
                          value={values[item.name]?.subValue}
                          setValues={setValues}
                          isSubValue={true}
                        />
                      </>
                    )}
                  </>
                )}
              </View>
            );
          })}
          <Text style={styles.label}>{'Features'}</Text>
          <DropdownComponent
            multiSelect={true}
            items={savedFeatures.map(i => ({
              label: i.name,
              value: i.name,
            }))}
            label={'Features'}
            value={features}
            setValues={setFeatures}
          />
          <Text style={[styles.label, {marginTop: 10}]}>
            {localized.description}
          </Text>
          <InputWithIcon
            style={[
              {height: 130, paddingHorizontal: 8},
              theme == 'dark' && {
                backgroundColor: DarkColors.GrayLightest,
                borderWidth: 1,
                borderColor: DarkColors.GrayDarker,
              },
            ]}
            textInputProps={{
              placeholder: localized.enter_description,
              placeholderTextColor:
                theme == 'dark' ? DarkColors.GrayDarkest : Colors.GrayMedium,
              textAlignVertical: 'top',
              value: description,
              onChangeText: setDescription,
              height: 130,
              multiline: true,
              marginHorizontal: 0,
            }}
          />
        </ScrollView>
      </View>
      <Button
        titleStyle={{flex: 1}}
        style={styles.button}
        title={localized.sell_car}
        onPress={() => {
          if (checkValidation())
            navigation.navigate('SellStep3', {
              title,
              images,
              description,
              values,
              price,
              isFix,
              id,
              features,
              location,
            });
        }}
        icon={SVG.continue}
      />
      <LoadingComp isLoading={isLoading} />
    </SafeAreaView>
  );
};

const styling = theme =>
  StyleSheet.create({
    safeAreaView: {
      flex: 1,
      backgroundColor: theme == 'dark' ? DarkColors.GrayLightest : 'white',
    },
    container: {
      flex: 1,
      backgroundColor: theme == 'dark' ? DarkColors.GrayLightest : 'white',
      paddingHorizontal: 16,
    },
    border: {
      height: 1,
      backgroundColor:
        theme == 'dark' ? DarkColors.GrayLighter : Colors.GrayLighter,
      marginTop: theme == 'dark' ? 0 : 20,
      marginBottom: 33,
      marginHorizontal: -16,
    },
    label: {
      color: theme == 'dark' ? DarkColors.GrayDarkest : Colors.GrayMedium,
      fontWeight: '600',
      lineHeight: 23,
      marginBottom: 6,
    },
    itemContainer: {
      marginBottom: 21,
    },
    dropDownPicker: {
      borderColor:
        theme == 'dark' ? DarkColors.GrayDarkest : Colors.GrayLighter,
    },
    dropDownContainer: {
      borderColor:
        theme == 'dark' ? DarkColors.GrayDarkest : Colors.GrayLighter,
      borderWidth: 1,
      overflow: 'hidden',
      backgroundColor: theme == 'dark' ? DarkColors.GrayLighter : 'white',
    },
    button: {
      marginHorizontal: 16,
      backgroundColor:
        theme == 'dark' ? DarkColors.Primary : DarkColors.Secondary,
    },
  });

export default SellStep2;









/////////////////////////////


File 3: import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Dimensions,
  Alert,
  Image,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Header from '../Components/Header';
import {SCREEN_WIDTH, SVG, svgWithColor} from '../SVGS/SVG';
import StepCounterComp from '../Components/StepCounterComp';
import {Colors, DarkColors} from '../Utils/Colors';
import InputWithIcon from '../Components/Input/InputWithIcon';
import {SvgFromXml} from 'react-native-svg';
import {SCREEN_HEIGHT} from '@gorhom/bottom-sheet';
import Button from '../Components/Button';
import {postRequest, postRequestWithFile} from '../Utils/API';
import {global_storage, parseObjectToArray} from '../Utils/Utils';
import {MenuItem} from '../Components/MenuComp';
import {useMMKVStorage} from 'react-native-mmkv-storage';
import {useToast} from 'react-native-toast-notifications';
import LoadingComp from '../Components/LoadingComp';
const SellStep3 = ({navigation, route}) => {
  const [theme] = useMMKVStorage('theme', global_storage, 'light');
  const styles = styling(theme);
  const toast = useToast();
  const TAG = 'SellStep3';
  const initalPrice = route.params?.price || 0;
  const isFix = route.params?.isFix || false;
  const id = route.params?.id;
  const features = route.params?.features;
  const location = route.params?.location;
  const [isSwitched, setIsSwitched] = React.useState(false);
  const {title, images, description, values} = route.params;
  const [priceFixed, setPriceFixed] = React.useState(isFix);
  const [loading, setLoading] = useState(false);
  const [price, setPrice] = React.useState(initalPrice);
  const [user, setUser] = useMMKVStorage('user', global_storage, {});
  const [needRefresh, setNeedRefresh] = useMMKVStorage(
    'needRefresh',
    global_storage,
    false,
  );
  useEffect(() => {
    console.warn(TAG, 'price :', initalPrice);
  }, []);
  const checkValidation = () => {
    if (price == 0) {
      Alert.alert('Error', 'Please fill all the fields');
      toast.show('Please fill all the fields', {title: 'Error'});
      return false;
    }
    return true;
  };
  const creatPost = async () => {
    const TAG = 'SellStep3';
    const car_info = parseObjectToArray(values);
    try {
      const formData = new FormData();
      if (id) {
        formData.append('id', id);
      }
      formData.append('title', title);
      formData.append('description', description);
      formData.append('price', price);
      formData.append('fixedPrice', priceFixed);
      formData.append('info', JSON.stringify(car_info));
      formData.append('addressDetail', location.addressDetail);
      formData.append('coordinates', location.cordinates);
      if (features && features?.length > 0) {
        features.forEach((item, index) => {
          formData.append(`features[${index}]`, item);
        });
      }
      images.forEach((image, index) => {
        const fileName = `${new Date().getTime()}image_${index + 1}.jpg`;
        formData.append(`images[${index}]`, {
          uri: image.uri,
          name: fileName,
          type: image.type,
        });
      });
      console.log('SellStep3 : ', 'formData', JSON.stringify(formData));
      setLoading(true);
      const response = await postRequest(
        id ? 'post/update' : 'post/create',
        formData,
        user.token,
      );
      setLoading(false);
      if (response.status) {
        setNeedRefresh(!needRefresh);
        navigation.navigate('Home');
      } else Alert.alert('Error', response.message);
      return response;
    } catch (error) {
      setLoading(false);
      console.log(TAG, 'creatPost() Error :', error);
      if (error instanceof SyntaxError && error.name === 'SyntaxError') {
        console.log('JSON parse error:', error.message);
        setNeedRefresh(!needRefresh);
        // navigation.navigate('Home');
        // Handle JSON parse error
      } else {
        toast.show('Something went wrong', {title: 'Error'});
      }

      return false;
    }
  };
  return (
    <SafeAreaView style={styles.SafeAreaView}>
      <View style={styles.container}>
        <View
          style={[
            theme == 'dark' && {
              backgroundColor: DarkColors.GrayLighter,
              paddingHorizontal: 16,
              marginHorizontal: -16,
              marginBottom: 20,
            },
          ]}>
          <Header
            startIcon={
              theme == 'dark'
                ? svgWithColor('back', 'false', 'white')
                : SVG.back
            }
            title={'Sell Car'}
          />
          <StepCounterComp count={3} />
          <View style={styles.border} />
        </View>
        <Text style={styles.label}>Ad Price </Text>
        <InputWithIcon
          style={[
            {marginBottom: 20},
            theme == 'dark' && {
              backgroundColor: DarkColors.GrayLightest,
              borderWidth: 1,
              borderColor: DarkColors.GrayDarker,
            },
          ]}
          textInputProps={{
            placeholder: 'Enter price',
            placeholderTextColor:
              theme == 'dark' ? DarkColors.GrayDarkest : Colors.Black,
            keyboardType: 'numeric',
            value: price + '',
            onChangeText: setPrice,
          }}
        />
        <View style={styles.row}>
          <Text style={styles.text}>Firm on price</Text>
          <SvgFromXml
            onPress={() => {
              setPriceFixed(!priceFixed);
            }}
            xml={
              !priceFixed && theme == 'dark'
                ? SVG.darkSwitchOff
                : !priceFixed && theme != 'dark'
                ? SVG.switchOff
                : priceFixed && theme == 'dark'
                ? SVG.darkSwitch
                : SVG.switchOn
            }
            width={33}
            height={20}
          />
        </View>
      </View>
      <Button
        titleStyle={{flex: 1}}
        style={{
          marginHorizontal: 16,
        }}
        title="Continue"
        onPress={() => {
          if (!checkValidation()) return;
          navigation.navigate('SellStep4', {onContinue: creatPost});
          // creatPost();
        }}
        icon={SVG.continue}
      />
      <LoadingComp isLoading={loading} />
    </SafeAreaView>
  );
};

export default SellStep3;

const styling = theme =>
  StyleSheet.create({
    SafeAreaView: {
      flex: 1,
      backgroundColor: theme == 'dark' ? DarkColors.GrayLightest : 'white',
    },
    container: {
      flex: 1,
      backgroundColor: theme == 'dark' ? DarkColors.GrayLightest : 'white',
      paddingHorizontal: 16,
    },
    border: {
      height: 1,
      backgroundColor:
        theme == 'dark' ? DarkColors.GrayLighter : Colors.GrayLighter,
      marginTop: theme == 'dark' ? 0 : 20,
      marginBottom: 33,
      marginHorizontal: -16,
    },
    label: {
      color: theme == 'dark' ? DarkColors.GrayDarkest : Colors.GrayMedium,
      fontWeight: '600',
      lineHeight: 23,
      marginBottom: 4,
    },
    text: {
      color: theme == 'dark' ? DarkColors.GrayDarkest : Colors.Black,
      lineHeight: 23,
      flex: 1,
      marginBottom: 4,
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 20,
    },
  });





  /////////////////////////////


DropDownPicker Component: import {Dimensions, Pressable, StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import {Colors, DarkColors} from '../Utils/Colors';
import {Dropdown, MultiSelect} from 'react-native-element-dropdown';
import {useMMKVStorage} from 'react-native-mmkv-storage';
import {global_storage} from '../Utils/Utils';
const DropdownComponent = ({
  items,
  label,
  setValues,
  value,
  isSubValue,
  setSubValues = () => {},
  multiSelect = false,
}) => {
  const [theme] = useMMKVStorage('theme', global_storage, 'light');
  const styles = styling(theme);
  const [isFocus, setIsFocus] = useState(false);

  return (
    <>
      {!multiSelect ? (
        <Dropdown
          style={[styles.dropdown, isFocus && {borderColor: Colors.Primary}]}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          iconStyle={styles.iconStyle}
          data={items}
          search
          maxHeight={Dimensions.get('window').height * 0.5}
          labelField="label"
          valueField="value"
          mode="modal"
          itemContainerStyle={{
            borderRadius: 10,
            overflow: 'hidden',
            marginHorizontal: 5,
          }}
          activeColor={theme == 'dark' && DarkColors.GrayLightest}
          containerStyle={[
            theme == 'dark' && {
              backgroundColor: DarkColors.GrayLighter,
              borderWidth: 1,
              borderColor: DarkColors.GrayDarkest,
            },
            {paddingBottom: 5},
          ]}
          placeholder={!isFocus ? `Select ${label}` : '...'}
          searchPlaceholder="Search..."
          value={value}
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
          onChange={item => {
            setValues(prev => {
              console.log({
                ...prev,
                [label]: {
                  ...prev[label],
                  [isSubValue ? 'subValue' : 'value']: item.value,
                },
              });
              return {
                ...prev,
                [label]: {
                  ...prev[label],
                  [isSubValue ? 'subValue' : 'value']: item.value,
                },
              };
            });
            setSubValues(item.value);
            setIsFocus(false);
          }}
        />
      ) : (
        <MultiSelect
          style={[styles.dropdown, isFocus && {borderColor: Colors.Primary}]}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={[
            styles.selectedTextStyle,
            {
              color: 'white',
            },
          ]}
          activeColor={Colors.Primary}
          inputSearchStyle={styles.inputSearchStyle}
          iconStyle={styles.iconStyle}
          data={items}
          search
          maxHeight={Dimensions.get('window').height * 0.5}
          labelField="label"
          valueField="value"
          mode="modal"
          itemContainerStyle={[
            {
              borderRadius: 10,
              overflow: 'hidden',
              marginHorizontal: 5,
              marginVertical: 2.5,
              color: 'white',
            },
          ]}
          selectedStyle={{
            borderRadius: 5,
            borderWidth: 0,
            backgroundColor: Colors.Primary,
            color: 'white',
          }}
          containerStyle={[
            theme == 'dark' && {
              backgroundColor: DarkColors.GrayLighter,
              borderWidth: 1,
              borderColor: DarkColors.GrayDarkest,
            },
            {paddingBottom: 5},
          ]}
          itemTextStyle={{
            color: 'gray',
          }}
          placeholder={!isFocus ? `Select ${label}` : '...'}
          searchPlaceholder="Search..."
          value={value}
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
          onChange={item => {
            setValues(item);
            setIsFocus(false);
          }}
        />
      )}
    </>
  );
};

export default DropdownComponent;

const styling = theme =>
  StyleSheet.create({
    dropdown: {
      height: 50,
      borderColor: theme == 'dark' ? DarkColors.GrayDarker : Colors.GrayLighter,
      borderWidth: 1,
      borderRadius: 5,
      paddingHorizontal: 8,
      marginTop: 10,
    },
    icon: {
      marginRight: 5,
    },
    placeholderStyle: {
      fontSize: 14,
      fontWeight: '600',
      color: theme == 'dark' ? DarkColors.GrayDarkest : Colors.GrayMedium,
    },
    selectedTextStyle: {
      fontSize: 16,
      color: theme == 'dark' ? 'white' : Colors.GrayDarkest,
    },
    iconStyle: {
      width: 20,
      height: 20,
      tintColor: theme == 'dark' ? DarkColors.GrayDarkest : Colors.GrayMedium,
    },
    inputSearchStyle: {
      height: 40,
      fontSize: 16,
    },
  });
