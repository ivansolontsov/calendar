const calendarHeader = document.querySelector('.calendar__header');

let hours = localStorage.getItem('hoursSelected');
let name = localStorage.getItem('name');
let date = localStorage.getItem('date');
hours = hours.split(',');

class Popup {
    constructor(popupContainer) {
        this.container = popupContainer;
    }
    popup() {
        const popup = document.createElement('div');
        popup.classList.add('calendar__popup');
        popup.insertAdjacentHTML('afterbegin', `
        <h2 class="calendar__popup-title"><i class="fas fa-check-circle"></i> Спасибо!</h2>
        <p class="calendar__popup-text">${name.charAt(0).toUpperCase() + name.substr(1)}, время для вашей репетиции забронировано на ${date} ждем вас в ${hours[0]}:00</p>
        <p class="calendar__popup-text">По любым вопросам можно обратиться к нам в чате в ВКонтакте или по телефону +79173080937.</p>
        <div class="calendar__popup-icons">
          <i class="fab fa-vk"></i> 
          <i class="fab fa-whatsapp"></i>
        </div>`);
        return popup;
    }
    popupRender() {
        this.container.innerHTML = "";
        this.container.appendChild(this.popup());
    }
}

const popupConstructor = new Popup(calendarHeader);

popupConstructor.popupRender();