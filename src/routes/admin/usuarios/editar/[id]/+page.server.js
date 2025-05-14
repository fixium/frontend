export async function load({ fetch, params }) {
    const response = await fetch(`http://localhost:8080/api/users/${params.id}`, {
        credentials: "include"
    });

    if (!response.ok) {
        throw new Error("Error al obtener los datos del usuario");
    }

    const user = await response.json();
    return { user };
}