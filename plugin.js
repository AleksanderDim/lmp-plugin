(function () {
    'use strict';

    function addUAPlugin() {
        // Переконуємось, що Lampa та головне меню існують
        if (!window.Lampa || !Lampa.Main) {
            setTimeout(addUAPlugin, 2000);
            return;
        }

        // Реєструємо наш окремий компонент, який відкриває список/браузер UAKino
        Lampa.Component.add('ua_online_mod', function (object) {
            var scroll = new Lampa.Scroll({ mask: true, over: true });

            this.create = function () {
                this.activity.loader(false);
                scroll.clear();

                var card = Lampa.Template.get('button', { title: 'UAKino: Перегляд' });
                scroll.append(card);

                var btnWatch = Lampa.Template.get('button', { title: 'Відкрити сайт UAKino' });
                btnWatch.on('hover:enter click', function () {
                    window.open('https://uakino.club', '_blank');
                });

                scroll.append(btnWatch);

                return scroll.render();
            };
        });

        // Створюємо пункт у головному меню
        var menuElement = $('<div class="menu__item selector" data-action="ua_online"><span>UA Онлайн (UAKino)</span></div>');

        menuElement.on('hover:enter click', function () {
            Lampa.Activity.push({
                title: 'UA Онлайн',
                component: 'ua_online_mod',
                movie: { title: 'UAKino' }
            });
        });

        // Додаємо елемент до списку меню
        $('.menu__list, .menu .scroll').append(menuElement);
        
        Lampa.Noty.show('UA-Plugin: Меню UAKino успішно додано');
    }

    // Запуск
    if (window.appready) {
        addUAPlugin();
    } else {
        document.addEventListener('appready', addUAPlugin);
        // Захист від затримок завантаження
        setTimeout(addUAPlugin, 3500);
    }
})();
