const API_URL = "http://localhost:3000/api";

async function request(endpoint, options = {}) {

    const response = await fetch(

        `${API_URL}${endpoint}`,

        {
            credentials: "include",

            headers: {
                "Content-Type": "application/json",
                ...(options.headers || {})
            },

            ...options
        }

    );

    const data = await response.json();

    if (!response.ok) {

        throw new Error(

            data.message ||

            data.error ||

            "Ocurrió un error."

        );

    }

    return data;

}

export default {

    get(endpoint) {

        return request(endpoint);

    },

    post(endpoint, body) {

        return request(endpoint, {

            method: "POST",

            body: JSON.stringify(body)

        });

    },

    put(endpoint, body) {

        return request(endpoint, {

            method: "PUT",

            body: JSON.stringify(body)

        });

    },

    delete(endpoint) {

        return request(endpoint, {

            method: "DELETE"

        });

    }

};