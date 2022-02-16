import { NativeStackScreenProps } from '@react-navigation/native-stack'
import React, { useState } from 'react'
import { View, StyleSheet, TouchableOpacity } from 'react-native'
import { Text } from 'react-native-paper'
import Background from '../../components/Authentication/Background'
import Button from '../../components/Authentication/Button'
import Header from '../../components/Authentication/Header'
// import Logo from '../../components/Authentication/Logo'
import TextInput from '../../components/Authentication/TextInput'
import { theme } from '../../core/theme'
import { emailValidator } from '../../helpers/emailValidator'
import { nameValidator } from '../../helpers/nameValidator'
import { passwordValidator } from '../../helpers/passwordValidator'
import { RootStackParamList } from '../../types'
import { useAuth } from '../../hooks/useAuth'

type Props = NativeStackScreenProps<RootStackParamList, 'RegisterScreen'>;

export default function RegisterScreen({ navigation }: Props) {
  const [name, setName] = useState({ value: '', error: '' })
  const [email, setEmail] = useState({ value: '', error: '' })
  const [password, setPassword] = useState({ value: '', error: '' })
  const { signup } = useAuth();

  const onSignUpPressed = async () => {
    const nameError = nameValidator(name.value)
    const emailError = emailValidator(email.value)
    const passwordError = passwordValidator(password.value)
    if (emailError || passwordError || nameError) {
      setName({ ...name, error: nameError })
      setEmail({ ...email, error: emailError })
      setPassword({ ...password, error: passwordError })
      return
    }
    try {
      await signup(email.value, password.value);
    } catch (error) {
      console.log("$$$ - error", error);
    }
  }

  return (
    <Background>
      {/* <Logo /> */}
      <Header>Create Account</Header>
      <TextInput
        label="Name"
        returnKeyType="next"
        value={name.value}
        onChangeText={(text: any) => setName({ value: text, error: '' })}
        error={!!name.error}
        errorText={name.error} description={undefined}      />
      <TextInput
        label="Email"
        returnKeyType="next"
        value={email.value}
        onChangeText={(text: any) => setEmail({ value: text, error: '' })}
        error={!!email.error}
        errorText={email.error}
        autoCapitalize="none"
        autoCompleteType="email"
        textContentType="emailAddress"
        keyboardType="email-address" description={undefined}      />
      <TextInput
        label="Password"
        returnKeyType="done"
        value={password.value}
        onChangeText={(text: any) => setPassword({ value: text, error: '' })}
        error={!!password.error}
        errorText={password.error}
        secureTextEntry description={undefined}      />
      <Button
        mode="contained"
        onPress={onSignUpPressed}
        style={{ marginTop: 24 }}
      >
        Sign Up
      </Button>
      <View style={styles.row}>
        <Text>Already have an account? </Text>
        <TouchableOpacity onPress={() => navigation.replace('LoginScreen')}>
          <Text style={styles.link}>Login</Text>
        </TouchableOpacity>
      </View>
    </Background>
  )
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    marginTop: 4,
  },
  link: {
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
})
