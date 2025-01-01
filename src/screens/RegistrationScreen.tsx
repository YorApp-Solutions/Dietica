import React, { useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import { Input, Button, CheckBox } from 'react-native-elements';
import { supabase } from '../lib/supabaseClient';

export default function RegistrationScreen({ navigation }) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    age: '',
    gender: 'male',
    weight: '',
    height: '',
    allergies: [],
    isVegetarian: false,
    healthConditions: [],
    activityLevel: 'moderate',
    weightGoal: 'maintain',
    fitnessGoal: 'maintain',
  });

  const handleSubmit = async () => {
    try {
      // 1. Register the user with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      });

      if (authError) throw authError;

      // 2. Create the user profile
      const { error: profileError } = await supabase
        .from('user_profiles')
        .insert([
          {
            id: authData.user.id,
            age: parseInt(formData.age),
            gender: formData.gender,
            weight_kg: parseFloat(formData.weight),
            height_cm: parseFloat(formData.height),
            allergies: formData.allergies,
            is_vegetarian: formData.isVegetarian,
            health_conditions: formData.healthConditions,
            activity_level: formData.activityLevel,
            weight_goal: formData.weightGoal,
            fitness_goal: formData.fitnessGoal,
          },
        ]);

      if (profileError) throw profileError;

      Alert.alert(
        'Success',
        'Registration successful! Please check your email to verify your account.'
      );
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Input
        placeholder="Email"
        value={formData.email}
        onChangeText={(text) => setFormData({ ...formData, email: text })}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <Input
        placeholder="Password"
        value={formData.password}
        onChangeText={(text) => setFormData({ ...formData, password: text })}
        secureTextEntry
      />

      <Input
        placeholder="Age"
        value={formData.age}
        onChangeText={(text) => setFormData({ ...formData, age: text })}
        keyboardType="numeric"
      />

      <Input
        placeholder="Weight (kg)"
        value={formData.weight}
        onChangeText={(text) => setFormData({ ...formData, weight: text })}
        keyboardType="numeric"
      />

      <Input
        placeholder="Height (cm)"
        value={formData.height}
        onChangeText={(text) => setFormData({ ...formData, height: text })}
        keyboardType="numeric"
      />

      <CheckBox
        title="Vegetarian"
        checked={formData.isVegetarian}
        onPress={() => setFormData({ ...formData, isVegetarian: !formData.isVegetarian })}
      />

      <Button
        title="Register"
        onPress={handleSubmit}
        containerStyle={styles.buttonContainer}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  buttonContainer: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
}); 