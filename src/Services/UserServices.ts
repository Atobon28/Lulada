
async function getUsers() {
    return fetch('/data/User.json')
        .then((response) => {
            return response.json();
        })
        .catch((error) => {
            console.error("Error al hacer el fetch a la data:", error);
        })
}
export default getUsers;



 





/*async function getUsers() {
    const url = "../../Public/data/user.json";
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`info mal`);
    }
  
      const json = await response.json();
      console.log(json);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
}

export { getUsers }; */

