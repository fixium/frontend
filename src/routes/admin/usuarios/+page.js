// export async function load({ fetch }) {
//     const response = await fetch('http://localhost:8080/api/users', {
//         credentials: 'include'
//     });
//     if (!response.ok) {
//         throw new Error('Error al obtener los usuarios');
//     }
//     const users = await response.json();
//     return { users };
// }