(function () {
    'use strict';

    function initPlugin() {
        // Реєструємо компонент для відображення списку або інформації
        Lampa.Component.add('ua_online_mod', function (object) {
            var scroll = new Lampa.Scroll({ mask: true, over: true });
            
            this.create = function () {
                var _this = this;
                this.activity.loader(false);
                scroll.clear();

                // Отримуємо назву фільму
                var movieTitle = object.movie ? (object.movie.title || object.movie.name) : 'фільм';

                var card = Lampa.Template.get('button', { title: 'Знайдено джерела для: ' + movieTitle });
                scroll.append(card);

                var btnSrc = Lampa.Template.get('button', { title: 'UAKino' });
                btnSrc.on('hover:enter click', function () {
                    // Відкриваємо джерело
                    window.open('https://uakino.club', '_blank');
                });
                scroll.append(btnSrc);

                return scroll.render();
            };
        });

        // Функція для пошуку контейнера кнопок та вставки нової
        function injectButton() {
            // Шукаємо блок з діями (кнопки "Дивитись", "Трейлер" тощо)
            var $container = $('.full-start__buttons');
            var activeActivity = Lampa.Activity.active();
            var activeMovie = activeActivity ? activeActivity.card : null;

            if ($container.length && !$container.find('.view--ua-online').length) {
                var btn = $('<div class="full-start__button selector view--ua-online"><span>UA Онлайн</span></div>');

                btn.on('hover:enter click', function () {
                    Lampa.Activity.push({
                        title: 'UA Онлайн',
                        component: 'ua_online_mod',
                        movie: activeMovie
                    });
                });

                $container.prepend(btn);

                if (window.Lampa && Lampa.Controller) {
                    Lampa.Controller.enable('full');
                }
                
                Lampa.Noty.show('UA-Plugin: Кнопка активована');
            }
        }

        // Запускаємо через 3.5 секунди після завантаження для стабільності
        setTimeout(injectButton, 3500);

        // Відстежуємо зміни сторінок
        var observer = new MutationObserver(function (mutations) {
            injectButton();
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
        
        Lampa.Noty.show('UA-Plugin: Ініціалізовано');
    }

    // Запуск плагіна з перевіркою стану Lampa
    if (window.appready) {
        initPlugin();
    } else {
        document.addEventListener('appready', initPlugin);
        setTimeout(initPlugin, 3500);
    }
})();
