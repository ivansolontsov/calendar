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

const dayWrapper = document.querySelector('.admin__calendar-days-wrapper');

class Schedule {
    constructor() {
        this.renderDays();
        let date = '03.06.2020';
        this.currentDayRepetitions(date);
    }
    createDay(date) {
        const day = document.createElement('div');
        day.classList.add('admin__calendar-day');
        day.insertAdjacentHTML('afterbegin', `
        <h2 class="calendar-day__title">${date}</h2>
        <ul class="calendar-day__times">
        <li class="calendar-day__times-item">Записей нет</li>
        </ul>`);
        // для реализации нужен массив с данными на запрошенный день, функция currentDayRepetitions
        // if(this.currentDayRepetitions) {
        //     let timesWrapper = day.querySelector('.calendar-day__times');
        //     timesWrapper.innerHTML = '';
        //     timesWrapper.appendChild(this.createTime());
        // }
        // this.currentDayRepetitions(date);
        return day;
    }
    getData(date) {
        PostApi.fetch().then(res => {
            res.forEach(element => {
                if(element.date === date) {
                    console.log(element);
                }
            });
        }).catch((err) => {
            console.log(err);
        });
    }
    currentDayRepetitions(date) {
        // функция выдает все репетиции на запрошенную дату.
        let repetitionsAtDate = [];
        this.getData(date);
        return repetitionsAtDate;
    }
    // createTime(date, hours, bandName, name, telephone, bass, microphones, cymbals, keys) {
    createTime() {
        const time = document.createElement('li');
        time.classList.add('calendar-day__times-item');
        time.insertAdjacentHTML('afterbegin', `
        <button class="times-item__delete">
            <i class="fas fa-times"></i>
        </button>
        <h3 class="calendar-day__times-title">10:00 - 12:00</h3>
        <p class="calendar-day__times-info">Группа: metallica</p>
        <p class="calendar-day__times-info">Имя: иван</p>
        <p class="calendar-day__times-info">Телефон: 79173080937</p>
        <p class="calendar-day__times-info">Бас: да</p>
        <p class="calendar-day__times-info">Микрофонов: 3</p>
        <p class="calendar-day__times-info">Тарелки: да</p>
        <p class="calendar-day__times-info">Клавиши: нет</p>
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

const scheduleConstructor = new Schedule();