import axios from "axios";

const base = "http://localhost:8000/api/neonNexa.users";

const instance = axios.create({
    baseURL: base,
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
    }
});

export default instance