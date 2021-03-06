import { NativeStackScreenProps } from '@react-navigation/native-stack'
import React, { useState } from 'react'
import { View, StyleSheet, TouchableOpacity } from 'react-native'
import { Snackbar, Text, useTheme } from 'react-native-paper'
import Background from '../../components/Authentication/Background'
import Button from '../../components/Authentication/Button'
import Header from '../../components/Authentication/Header'
import Logo from '../../components/Authentication/Logo'
import TextInput from '../../components/Authentication/TextInput'
import { theme } from '../../core/theme'
import { RootStackParamList } from '../../types'
import { useAuth } from '../../hooks/useAuth'
import { emailValidator, passwordValidator } from '../../helpers/validators'
import { createInitialActivities } from '../../helpers/dataCreators'

type Props = NativeStackScreenProps<RootStackParamList, 'RegisterScreen'>;

export default function RegisterScreen({ navigation }: Props) {
  const { colors } = useTheme();
  const [email, setEmail] = useState({ value: '', error: '' })
  const [password, setPassword] = useState({ value: '', error: '' })
  const { signup, setUser } = useAuth();
  const [isSnackBar, setIsSnackBar] = useState(false);

  const onSignUpPressed = async () => {
    const emailError = emailValidator(email.value)
    const passwordError = passwordValidator(password.value)
    if (emailError || passwordError) {
      setEmail({ ...email, error: emailError })
      setPassword({ ...password, error: passwordError })
      return
    }
    try {
      const newUserData = await signup(email.value, password.value);
      await createInitialActivities(newUserData.user);
      setUser(newUserData.user)
    } catch (error) {
      setIsSnackBar(true)
      console.log("$$$ - error", error);
    }
  }

  return (
    <Background>
      <Logo />
      <Header>Create Account</Header>
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
          <Text style={{...styles.link, color: colors.primary}}>Login</Text>
        </TouchableOpacity>
      </View>
      <Snackbar
        visible={isSnackBar}
        onDismiss={() => setIsSnackBar(false)}
        style={styles.snackBar}
        >
          An error has occured
      </Snackbar>
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
  },
  snackBar: {
    backgroundColor: theme.colors.error
  }
})
