import { useState, useEffect } from "react";
import{ref,onValue} from "firebase/database";
import { db } from '../firebaseConfig';


function useFeatureFlag(flagName){
    const[valor, setValor] = useState(null); //constante para armazenar o boolean que está no banco
    useEffect(()=>{ //usado pra disparar
        const flagRef = ref(db, 'featureFlags/' + flagName); //endereço do banco
        onValue(flagRef,(snapshot) =>{ //parametro diz: "Fique escutando esse endereço e tire uma foto se o valor mudar"
            setValor(snapshot.val());// .val() vai retornar os valores que estão dentro da "foto" que o firebase tirou e vai guardar na constante
        })
        
    },[]
    
)
return valor; //retorna para a função o valor booleano que está dentro do banco
}

export default useFeatureFlag;