async function getUsers() {
    // FETCH: Hacemos una petición al servidor para obtener el archivo User.json
    return fetch('/data/User.json')
        
        // SI LA PETICIÓN ES EXITOSA:
        .then((response) => {
            // Convertimos la respuesta a formato JSON (JavaScript Object Notation)
            // JSON es como un formato de texto que contiene datos organizados
            return response.json();
        })
        
        // SI ALGO SALE MAL:
        .catch((error) => {
            // Mostramos el error en la consola del navegador para debug
            console.error("Error al hacer el fetch a la data:", error);
        })
  }
  
  //EXPORTAMOS la función para que otros archivos puedan usarla
  export default getUsers;
  