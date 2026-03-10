import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { db } from '../firebaseConfig';
import { ref, onValue, remove } from 'firebase/database';
import FilmeEdit from './FilmeEdit';

export default function FilmeList() {
  const [filmes, setFilmes] = useState([]);
  const [filmeSelecionado, setFilmeSelecionado] = useState(null);

  useEffect(() => {
    const filmesRef = ref(db, 'filmes');
    onValue(filmesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const lista = Object.entries(data).map(([id, valor]) => ({
          id,
          ...valor,
        }));
        setFilmes(lista);
      }
    });
  }, []);

  function deletarFilme(id, titulo) {
  if (window.confirm(`Tem certeza que deseja excluir "${titulo}"?`)) {
    remove(ref(db, 'filmes/' + id));
  }
}

  return (
    <View>
      <Text style={styles.subtitulo}>Filmes cadastrados:</Text>
      {filmes.map((filme) => (
        <View key={filme.id} style={styles.card}>
          <Text style={styles.titulo}>🎬 {filme.titulo}</Text>
          <Text style={styles.diretor}>🎥 {filme.diretor}</Text>
          <View style={styles.botoes}>  
            <TouchableOpacity style={styles.botaoEditar} onPress={() => setFilmeSelecionado(filme)}>
              <Text style={styles.botaoTexto}>Editar</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.botaoExcluir} onPress={() => deletarFilme(filme.id, filme.titulo)}>
  <Text style={styles.botaoTexto}>Excluir</Text>
</TouchableOpacity>

          </View>
        </View>
      ))}
      {filmeSelecionado && (
        <FilmeEdit filme={filmeSelecionado} onClose={() => setFilmeSelecionado(null)} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  subtitulo: {
    fontFamily: 'Notable_400Regular',
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FAB95B',
    marginBottom: 12,
  },
  card: {
    backgroundColor: '#2d2d44',
    padding: 14,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#FAB95B',
  },
  titulo: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  diretor: {
    color: '#aaa',
    fontSize: 14,
    marginBottom: 10,
  },
  botoes: {
    flexDirection: 'row',
    gap: 8,
  },
  botaoEditar: {
    backgroundColor: '#FAB95B',
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  botaoExcluir: {
    backgroundColor: '#c0392b',
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  botaoTexto: {
    color: '#1a1a2e',
    fontWeight: 'bold',
    fontSize: 12,
  },
});