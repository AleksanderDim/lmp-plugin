(function () {
    'use strict';

    function init() {
        // Повідомлення, яке має з'явитися вгорі екрана ПРИ ЗАПУСКУ
        setTimeout(function() {
            if (window.Lampa) {
                Lampa.Noty.show('UA-Plugin: ЗВ’ЯЗОК ВСТАНОВЛЕНО');
            }
        }, 2000);

        // Додаємо кнопку
        Lampa.Listener.follow('full', function (e) {
            if (e.type == 'complite') {
                var btn = $('<div class="full-start__button selector view--ua-online"><span>UA Онлайн</span></div>');
                
                btn.on('hover:enter', function () {
                    Lampa.Noty.show('Пошук запущено...');
                });
                
                if (!$('.view--ua-online').length) {
                    $('.full-start__buttons').append(btn);
                }
            }
        });
    }

    // Запуск
    if (window.appready) init();
    else {
        document.addEventListener('appready', init);
        // Резервний запуск через 3 секунди
        setTimeout(init, 3000);
    }
})();
