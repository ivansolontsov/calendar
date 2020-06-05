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


let reservedTime = PostApi.fetch().then(res => {
    return res;
});

const dayWrapper = document.querySelector('.admin__calendar-days-wrapper');

class Schedule {
    constructor(reservedTime) {
        this.reservedTime = reservedTime;
        this.renderDays();
    }
    createDay(date) {
        const day = document.createElement('div');
        day.classList.add('admin__calendar-day');
        day.insertAdjacentHTML('afterbegin', `
        <h2 class="calendar-day__title">${date}</h2>
        <ul class="calendar-day__times">
        <li class="calendar-day__times-item">Записей нет</li>
        </ul>`);

        this.getData(date).then(res => {
            let timesWrapper = day.querySelector('.calendar-day__times');
            if(res.length > 0) {
                timesWrapper.innerHTML = '';
                this.summator(res);
                res.forEach(element => {
                    // let hours = '';
                    // реализовать объединения часов.
                    timesWrapper.appendChild(this.createTime(element.hour, 
                        element.bandName, 
                        element.name, 
                        element.phoneNumber, 
                        element.bass, 
                        element.microphones, 
                        element.cymbals, 
                        element.keys));
                });
            }
        })
        return day;
    }
    summator(res) {
        let sortedArray = [];
        res.forEach((element, index, array) => {
            // console.log(element, 'TEST');
            let i = 1;
            if(index === 0) {
                i = 0;
            }
            if(array[index].phoneNumber === array[index - i].phoneNumber || array[index].name === array[index - i].name) {
                console.log(`Есть совпадения, ${element.date} ${element.name} ${element.hour} ${element.bandName}`);
            }
        });
        return sortedArray;
    }
    getData(date) {
        return this.reservedTime.then(res => {
            let currentDayReserves = []
            res.forEach(element => {
                if(element.date === date) {
                    currentDayReserves.push(element);
                }
            });
            return currentDayReserves;
        })
    }
    createTime(hours, bandName, name, telephone, bass, microphones, cymbals, keys) {
        const time = document.createElement('li');
        time.classList.add('calendar-day__times-item');
        time.insertAdjacentHTML('afterbegin', `
        <button class="times-item__delete">
            <i class="fas fa-times"></i>
        </button>
        <h3 class="calendar-day__times-title">${hours}</h3>
        <p class="calendar-day__times-info">Группа: ${bandName}</p>
        <p class="calendar-day__times-info">Имя: ${name}</p>
        <p class="calendar-day__times-info">Телефон: ${telephone}</p>
        <p class="calendar-day__times-info">Бас: ${bass}</p>
        <p class="calendar-day__times-info">Микрофонов: ${microphones}</p>
        <p class="calendar-day__times-info">Тарелки: ${cymbals}</p>
        <p class="calendar-day__times-info">Клавиши: ${keys}</p>
        <div class="calendar-day__times-menu">
            <a href="#" class="calendar-day__times-menu-item"><i class="fas fa-phone"></i></a>
        </div>
        `);
        return time;
    }
    renderDays() {
        dayWrapper.innerHTML = "";
        const options = {
            weekday: 'long',
        };
        for (let index = 0; index < 30; index++) {
            const closest30Days = new Date();
            closest30Days.setDate(closest30Days.getDate() + index);
            let date = closest30Days.toLocaleDateString();
            dayWrapper.appendChild(this.createDay(date));
        }
    }

};

const scheduleConstructor = new Schedule(reservedTime);