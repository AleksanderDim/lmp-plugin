(function () {
    'use strict';

    function init() {
        Lampa.Noty.show('UA-Plugin: Інтеграція в меню...');

        // Підключаємося до події відкриття картки фільму
        Lampa.Listener.follow('full', function (e) {
            if (e.type == 'complite') {
                // Чекаємо мить, поки картка відмалюється
                setTimeout(function() {
                    // Шукаємо контейнер, де лежить кнопка "Джерело" та інші
                    var container = $('.full-start__buttons, .movie-full__buttons, .buttons--full');
                    
                    if (container.length && !$('.view--ua-online').length) {
                        // Створюємо кнопку, яка за стилем буде як "Джерело"
                        var btn = $('<div class="full-start__button selector view--ua-online"><span>UA Онлайн</span></div>');
                        
                        btn.on('hover:enter click', function () {
                            Lampa.Noty.show('Пошук UA джерел запущено...');
                            // Тут пізніше буде виклик нашого вікна з результатами
                        });

                        // Вставляємо її ПЕРЕД кнопкою "Джерело"
                        container.prepend(btn);
                    }
                }, 200);
            }
        });

        // ДОДАТКОВО: Додаємо пункт прямо в меню "Джерело", якщо воно відкривається
        Lampa.Listener.follow('modals', function (e) {
            if (e.type == 'show' && e.name == 'select_source') {
                // Якщо відкрилося вікно вибору джерела (торренти/трейлери)
                setTimeout(function() {
                    var modal = $('.modal--select_source .modal__content, .modal__list');
                    if (modal.length && !$('.view--ua-item').length) {
                        var item = $('<div class="modal__item selector view--ua-item"><div class="modal__item-title">Дивитися UA Онлайн</div></div>');
                        item.on('hover:enter click', function() {
                            Lampa.Modal.close();
                            Lampa.Noty.show('Шукаю українською...');
                        });
                        modal.prepend(item);
                    }
                }, 100);
            }
        });
    }

    if (window.appready) init();
    else {
        document.addEventListener('appready', init);
        setTimeout(init, 2000);
    }
})();
