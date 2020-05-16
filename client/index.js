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


// PostApi.fetch().then(res => {
//     res.forEach(elem => {
//         PostApi.remove(elem._id);
//     })
// });

const datesContainer = document.querySelector('.calendar__dates-list');
const timesContainer = document.querySelector('.calendar__schedule');
const submitButton = document.querySelector('.calendar__submit-button');
const allTimeItems = document.querySelectorAll('.calendar__schedule-item');

let reservedTime = [];


PostApi.fetch().then(res => {
    res.forEach(elem => {
        reservedTime.push(elem);
    })
}).catch(err => {
    console.log(err);
});


class DatesList {
    constructor(datesContainer) {
        this.datesContainer = datesContainer;
        this.renderDates();
    }
    createDateCard(date, day) {
        const card =  document.createElement('button');
        card.setAttribute('name', date);
        card.classList.add('calendar__dates-list-item');
        card.insertAdjacentHTML('afterbegin', `
            <p class="calendar__dates-data">${date}</p>
            <p class="calendar__dates-day">${day}</p>
        `);
        card.addEventListener('click', () => {
            const _currentDate = card.name
            timeListConstructor.timeListRender(_currentDate);
            this.cardActivator(card, _currentDate);
        });
        return card;
    }
    renderDates() {
        const options = {
            weekday: 'long',
        };
        for (let index = 0; index < 30; index++) {
            const closest30Days = new Date();
            closest30Days.setDate(closest30Days.getDate() + index);
            const date = closest30Days.toLocaleDateString();
            const weekday = closest30Days.toLocaleDateString('ru', options);
            this.datesContainer.appendChild(this.createDateCard(date, weekday));  
        }
    }
    cardActivator(dateListItem, dateSelected) {
        const itemList = document.querySelectorAll('.calendar__dates-list-item');
        itemList.forEach(element => {
            if(element === dateListItem) {
                if(element === dateListItem && dateListItem.classList.contains('calendar__dates-list-item_active')) {
                    element.classList.remove('calendar__dates-list-item_active');
                    return false;
                }
                timeListConstructor.timeTitle(dateSelected);
                dateListItem.classList.add('calendar__dates-list-item_active');
            } else {
                element.classList.remove('calendar__dates-list-item_active');
            }
        });
    }
}


class TimeList {
    constructor(timeContainer, submitButton) {
        this.timeContainer = timeContainer;
        this.submitButton = submitButton;
    }
    timeTitle(selectedDate) {
        const timeTitle = document.querySelector('.calendar__schedule-title');
        timeTitle.innerHTML = "";
        timeTitle.insertAdjacentHTML('afterbegin', `${selectedDate}`);
    }
    createTimeCard(time, selectedDate, status) {
        const _timeCard =  document.createElement('button');
        _timeCard.setAttribute('name', `${selectedDate} ${time}`);
        if(status === false) {
            _timeCard.setAttribute('disabled', '');
        }
        _timeCard.classList.add('calendar__schedule-item');
        _timeCard.insertAdjacentHTML('afterbegin', `
            ${time}:00
        `);
        _timeCard.addEventListener('click', () => {
            submitConstructor.render();
            this.timeCardActivator(_timeCard);
        });
        return _timeCard;
    }
    timeListRender(selectedDate) { 
        this.submitButton.setAttribute('disabled', '');
        this.timeContainer.innerHTML = "";
        let _time = 9;
        for (let index = 0; index < 14; index++) {
            _time += 1;
            let status = true;
            reservedTime.forEach(elem => {
                if(elem.hour === _time && elem.date === selectedDate) {
                    status = false;
                }
            });
            this.timeContainer.appendChild(this.createTimeCard(_time, selectedDate, status));
        }
    }
    timeCardActivator(card) {
        if(card.classList.contains('calendar__schedule-item_active')) {
            card.classList.remove('calendar__schedule-item_active');
        } else {
            card.classList.add('calendar__schedule-item_active');
        }
    }
}

class Submit {
    constructor(submitButton) {
        this.submitButton = submitButton;
        this.submitButton.addEventListener('click', () => {
            this.send();
        })
    }
    send() {
        const _timeCardsSelected = document.querySelectorAll('.calendar__schedule-item_active');
        const _dateCardsSelected = document.querySelectorAll('.calendar__dates-list-item_active');
        const selectedDate = _dateCardsSelected[0].name;
    
        const _hoursSelected = [];
        _timeCardsSelected.forEach(elem => {
            _hoursSelected.push(elem.name.substr(11, 2));
            elem.setAttribute('disabled', '');
        });
        _hoursSelected.forEach(elem => {
            const newReserve = {
                hour: elem,
                date: selectedDate
            }
            console.log(newReserve);
            PostApi.sendTime(newReserve).then(res => {
                reservedTime.push(res);
            })
        });
    }
    render() {
        this.submitButton.removeAttribute('style', 'display: none');
        this.submitButton.removeAttribute('disabled');
    }
}

const datesListConstructor = new DatesList(datesContainer);
const timeListConstructor = new TimeList(timesContainer, submitButton);
const submitConstructor = new Submit(submitButton);


// TODO
// Реализовать спасибо за запись
// Реализовать выбор количества часов
// Реализовать поля ввода названия группы, номера телефона
