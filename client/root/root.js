const BASE_URL = "/api/post";

class PostApi {
    static fetch() {
        return fetch(BASE_URL, {mehod: 'GET'}).then(res => res.json());
    }
    static sendTime(time) {
        return fetch(BASE_URL, {
            method: 'POST',
            body: JSON.stringify(time),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }).then(res => res.json());
    }
    static remove(id) {
        return fetch(`${BASE_URL}/${id}`, {
            method: 'DELETE'
        }).then(res => res.json());
    }
};

PostApi.fetch().then(res => {
    console.log(res, 'test');
});

// class Schedule {
//     constructor() {

//     }
//     getData()
// };
