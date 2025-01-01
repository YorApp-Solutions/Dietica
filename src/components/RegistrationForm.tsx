import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { supabase } from '../lib/supabaseClient';
import { AuthError } from '@supabase/supabase-js';

interface RegistrationFormData {
  email: string;
  password: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  weight: number;
  height: number;
  allergies: string[];
  isVegetarian: boolean;
  healthConditions: string[];
  activityLevel: 'sedentary' | 'moderate' | 'heavy';
  weightGoal: 'lose' | 'maintain' | 'gain';
  fitnessGoal: 'muscle_gain' | 'fat_loss' | 'maintain';
}

const RegistrationForm: React.FC = () => {
  const [formData, setFormData] = useState<RegistrationFormData>({
    email: '',
    password: '',
    age: 0,
    gender: 'male',
    weight: 0,
    height: 0,
    allergies: [],
    isVegetarian: false,
    healthConditions: [],
    activityLevel: 'moderate',
    weightGoal: 'maintain',
    fitnessGoal: 'maintain',
  });
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    try {
      // 1. Register the user with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      });

      if (authError) {
        throw authError;
      }

      // 2. Create the user profile
      const { error: profileError } = await supabase
        .from('user_profiles')
        .insert([
          {
            id: authData.user!.id,
            age: formData.age,
            gender: formData.gender,
            weight_kg: formData.weight,
            height_cm: formData.height,
            allergies: formData.allergies,
            is_vegetarian: formData.isVegetarian,
            health_conditions: formData.healthConditions,
            activity_level: formData.activityLevel,
            weight_goal: formData.weightGoal,
            fitness_goal: formData.fitnessGoal,
          },
        ]);

      if (profileError) {
        throw profileError;
      }

      // Registration successful
      // eslint-disable-next-line no-alert
    //   alert('Registration successful! Please check your email to verify your account.');
    } catch (err) {
      // Type guard for the error
      const errorWithType = err as AuthError | Error;
      setError(errorWithType.message);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
      >
        <ScrollView style={styles.scrollView}>
          <View style={styles.container}>
            <Text style={styles.title}>Create Account</Text>
            {error && <Text style={styles.error}>{error}</Text>}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                value={formData.email}
                onChangeText={(text) => setFormData({ ...formData, email: text })}
                keyboardType="email-address"
                style={styles.input}
                placeholder="Enter your email"
                placeholderTextColor="#666"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Password</Text>
              <TextInput
                value={formData.password}
                onChangeText={(text) => setFormData({ ...formData, password: text })}
                secureTextEntry
                style={styles.input}
                placeholder="Choose a password"
                placeholderTextColor="#666"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Age</Text>
              <TextInput
                value={formData.age.toString()}
                onChangeText={(text) => setFormData({ ...formData, age: parseInt(text, 10) || 0 })}
                keyboardType="numeric"
                style={styles.input}
                placeholder="Your age"
                placeholderTextColor="#666"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Gender</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={formData.gender}
                  onValueChange={(value: string) =>
                    setFormData({ ...formData, gender: value as 'male' | 'female' | 'other' })}
                  style={styles.picker}
                >
                  <Picker.Item label="Male" value="male" />
                  <Picker.Item label="Female" value="female" />
                  <Picker.Item label="Other" value="other" />
                </Picker>
              </View>
            </View>

            <TouchableOpacity
              style={styles.button}
              onPress={handleSubmit}
              activeOpacity={0.8}
            >
              <Text style={styles.buttonText}>Register</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  container: {
    padding: 20,
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 30,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    borderRadius: 8,
    backgroundColor: 'white',
    fontSize: 16,
    color: '#333',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: 'white',
    overflow: 'hidden',
  },
  picker: {
    height: 50,
    width: '100%',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '600',
  },
  error: {
    color: '#FF3B30',
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 14,
  },
});

export default RegistrationForm;
