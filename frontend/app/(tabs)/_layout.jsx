import { View, Text, Image, Platform, StyleSheet } from 'react-native'
import { Tabs, Redirect } from 'expo-router'
import { useAuth } from '../../lib/AuthContext'
import { StatusBar } from 'expo-status-bar'
import { icons } from '../../constants'
import { ActivityIndicator } from 'react-native'


const TabIcon = ({ icon, color, focused }) => {
  const iconSize = Platform.OS === 'web' ? 24 : 20;

  return (
    <View>
      <Image 
        source={icon}
        resizeMode='contain'
        tintColor={color}
        style={{
          width: iconSize,
          height: iconSize,
          marginTop: 30,
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
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#fff" />
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
          tabBarActiveTintColor: "#2E8B57",
          tabBarInactiveTintColor: "#324958",
          tabBarStyle: {
            backgroundColor: 'rgba(255, 255, 255, 0.85)',
            position: 'absolute',
            bottom: 20,
            left: 20,
            right: 20,
            borderRadius: 50,
            height: 70,
            paddingVertical: Platform.OS === 'ios' ? 30 : 0,
            marginBottom: 0,
            marginHorizontal: 25,
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
                icon={icons.home}
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
                icon={icons.add}
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
                icon={icons.settings}
                color={color}
                focused={focused}
              />
            )
          }}
        />
      </Tabs>
      <StatusBar backgroundColor='transparent' style='light' />
    </>
  )
}

export default TabsLayout

const styles = StyleSheet.create({
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    // Native RN doesn't natively support "gap: 1", so you might add spacing
    // around children as needed. For example:
    // rowGap: 4 (if using a modern RN version) or margin on children.
  },
  focusIndicator: {
    height: 3,
    marginTop: 4,
    borderRadius: 2,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
