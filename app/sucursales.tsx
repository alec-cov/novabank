import { Ionicons } from '@expo/vector-icons';
import { Stack } from 'expo-router';
import { Dimensions, Image, StyleSheet, Text, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

export default function Sucursales() {
  const initialRegion = {
    latitude: 20.6767,
    longitude: -103.3475,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  const branches = [
    { id: 1, title: 'NovaBank Centro', lat: 20.6767, long: -103.3475, desc: 'Av. Vallarta y Enrique Díaz' },
    { id: 2, title: 'NovaBank Chapultepec', lat: 20.6738, long: -103.3650, desc: 'Zona Rosa' },
    { id: 3, title: 'NovaBank Plaza del Sol', lat: 20.6486, long: -103.4074, desc: 'Dentro de la Plaza' },
    { id: 4, title: 'NovaBank Andares', lat: 20.7109, long: -103.4132, desc: 'Zona VIP' },
    { id: 5, title: 'NovaBank Vallarta', lat: 20.6760, long: -103.3930, desc: 'Cerca de La Gran Plaza' },
  ];

  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{ 
            title: 'Sucursales y Cajeros', 
            headerBackTitle: 'Volver',
            headerStyle: { backgroundColor: '#072146' }, 
            headerTintColor: '#fff',
        }} 
      />

      <MapView style={styles.map} initialRegion={initialRegion}>
        {branches.map(branch => (
          <Marker
            key={branch.id}
            coordinate={{ latitude: branch.lat, longitude: branch.long }}
            title={branch.title}
            description={branch.desc}>
            <View style={styles.markerContainer}>
                <View style={styles.markerCircle}>
                    <Image 
                        source={require('../assets/images/NovaIcon.png')}
                        style={styles.markerLogo}
                        resizeMode="contain"
                    />
                </View>
                <View style={styles.markerArrow} />
            </View>
          </Marker>
        ))}
      </MapView>

      <View style={styles.footerCard}>
        <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 5}}>
            <Ionicons name="time-outline" size={20} color="#072146" style={{marginRight: 5}} />
            <Text style={styles.footerTitle}>Horarios de Atención</Text>
        </View>
        <Text style={styles.footerSub}>Lunes a Viernes: 9:00 AM - 4:00 PM</Text>
        <Text style={styles.footerSub}>Sábados: 9:00 AM - 1:00 PM</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
  map: { width: Dimensions.get('window').width, height: Dimensions.get('window').height },
  
  markerContainer: { alignItems: 'center' },
  
  markerCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#072146', 
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  
  markerLogo: {
    width: 26,
    height: 26,
  },
  
  markerArrow: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderTopWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#072146', 
    marginTop: -1, 
  },

  footerCard: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    right: 20,
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  footerTitle: { color: '#072146', fontWeight: 'bold', fontSize: 16 },
  footerSub: { color: '#666', fontSize: 13, marginTop: 2 }
});