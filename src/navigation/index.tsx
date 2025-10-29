/**
 * Main Navigation Component
 * Handles navigation structure for the app
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useAuth } from '../services/auth';
import { UserRole } from '../types';

// Auth Screens
import LoginScreen from '../screens/auth/LoginScreen';

// Patient Screens
import CalendarScreen from '../screens/patient/CalendarScreen';
import HistoryScreen from '../screens/patient/HistoryScreen';
import ShareScreen from '../screens/patient/ShareScreen';
import ProfileScreen from '../screens/patient/ProfileScreen';

// Professional Screens
import EntriesScreen from '../screens/professional/EntriesScreen';
import NewEntryScreen from '../screens/professional/NewEntryScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// ============================================================================
// Patient Tab Navigator
// ============================================================================

const PatientTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#6366F1',
        tabBarInactiveTintColor: '#9CA3AF',
        tabBarStyle: {
          borderTopWidth: 1,
          borderTopColor: '#E5E7EB',
          paddingTop: 5,
        },
        headerStyle: {
          backgroundColor: '#FFFFFF',
          borderBottomWidth: 1,
          borderBottomColor: '#E5E7EB',
        },
        headerTitleStyle: {
          fontWeight: '700',
          fontSize: 18,
        },
      }}
    >
      <Tab.Screen
        name="Calendar"
        component={CalendarScreen}
        options={{
          title: 'Calendario',
          tabBarIcon: ({ color }) => <TabIcon emoji="📅" color={color} />,
        }}
      />
      <Tab.Screen
        name="History"
        component={HistoryScreen}
        options={{
          title: 'Historial',
          tabBarIcon: ({ color }) => <TabIcon emoji="📋" color={color} />,
        }}
      />
      <Tab.Screen
        name="Share"
        component={ShareScreen}
        options={{
          title: 'Compartir',
          tabBarIcon: ({ color }) => <TabIcon emoji="🔗" color={color} />,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color }) => <TabIcon emoji="👤" color={color} />,
        }}
      />
    </Tab.Navigator>
  );
};

// ============================================================================
// Professional Tab Navigator
// ============================================================================

const ProfessionalTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#6366F1',
        tabBarInactiveTintColor: '#9CA3AF',
        tabBarStyle: {
          borderTopWidth: 1,
          borderTopColor: '#E5E7EB',
          paddingTop: 5,
        },
        headerStyle: {
          backgroundColor: '#FFFFFF',
          borderBottomWidth: 1,
          borderBottomColor: '#E5E7EB',
        },
        headerTitleStyle: {
          fontWeight: '700',
          fontSize: 18,
        },
      }}
    >
      <Tab.Screen
        name="Entries"
        component={EntriesScreen}
        options={{
          title: 'Intervenciones',
          tabBarIcon: ({ color }) => <TabIcon emoji="📋" color={color} />,
        }}
      />
      <Tab.Screen
        name="NewEntry"
        component={NewEntryScreen}
        options={{
          title: 'Nuevo registro',
          tabBarIcon: ({ color }) => <TabIcon emoji="➕" color={color} />,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color }) => <TabIcon emoji="👤" color={color} />,
        }}
      />
    </Tab.Navigator>
  );
};

// ============================================================================
// Tab Icon Component
// ============================================================================

const TabIcon = ({ emoji, color }: { emoji: string; color: string }) => {
  return <span style={{ fontSize: 24, opacity: color === '#6366F1' ? 1 : 0.5 }}>{emoji}</span>;
};

// ============================================================================
// Main Navigation
// ============================================================================

const Navigation = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return null; // Or a loading screen
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        {!user ? (
          // Auth Stack
          <Stack.Screen name="Login" component={LoginScreen} />
        ) : user.role === UserRole.PATIENT ? (
          // Patient Stack
          <Stack.Screen name="PatientApp" component={PatientTabs} />
        ) : (
          // Professional Stack
          <Stack.Screen name="ProfessionalApp" component={ProfessionalTabs} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
