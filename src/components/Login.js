import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { auth } from '../firebaseConfig';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'firebase/auth';

export default function Login() {
  const [isCadastro, setIsCadastro] = useState(false);
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');

  function testaSenha(senha) {
    if (senha.trim().length < 8) return 'A senha deve conter pelo menos 8 caracteres.';
    if (!/[a-z]/.test(senha)) return 'A senha deve conter pelo menos uma minúscula.';
    if (!/[A-Z]/.test(senha)) return 'A senha deve conter pelo menos uma maiúscula.';
    if (!/[0-9]/.test(senha)) return 'A senha deve conter pelo menos um número';
    if (!/[!@#$%&*]/.test(senha)) return 'A senha deve conter pelo menos um caracter especial';
    return null; // senha válida
}

  async function cadastrar() {
  const erroSenha = testaSenha(senha);
  if (erroSenha) {
    setErro(erroSenha);
    return;
  }
  try {
    const resultado = await createUserWithEmailAndPassword(auth, email, senha);
    await updateProfile(resultado.user, { displayName: nome });
    window.location.reload();
  } catch (e) {
    setErro('Erro ao cadastrar. Verifique os dados.');
  }
}

  async function entrar() {
    try {
      await signInWithEmailAndPassword(auth, email, senha);
      
    } catch (e) {
      setErro('Email ou senha inválidos.');
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>🎬 LISTA DE FILMES 🍿</Text>
      <Text style={styles.subtitulo}>{isCadastro ? 'Criar conta' : 'Entrar'}</Text>

      {isCadastro && (
        <TextInput
          style={styles.input}
          placeholder="Nome (Ex: Maria da Silva)"
          placeholderTextColor="#888"
          value={nome}
          onChangeText={setNome}
        />
      )}

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#888"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}  
        placeholder="Senha"
        placeholderTextColor="#888"
        value={senha}
        onChangeText={setSenha}
        secureTextEntry
      />

      {erro ? <Text style={styles.erro}>{erro}</Text> : null}

      <TouchableOpacity
        style={styles.botao}
        onPress={isCadastro ? cadastrar : entrar}
      >
        <Text style={styles.botaoTexto}>{isCadastro ? 'Cadastrar' : 'Entrar'}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => { setIsCadastro(!isCadastro); setErro(''); }}>
        <Text style={styles.link}>
          {isCadastro ? 'Já tem conta? Faça login' : 'Não tem conta? Cadastre-se'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#222831',
    padding: 24,
    justifyContent: 'center',
  },
  titulo: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FAB95B',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitulo: {
    fontSize: 30,
    color: '#FAB95B',
    textAlign: 'center',
    marginBottom: 24,
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
    marginBottom: 12,
  },
  botaoTexto: {
    color: '#1a1a2e',
    fontWeight: 'bold',
    fontSize: 15,
  },
  link: {
    color: '#FAB95B',
    textAlign: 'center',
    marginTop: 4,
    textDecorationLine: 'underline',
  },
  erro: {
    color: '#e74c3c',
    textAlign: 'center',
    marginBottom: 10,
  },
});