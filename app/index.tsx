import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import { ActivityIndicator, Alert, Animated, Dimensions, Image, Keyboard, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useBank } from '../context/BankContext';

const { height, width } = Dimensions.get('window');

export default function Login() {
  const router = useRouter();
  const { updateLoginDate } = useBank();

  const [pass, setPass] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState('');

  const formOpacity = useRef(new Animated.Value(1)).current;
  const logoTranslateY = useRef(new Animated.Value(0)).current;
  const revealScale = useRef(new Animated.Value(0)).current;

  const performLoginSuccess = () => {
    Keyboard.dismiss(); 
    setIsLoading(true);

    updateLoginDate();

    Animated.sequence([
        Animated.delay(500),
        
        Animated.parallel([
            Animated.timing(formOpacity, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }),
            Animated.spring(logoTranslateY, {
                toValue: height / 6, 
                useNativeDriver: true,
                friction: 6,
            })
        ]),

        Animated.timing(revealScale, {
            toValue: 50, 
            duration: 600,
            useNativeDriver: true,
        })
    ]).start(() => {
        setIsLoading(false);
        router.replace('/dashboard');
    });
  };

  const handleLogin = () => {
    if (pass.length === 0) {
        Alert.alert("Atención", "Ingresa tu contraseña");
        return;
    }
    performLoginSuccess();
  };

  const handleBiometric = () => {
    performLoginSuccess();
  };

  const handleRecovery = () => {
    setModalVisible(false);
    setRecoveryEmail('');
    
    setTimeout(() => {
        Alert.alert(
            "Correo Enviado", 
            `Hemos enviado las instrucciones para restablecer tu contraseña a:\n\n${recoveryEmail}\n\nRevisa tu bandeja de entrada.`
        );
    }, 500);
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false, gestureEnabled: false }} />

      <Animated.View 
        style={[
            styles.revealCircle,
            { transform: [{ scale: revealScale }] }
        ]} 
      />

      <Animated.View style={[
          styles.logoArea, 
          { transform: [{ translateY: logoTranslateY }] } 
      ]}>
        <Image 
          source={require('../assets/images/logo-nova.png')} 
          style={styles.logoImage}
          resizeMode="contain" 
        />
      </Animated.View>

      <Animated.View style={[styles.form, { opacity: formOpacity }]}>
        <Text style={styles.welcome}>Hola, Alec Isaac</Text>
        
        <TextInput 
          secureTextEntry 
          style={styles.input} 
          placeholder="Contraseña" 
          placeholderTextColor="#ccc"
          value={pass}
          onChangeText={setPass}
          editable={!isLoading} 
        />

        <TouchableOpacity 
            style={styles.btn} 
            onPress={handleLogin}
            disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#072146" />
          ) : (
            <Text style={styles.btnText}>ENTRAR</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity style={styles.biometricBtn} onPress={handleBiometric} disabled={isLoading}>
            <Ionicons name="scan-outline" size={30} color="#2DCCCD" />
            <Text style={styles.biometricText}>Ingresar con Face ID</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setModalVisible(true)}>
            <Text style={styles.link}>Olvidé mi contraseña</Text>
        </TouchableOpacity>
      </Animated.View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
            <View style={styles.modalCard}>
                <View style={styles.modalHeader}>
                    <Ionicons name="mail-unread-outline" size={40} color="#072146" />
                    <Text style={styles.modalTitle}>Recuperar Acceso</Text>
                </View>
                
                <Text style={styles.modalDesc}>
                    Ingresa tu correo electrónico registrado y te enviaremos un enlace temporal.
                </Text>

                <TextInput 
                    style={styles.modalInput}
                    placeholder="ejemplo@correo.com"
                    placeholderTextColor="#999"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={recoveryEmail}
                    onChangeText={setRecoveryEmail}
                />

                <View style={styles.modalActions}>
                    <TouchableOpacity 
                        style={[styles.modalBtn, styles.modalBtnCancel]}
                        onPress={() => setModalVisible(false)}
                    >
                        <Text style={styles.modalBtnTextCancel}>Cancelar</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                        style={[styles.modalBtn, styles.modalBtnConfirm]}
                        onPress={handleRecovery}
                    >
                        <Text style={styles.modalBtnTextConfirm}>Enviar</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#072146', 
    alignItems: 'center', 
    justifyContent: 'center'
  },
  
  revealCircle: {
    position: 'absolute',
    top: height / 2 - 50, 
    left: width / 2 - 50, 
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#ffffffff', 
    zIndex: 0, 
  },

  logoArea: { alignItems: 'center', marginBottom: 30, zIndex: 10 },
  logoImage: { width: 280, height: 280 },
  
  form: { width: '100%', paddingHorizontal: 20, marginBottom: 50, zIndex: 10 },
  welcome: { color: 'white', fontSize: 22, marginBottom: 20, textAlign: 'center', fontWeight: 'bold' },
  
  input: { 
    backgroundColor: 'rgba(255,255,255,0.1)', 
    color: 'white', 
    padding: 15, 
    borderRadius: 8, 
    marginBottom: 20, 
    fontSize: 18, 
    borderWidth: 1, 
    borderColor: 'rgba(45, 204, 205, 0.5)' 
  },
  
  btn: { 
    backgroundColor: '#2DCCCD', 
    padding: 15, 
    borderRadius: 8, 
    alignItems: 'center',
    marginBottom: 20
  },
  btnText: { color: '#072146', fontWeight: 'bold', fontSize: 16, letterSpacing: 1 },
  
  biometricBtn: { alignItems: 'center', marginBottom: 20 },
  biometricText: { color: '#2DCCCD', marginTop: 5, fontSize: 12 },

  link: { color: 'rgba(255,255,255,0.6)', marginTop: 10, textAlign: 'center', textDecorationLine: 'underline', fontSize: 13 },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)', 
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  modalCard: {
    backgroundColor: 'white',
    width: '100%',
    borderRadius: 20,
    padding: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10
  },
  modalHeader: { alignItems: 'center', marginBottom: 15 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: '#072146', marginTop: 10 },
  modalDesc: { textAlign: 'center', color: '#666', marginBottom: 20, fontSize: 14, lineHeight: 20 },
  modalInput: {
    backgroundColor: '#f5f7fa',
    padding: 15,
    borderRadius: 10,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e1e3e6',
    marginBottom: 25,
    color: '#333'
  },
  modalActions: { flexDirection: 'row', justifyContent: 'space-between' },
  modalBtn: { width: '48%', padding: 15, borderRadius: 10, alignItems: 'center' },
  modalBtnCancel: { backgroundColor: '#f0f2f5' },
  modalBtnConfirm: { backgroundColor: '#072146' },
  modalBtnTextCancel: { color: '#666', fontWeight: 'bold' },
  modalBtnTextConfirm: { color: '#2DCCCD', fontWeight: 'bold' }
});