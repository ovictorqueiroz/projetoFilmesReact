import { useEffect, useState } from 'react';
import { StyleSheet, ScrollView, Text, TouchableOpacity } from 'react-native';
import { View } from 'react-native-web';
import { auth } from './src/firebaseConfig';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import FilmeForm from './src/components/FilmeForm';
import FilmeList from './src/components/FilmeList';
import Login from './src/components/Login';


  

export default function App() {
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setUsuario(user);
    });
    return () => unsub();
  }, [])

  if(usuario === null){
    return <Login/>;
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.titulo}>🎬 Lista de Filmes de {usuario.displayName} 🍿</Text>
      <TouchableOpacity style={styles.botaoLogout} onPress={() => signOut(auth)}>
        <Text style={styles.botaoLogoutTexto}>Sair</Text>
      </TouchableOpacity>
      <FilmeForm />
      <View style={styles.divisor} />
      <FilmeList />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#222831",
    paddingHorizontal: 20,
  },
  titulo: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FAB95B',
    marginTop: 50,
    marginBottom: 24,
    textAlign: 'center',
  },
  divisor:{
    borderBottomWidth: 2.5,
  borderBottomColor: '#FAB95B',
  marginVertical: 16,
  },

  botaoLogout: {
    backgroundColor: '#c0392b',
    padding: 8,
    borderRadius: 6,
    alignItems: 'center',
    marginBottom: 20,
    alignSelf: 'flex-end',
  },

  botaoLogoutTexto: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 13,
  }
});