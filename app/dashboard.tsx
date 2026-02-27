import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack, useRouter } from 'expo-router';
import { Alert, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Watermark } from '../components/Watermark';
import { useBank } from '../context/BankContext';

interface Account {
  id: string;
  type: string;
  alias: string;
  number: string;
  balance: number;
  limit?: number;
}

export default function Dashboard() {
  const { accounts, user } = useBank();
  const router = useRouter();

  const handleLogout = () => {
    Alert.alert(
      "Cerrar Sesión",
      "¿Estás seguro que quieres salir de NovaBank?",
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Salir", 
          style: "destructive", 
          onPress: () => router.replace('/') 
        }
      ]
    );
  };

  const getCardColors = (type: string): [string, string, ...string[]] => {
    if (type === 'Crédito') {
    return ['#ebb70fff', '#F7D669', '#ebb70fff'];}
      return ['#1e3c72', '#4b6aa0ff', '#2a5298'];  };

  const menuItems = [
    { id: 1, title: 'Transferir', icon: '💸', route: '/operations/transfer' },
    { id: 2, title: 'Pago TDC', icon: '✨', route: '/operations/loans' },
    { id: 3, title: 'Retiro s/tarjeta', icon: '🏧', route: '/operations/withdraw' },
    { id: 4, title: 'Pagar Servicio', icon: 'bulb', route: '/operations/services' },
    { id: 5, title: 'Recargas', icon: '📱', route: '/operations/airtime' },
    { id: 6, title: 'Sucursales', icon: '📍', route: '/sucursales' },
  ];

  return (
    <View style={styles.mainContainer}>
      <ScrollView>
        <Stack.Screen 
          options={{
            headerLeft: () => null, 
            gestureEnabled: false,
            headerStyle: { backgroundColor: '#072146' },
            headerShadowVisible: false, 
            headerTitle: () => (
              <Image 
                source={require('../assets/images/logo-text.png')}
                style={{ width: 120, height: 40 }}
                resizeMode="contain"
              />
            ),
            headerTitleAlign: 'center',
            headerRight: () => (
              <TouchableOpacity onPress={handleLogout} style={{ marginLeft: 6 }}>
                <Ionicons name="log-out-outline" size={28} color="#fff" />  
              </TouchableOpacity>
            ),
          }} 
        />

        <View style={styles.header}>
          <View>
            <View style={styles.greetingRow}>
              <Image 
                source={require('../assets/images/NovaIcon.png')} 
                style={styles.smallIcon}
                resizeMode="contain"
              />
              <Text style={styles.userName}>Hola, {user.name}</Text>
            </View>
            <Text style={styles.lastLogin}>Último acceso: {user.lastLogin}</Text>
          </View>
        </View>

        <View style={styles.whiteSheet}>
            
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>MIS PRODUCTOS</Text>
              
              {accounts.map((acc: Account) => (
                  <TouchableOpacity 
                    key={acc.id} 
                    activeOpacity={0.9} 
                    style={styles.cardContainer} 
                    onPress={() => {
                        // @ts-ignore
                        router.push(`/account/${acc.id}`);
                    }}
                  >
                    <LinearGradient
                      colors={getCardColors(acc.type)}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.cardGradient} 
                    >
                    <View style={styles.cardHeaderRow}>
                      <View style={styles.chip} /> 

                      <Ionicons 
                        name="wifi" 
                        size={20} 
                        color="rgba(255,255,255,0.6)" 
                        style={{
                          marginRight: 'auto', 
                          transform: [{ rotate: '90deg' }]
                        }} 
                      />
                      
                      <Image 
                        source={require('../assets/images/logo-text-itallic.png')}
                        style={styles.cardBrandLogo}
                        resizeMode="contain"
                      />
                    </View>

                    <Text style={styles.cardNumberHidden}>•••• •••• •••• {acc.number.replace('**', '')}</Text>

                    <View style={styles.cardFooterRow}>
                      <View>
                        <Text style={styles.cardLabel}>Saldo disponible</Text>
                        <Text style={styles.cardBalance}>${acc.balance.toLocaleString('es-MX')}</Text>
                      </View>
                      <View style={{alignItems: 'flex-end'}}>
                        <Text style={styles.cardLabel}>{acc.type.toUpperCase()}</Text>
                        <Text style={styles.cardAlias}>{acc.alias}</Text>
                      </View>
                    </View>
                  </LinearGradient>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.gridContainer}>
              {menuItems.map((item) => (
                <TouchableOpacity 
                  key={item.id} 
                  style={styles.gridItem}
                  onPress={() => {
                      if (item.route) {
                        // @ts-ignore
                        router.push(item.route);
                      } else {
                        Alert.alert("Próximamente", "Esta función está en desarrollo");
                      }
                  }}
                >
                  <Text style={styles.icon}>{item.icon}</Text>
                  <Text style={styles.menuText}>{item.title}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Watermark />
            <View style={{height: 'auto'}} />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: { 
    flex: 1, 
    backgroundColor: '#072146' 
  },
  header: {
    backgroundColor: '#072146', 
    padding: 20, 
    paddingBottom: 15, 
    paddingTop: 'auto', 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
  },
  
  whiteSheet: {
    backgroundColor: '#f0f2f5', 
    borderTopLeftRadius: 30,    
    borderTopRightRadius: 30,   
    borderBottomLeftRadius: 30,    
    borderBottomRightRadius: 30,   
    paddingTop: 10,
    paddingBottom: 'auto',             
    minHeight: 600,
    overflow: 'hidden',         
  },

  userName: { color: 'white', fontSize: 20, fontWeight: 'bold' },
  lastLogin: { color: '#aaa', fontSize: 12, marginLeft: 40 },
  
  section: { 
    padding: 15, 
    marginTop: 0 
  },
  sectionTitle: { color: '#072146', fontWeight: 'bold', marginTop: 'auto', marginBottom: 10, marginLeft: 5 },
  
  gridContainer: { flexDirection: 'row', flexWrap: 'wrap', padding: 15, justifyContent: 'space-between', shadowColor: "#000",
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.3,
  shadowRadius: 5,
  elevation: 8 }, 
  
  gridItem: { width: '31%', backgroundColor: 'white', aspectRatio: 1, justifyContent: 'center', alignItems: 'center', borderRadius: 8, marginBottom: 10, elevation: 2 },
  icon: { fontSize: 35, marginBottom: 5 },
  menuText: { fontSize: 12, color: '#072146', textAlign: 'center' },
  greetingRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 5 },
  smallIcon: { width: 30, height: 30, marginRight: 10 },
  
  // Tarjetas
  cardContainer: {
    marginBottom: 15,
    borderRadius: 16,
    backgroundColor: 'white',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
    elevation: 10,
  },
  
  cardGradient: {
    borderRadius: 16,
    padding: 20,
    minHeight: 180,
    justifyContent: 'space-between',
    width: '100%', 
  },
  
  cardHeaderRow: { flexDirection: 'row', alignItems: 'center', width: '100%' },
  
  chip: { 
    width: 40, 
    height: 30, 
    backgroundColor: '#e0c068', 
    borderRadius: 6,
    marginRight: 10,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)'
  },
  
  cardNumberHidden: { color: '#fff', fontSize: 22, letterSpacing: 4, fontFamily: 'Courier', marginTop: 10, opacity: 0.9 },
  
  cardFooterRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  cardLabel: { color: 'rgba(255,255,255,0.6)', fontSize: 10, textTransform: 'uppercase', marginBottom: 2 },
  cardBalance: { color: '#ffffffff', fontSize: 24, fontWeight: 'bold' },
  cardAlias: { color: 'white', fontSize: 14, fontWeight: '600' },
  cardBrandLogo: {
    width: 80,
    height: 15,
    resizeMode: 'contain',
  },
});