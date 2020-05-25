const calendarHeader = document.querySelector('.calendar__header');

const results = {
    hours: localStorage.getItem('hoursSelected'),
    name: localStorage.getItem('name'),
    date: localStorage.getItem('date'),
    bass: localStorage.getItem('bass'),
    keys: localStorage.getItem('keys'),
    cymbals: localStorage.getItem('cymbals')
}

class Popup {
    constructor(popupContainer, results) {
        this.container = popupContainer;
        this.hours = results.hours.split(',');
        this.name = results.name;
        this.date = results.date;
        this.bass = results.bass;
        this.keys = results.keys;
        this.cymbals = results.cymbals;
    }
    price() {
        let _hours = this.hours.length;
        let _hourPrice = 175;
        let _bassPrice = 0;
        if(this.bass === 'true') {
            _bassPrice = 50;
        }
        let _keysPrice = 0;
        if(this.keys === 'true') {
            _keysPrice = 75;
        }
        let _cymbalsPrice = 0;
        if(this.cymbals === 'true') {
            _cymbalsPrice = 25;
        }
        let price = `${(_bassPrice + _keysPrice + _cymbalsPrice + _hourPrice) * _hours} руб.`;
        return price;
    }
    popup() {
        const popup = document.createElement('div');
        popup.classList.add('calendar__popup');
        popup.insertAdjacentHTML('afterbegin', `
        <h2 class="calendar__popup-title"><i class="fas fa-check-circle"></i> Спасибо!</h2>
        <p class="calendar__popup-text">
            <span class="bold">${this.name.charAt(0).toUpperCase() + this.name.substr(1)}</span>, 
            время для вашей репетиции забронировано на ${this.date} ждем вас в ${this.hours[0]}:00
        </p>
        <p class="calendar__popup-text">По любым вопросам можно обратиться к нам в чате в ВКонтакте или по телефону +79173080937.</p>
        <h2 class="calendar__popup-price">${this.price()}</h2>
        <div class="calendar__popup-icons">
          <a href="https://vk.com/chapsstudio" target=_blank><i class="fab fa-vk"></i></a> 
          <a href="https://vk.com/chapsstudio" target=_blank><i class="fab fa-whatsapp"></i></a>
        </div>`);
        return popup;
    }
    popupRender() {
        this.container.innerHTML = "";
        this.container.appendChild(this.popup());
    }
}

const popupConstructor = new Popup(calendarHeader, results);

popupConstructor.popupRender();