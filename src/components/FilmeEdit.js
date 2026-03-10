import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useFonts, Notable_400Regular } from '@expo-google-fonts/notable';
import { db } from '../firebaseConfig';
import { ref, set } from 'firebase/database';

export default function FilmeEdit({ filme, onClose }) {
  const [titulo, setTitulo] = useState(filme.titulo);
  const [diretor, setDiretor] = useState(filme.diretor);

  function atualizarFilme() {
    set(ref(db, 'filmes/' + filme.id), {
      titulo: titulo,
      diretor: diretor,
    });
    onClose();
  }

  return (
    <View style={styles.container}>
      <Text style={styles.subtitulo}>✏️ Editando: {filme.titulo}</Text>
      <Text style={styles.label}>Título</Text>
      <TextInput
        style={styles.input}
        value={titulo}
        placeholderTextColor="#888"
        onChangeText={setTitulo}
      />
      <Text style={styles.label}>Diretor</Text>
      <TextInput
        style={styles.input}
        value={diretor}
        placeholderTextColor="#888"
        onChangeText={setDiretor}
      />
      <View style={styles.botoes}>
        <TouchableOpacity style={styles.botaoSalvar} onPress={atualizarFilme}>
          <Text style={styles.botaoTexto}>Salvar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.botaoCancelar} onPress={onClose}>
          <Text style={styles.botaoTexto}>Cancelar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#2d2d44',
    padding: 16,
    borderRadius: 8,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#FAB95B',
  },
  subtitulo: {
    color: '#FAB95B',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 14,
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
  botoes: {
    flexDirection: 'row',
    gap: 8,
  },
  botaoSalvar: {
    backgroundColor: '#FAB95B',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
  },
  botaoCancelar: {
    backgroundColor: '#c0392b',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
  },
  botaoTexto: {
    color: '#1a1a2e',
    fontWeight: 'bold',
    fontSize: 13,
  },
});