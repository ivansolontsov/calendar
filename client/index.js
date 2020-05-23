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

// PostApi.fetch().then(res => {
//     console.log(res, 'test');
// });

// PostApi.fetch().then(res => {
//     res.forEach(elem => {
//         PostApi.remove(elem._id);
//     })
// });

const datesContainer = document.querySelector('.calendar__dates-list');
const timesContainer = document.querySelector('.calendar__schedule');
const submitButton = document.querySelector('.calendar__submit-button');
const calendarDatesTitle = document.querySelector('.calendar__dates-title');
const form = document.forms.bookInfo;


let reservedTime = [];

PostApi.fetch().then(res => {
    res.forEach(elem => {
        reservedTime.push(elem);
    })
}).catch(err => {
    console.log(err);
});


class DatesList {
    constructor(datesContainer, calendarDatesTitle) {
        this.calendarDatesTitle = calendarDatesTitle;
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
            const _currentDate = card.name;
            timeListConstructor.timeListRender(_currentDate);
            this.cardActivator(card, _currentDate);
            this.datesContainer.setAttribute('style', 'display: none');
            this.calendarDatesTitle.removeChild(this._title);
            this.calendarDatesTitle.setAttribute('style', 'display: none');
        });
        return card;
    }
    renderDates() {
        this.datesContainer.innerHTML = "";
        this.datesContainer.removeAttribute('style', '');
        this.calendarDatesTitle.removeAttribute('style', '');
        const _title = document.createElement('h2');
        _title.setAttribute('class', 'calendar__first-step');
        _title.insertAdjacentHTML('afterbegin', `Выберите дату репетиции.`);
        this.calendarDatesTitle.appendChild(_title);
        this._title = _title;
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
        const calendarBottom = document.querySelector('.calendar__bottom');
        timeTitle.innerHTML = "";
        calendarBottom.removeAttribute('style');
        timeTitle.insertAdjacentHTML('afterbegin', `${selectedDate}
        <a class="calendar__schedule-cancel-arrow">
            <i class="fas fa-arrow-alt-circle-left"></i>
        </a>`);
        timeTitle.querySelector('.calendar__schedule-cancel-arrow')
        .addEventListener('click', () => {
           datesListConstructor.renderDates(); 
           timeTitle.parentNode.parentNode.setAttribute('style', 'display: none');
        });
    }
    createTimeCard(time, selectedDate, status) {
        const _timeCard =  document.createElement('button');
        _timeCard.setAttribute('name', `${selectedDate} ${time}`);
        if(status === false) {
            _timeCard.setAttribute('disabled', '');
        }
        _timeCard.classList.add('calendar__schedule-item');
        _timeCard.insertAdjacentHTML('afterbegin', `
            ${time}:00 - ${time + 1}:00
        `);
        _timeCard.addEventListener('click', () => {
            this.timeCardActivator(_timeCard);
            formConstructor.validate();
        });
        return _timeCard;
    }
    timeListRender(selectedDate) {
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

class Form {
    constructor(form, button) {
        this.form = form;
        this.submitButton = button;
        this.inputs = {
            name: this.form.name,
            bandName: this.form.bandName,
            phoneNumber: this.form.phoneNubmer,
            bass: this.form.bassCheckbox,
            keys: this.form.keysCheckbox,
            cymbals: this.form.cymbalsCheckbox,
            microphones: this.form.microphonesAmount
        };
        this.turnOff();
        form.addEventListener('input', () => {
            this.validate();
        })
        form.addEventListener('submit', (event) => {
            event.preventDefault();
            this.turnOff();
            this.send();
        });
    }
    validate() {
        const _timeCardsSelected = document.querySelectorAll('.calendar__schedule-item_active');
        if(this.inputs.name.validity.valid && this.inputs.bandName.validity.valid && this.inputs.phoneNumber.validity.valid) {
            if(_timeCardsSelected.length != 0) {
                this.turnOn();
            } else 
                this.turnOff();
        } else
            this.turnOff();
    }
    turnOn() {
        this.submitButton.removeAttribute('disabled', '');
    }
    turnOff() {
        this.submitButton.setAttribute('disabled', '');
    }
    send() {
        const _timeCardsSelected = document.querySelectorAll('.calendar__schedule-item_active');
        const _dateCardsSelected = document.querySelectorAll('.calendar__dates-list-item_active');
        const $selectedDate = _dateCardsSelected[0].name;
        const $name = this.inputs.name.value;
        const $bandName = this.inputs.bandName.value;
        const $phoneNumber = this.inputs.phoneNumber.value;
        let $bass = this.inputs.bass;
        if($bass.checked === true) {
            $bass = true;
        } else
            $bass = false;
        let $keys = this.inputs.keys;
        if($keys.checked === true) {
            $keys = true;
        } else
            $keys = false;
        let $cymbals = this.inputs.cymbals;
        if($cymbals.checked === true) {
            $cymbals = true;
        } else
            $cymbals = false;
        const $microphones = String(this.inputs.microphones.value);

        if(_timeCardsSelected.length === 0) {
            console.log('нет выбранного времени');
            return false;
        } else {
            const _hoursSelected = [];
            _timeCardsSelected.forEach(elem => {
                _hoursSelected.push(elem.name.substr(11, 2));
                elem.setAttribute('disabled', '');
                elem.classList.remove('calendar__schedule-item_active');
            });
            localStorage.clear();
            localStorage.setItem('hoursSelected', _hoursSelected);
            localStorage.setItem('name', $name);
            localStorage.setItem('date', $selectedDate);

            _hoursSelected.forEach(elem => {
                const newReserve = {
                    hour: elem,
                    date: $selectedDate,
                    name: $name,
                    bandName: $bandName,
                    phoneNumber: $phoneNumber,
                    bass: $bass,
                    keys: $keys,
                    cymbals: $cymbals,
                    microphones: $microphones
                }
                console.log(newReserve);
                PostApi.sendTime(newReserve).then(res => {
                    reservedTime.push(res);
                    window.location.href = '/thanks.html';
                });
            });
        }
    }
}

const formConstructor = new Form(form, submitButton);
const datesListConstructor = new DatesList(datesContainer, calendarDatesTitle);
const timeListConstructor = new TimeList(timesContainer, submitButton);



// TODO
// Реализовать спасибо за запись
