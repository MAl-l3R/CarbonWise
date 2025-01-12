import { View, Text, Image, Platform } from 'react-native'
import { Tabs, Redirect } from 'expo-router'
import { useAuth } from '../../lib/AuthContext'
import { StatusBar } from 'expo-status-bar'
import { icons } from '../../constants'
import { ActivityIndicator } from 'react-native'


const TabIcon = ({ icon, color, focused }) => {
  const iconSize = Platform.OS === 'web' ? 24 : 20;

  return (
    <View className= "items-center justify-center gap-1">
      <Image 
        source={icon}
        resizeMode='contain'
        tintColor={color}
        style={{
          width: iconSize,
          height: iconSize,
        }}
      />
      {focused && (
        <View 
          style={{
            width: iconSize,
            height: 3,
            backgroundColor: color,
            marginTop: 4,
            borderRadius: 2,
          }}
      />
      )}
    </View>
  )
}

const TabsLayout = () => {
  const { currentUser, setCurrentUser, loading } = useAuth();
    // While loading the user data, return null or a loading indicator
    if (loading) {
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    }

    if (!currentUser) {
      return <Redirect href="/" />;  // Go back to onboarding screen instead of just sign in screen
    }

  return (
    <>
      <Tabs
        screenOptions={{
          tabBarShowLabel: false,
          tabBarActiveTintColor: "#0869C4",
          tabBarInactiveTintColor: "#324958",
          tabBarStyle: {
            backgroundColor: '#FFFFFF',
            position: 'absolute',
            bottom: 20,
            left: 20,
            right: 20,
            borderRadius: 50,
            height: 70,
            paddingVertical: Platform.OS === 'ios' ? 30 : 0,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.3,
            shadowRadius: 5,
            elevation: 5,
          },
        }}
      >
        <Tabs.Screen
          name='home'
          options={{
            title: 'Home',
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                // icon={icons.home}
                color={color}
                focused={focused}
              />
            )
          }}
        />
        <Tabs.Screen
          name='add'
          options={{
            title: 'Add',
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                // icon={icons.wrench}
                color={color}
                focused={focused}
              />
            )
          }}
        />

        <Tabs.Screen
          name='settings'
          options={{
            title: 'Settings',
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                // icon={icons.account}
                color={color}
                focused={focused}
              />
            )
          }}
        />
      </Tabs>
      <StatusBar backgroundColor='#ffffff' style='dark' />
    </>
  )
}

export default TabsLayout
