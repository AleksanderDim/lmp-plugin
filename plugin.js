(function () {
    'use strict';

    function init() {
        // 1. ПЕРЕВІРКА: Виведемо повідомлення одразу, щоб ви знали, що код ЗАПУСТИВСЯ
        setTimeout(function() {
            if (window.Lampa) {
                Lampa.Noty.show('UA-Plugin: Код працює, шукаю картку...');
            }
        }, 1000);

        // 2. ЦИКЛ ПОШУКУ: Шукаємо місце для кнопки кожні пів секунди
        setInterval(function() {
            // Шукаємо блок кнопок у картці
            var container = $('.full-start__buttons');
            
            if (container.length && !$('.view--ua-online').length) {
                // Створюємо кнопку
                var btn = $('<div class="full-start__button selector view--ua-online"><span>UA Онлайн</span></div>');
                
                // Дія при натисканні
                btn.on('hover:enter click', function () {
                    Lampa.Noty.show('Пошук активний!');
                });

                // Додаємо в кінець списку кнопок
                container.append(btn);
                console.log('UA Online: Button added');
            }
        }, 500);
    }

    // Запуск скрипта
    if (window.appready) init();
    else {
        document.addEventListener('appready', init);
        setTimeout(init, 2000); // Резерв
    }
})();
