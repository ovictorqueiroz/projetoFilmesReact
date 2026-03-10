import { StyleSheet, ScrollView, Text } from 'react-native';
import FilmeForm from './src/components/FilmeForm';
import FilmeList from './src/components/FilmeList';
import { View } from 'react-native-web';


  

export default function App() {

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.titulo}>🎬 LISTA DE FILMES 🍿</Text>
      <FilmeForm />
      <View style={styles.divisor}/>
      <FilmeList />
    </ScrollView>
  );
}

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
  }
});