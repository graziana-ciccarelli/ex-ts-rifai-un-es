import dayjs from 'dayjs';
// Definisce il tipo per una ricetta (Recipe)
type Recipe = {
  id: number;       
  name: string;    
  userId: number;   
};

// Definisce il tipo per un utente (User)
type User = {
  id: number;         
  firstName: string;   
  lastName: string;    
  birthDate: string;  
};

// Funzione asincrona che prende l'ID di una ricetta e ritorna la data di nascita dello chef formattata
async function getChefBirthday(id: number): Promise<string> {
  try {
    // Fa una richiesta per ottenere i dati della ricetta
    const recipeResponse = await fetch(`https://dummyjson.com/recipes/${id}`);

    // Controlla se la risposta è valida
    if (!recipeResponse.ok) {
      // Se la ricetta non esiste o c'è un errore, lancia un errore con messaggio specifico
      throw new Error(`Ricetta con ID ${id} non trovata (status: ${recipeResponse.status})`);
    }

    // Converte la risposta JSON in un oggetto Recipe
    const recipe: Recipe = await recipeResponse.json();

    // Controlla che la ricetta abbia un userId valido
    if (!recipe.userId) {
      throw new Error("La ricetta non contiene un userId valido.");
    }

    // Fa una seconda richiesta per ottenere i dati dello chef usando il userId
    const chefResponse = await fetch(`https://dummyjson.com/users/${recipe.userId}`);

    // Controlla se la risposta dello chef è valida
    if (!chefResponse.ok) {
      throw new Error(`Utente con ID ${recipe.userId} non trovato (status: ${chefResponse.status})`);
    }

    // Converte la risposta JSON in un oggetto User
    const chef: User = await chefResponse.json();

    // Controlla che lo chef abbia una data di nascita disponibile
    if (!chef.birthDate) {
      throw new Error("La data di nascita dell'utente non è disponibile.");
    }

    // Usa dayjs per formattare la data di nascita nel formato GG/MM/AAAA e la ritorna
    return dayjs(chef.birthDate).format('DD/MM/YYYY');

  } catch (error: unknown) {
    // Gestione degli errori generici
    if (error instanceof Error) {
      console.error("Errore:", error.message);  // Stampa l'errore in console
      throw error;                              // Rilancia l'errore per gestirlo altrove
    }
    throw new Error("Errore sconosciuto.");     // Caso molto raro di errore non previsto
  }
}

// Esempio di utilizzo della funzione
getChefBirthday(1)
  .then(birthday => {
    // Se la Promise risolve, stampa la data di nascita dello chef in console
    console.log("Data di nascita dello chef:", birthday);
  })
  .catch(error => {
    // Se c'è un errore, stampa il messaggio in console
    console.error("Errore:", error.message);
  });
