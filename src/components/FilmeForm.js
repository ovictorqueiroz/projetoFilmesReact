import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { db } from '../firebaseConfig';
import { ref, push } from 'firebase/database';
import { auth } from '../firebaseConfig';

export default function FilmeForm() {
  const [titulo, setTitulo] = useState('');
  const [diretor, setDiretor] = useState('');
  const [ano, setAno] = useState('');
  const [assistido, setAssistido] = useState(false)
  ;

  function salvarFilme() {
    const uid = auth.currentUser.uid;
    push(ref(db, 'filmes/' + uid), {
      titulo: titulo,
      diretor: diretor,
      ano: ano,
      assistido: assistido
    });
    setTitulo('');
    setDiretor('');
    setAno('');
    setAssistido(false);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Título</Text>
      <TextInput
        style={styles.input}
        placeholder="Ex: Star Wars"
        placeholderTextColor="#888"
        value={titulo}
        onChangeText={setTitulo}
      />
      <Text style={styles.label}>Diretor</Text>
      <TextInput
        style={styles.input}
        placeholder="Ex: George Lucas"
        placeholderTextColor="#888"
        value={diretor}
        onChangeText={setDiretor}
      />

      <Text style={styles.label}>Ano de Estreia</Text>
      <TextInput
        style={styles.input}
        placeholder='Ex: 1977'
        placeholderTextColor="#888"
        value={ano}
        onChangeText={setAno}

      />
      <TouchableOpacity style={styles.botao} onPress={salvarFilme}>
        <Text style={styles.botaoTexto}>🎬 Salvar Filme</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#2d2d44',
    padding: 16,
    borderRadius: 8,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#FAB95B',
  },
  label: {
    color: '#FAB95B',
    fontWeight: 'bold',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#1a1a2e',
    color: '#fff',
    padding: 10,
    borderRadius: 6,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#444',
  },
  botao: {
    backgroundColor: '#FAB95B',
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
    width: 150
    ,
  },
  botaoTexto: {
    color: '#1a1a2e',
    fontWeight: 'bold',
    fontSize: 15,
  },
});