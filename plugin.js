(function () {
    'use strict';

    function init() {
        // Повідомлення для впевненості
        Lampa.Noty.show('UA-Plugin: Шукаю куди вставити кнопку...');

        // Постійний цикл пошуку потрібного місця
        setInterval(function() {
            // Перевіряємо всі можливі варіанти назв блоків з кнопками в різних версіях Лампи
            var selectors = [
                '.full-start__buttons', 
                '.movie-full__buttons', 
                '.buttons--full',
                '.full-buttons'
            ];
            
            var container = $(selectors.join(', '));
            
            // Якщо знайшли хоча б один і кнопки там ще немає
            if (container.length && !$('.view--ua-online').length) {
                
                // Створюємо кнопку з примусовими стилями, щоб її було видно
                var btn = $('<div class="full-start__button selector view--ua-online" style="margin-bottom: 10px !important;"><span>UA Онлайн</span></div>');
                
                // Дія при натисканні
                btn.on('hover:enter click', function () {
                    Lampa.Noty.show('Пошук скоро буде тут!');
                });

                // Додаємо на самий початок списку кнопок, щоб не проґавити
                container.prepend(btn);
                
                // Про всяк випадок оновлюємо навігацію Лампи, щоб кнопка стала "клікабельною"
                Lampa.Controller.enable('full'); 
            }
        }, 1000);
    }

    if (window.appready) init();
    else {
        document.addEventListener('appready', init);
        setTimeout(init, 2000);
    }
})();
