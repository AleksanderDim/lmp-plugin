(function () {
    var init = function () {
        // Спроба вивести сповіщення через стандартний alert, якщо Noty не працює
        try {
            Lampa.Noty.show('UA-Plugin: Спроба запуску');
        } catch(e) {
            console.log('Lampa Noty не підтримується');
        }

        // Універсальний пошук контейнера для кнопок
        var timer = setInterval(function () {
            var container = $('.full-start__buttons, .movie-full__buttons, .buttons--full');
            
            if (container.length && !$('.view--ua-online').length) {
                var btn = $('<div class="full-start__button selector view--ua-online"><span>UA Онлайн</span></div>');
                
                // Стилізація для старих версій
                btn.css({
                    'background': 'rgba(255,255,255,0.1)',
                    'padding': '10px 20px',
                    'margin': '5px',
                    'border-radius': '5px',
                    'display': 'inline-block',
                    'cursor': 'pointer'
                });

                btn.on('click hover:enter', function () {
                    alert('Працює! Тепер ми знаємо, що код виконується.');
                });

                container.append(btn);
            }
        }, 1000); // Перевіряємо наявність кнопок кожну секунду
    };

    // Запуск без зайвих умов
    if (window.Lampa) init();
    else {
        var waitLampa = setInterval(function() {
            if (window.Lampa) {
                clearInterval(waitLampa);
                init();
            }
        }, 500);
    }
})();
