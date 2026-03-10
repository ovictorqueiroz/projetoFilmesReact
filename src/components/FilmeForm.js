import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { db } from '../firebaseConfig';
import { ref, push } from 'firebase/database';

export default function FilmeForm() {
  const [titulo, setTitulo] = useState('');
  const [diretor, setDiretor] = useState('');

  function salvarFilme() {
    push(ref(db, 'filmes'), {
      titulo: titulo,
      diretor: diretor,
    });
    setTitulo('');
    setDiretor('');
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