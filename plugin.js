(function () {
    'use strict';

    function registerUaPlugin() {
        if (!window.Lampa) {
            setTimeout(registerUaPlugin, 2000);
            return;
        }

        // 1. Створюємо незалежний компонент
        Lampa.Component.add('ua_online_mod', function (object) {
            var scroll = new Lampa.Scroll({ mask: true, over: true });

            this.create = function () {
                this.activity.loader(false);
                scroll.clear();

                // Заголовок вікна
                var card = Lampa.Template.get('button', { title: 'UAKino: Вибір джерел' });
                scroll.append(card);

                // Кнопка, яка відкриває сайт у браузері телевізора або медіаплеєрі
                var btn = Lampa.Template.get('button', { title: 'Відкрити UAKino' });
                btn.on('hover:enter click', function () {
                    window.open('https://uakino.club', '_blank');
                });
                scroll.append(btn);

                return scroll.render();
            };
        });

        // 2. Додаємо пункт до головного меню (використовуємо інший клас для запобігання конфліктам)
        var menuItem = $('<div class="menu__item selector" data-action="ua_online_mod"><span>UAKino (UA Онлайн)</span></div>');

        menuItem.on('hover:enter click', function () {
            Lampa.Activity.push({
                title: 'UAKino',
                component: 'ua_online_mod',
                movie: { title: 'UAKino' }
            });
        });

        // Безпечна вставка в меню
        var $menuContainer = $('.menu .menu__list');
        if ($menuContainer.length) {
            $menuContainer.append(menuItem);
        } else {
            // Резервний варіант для інших версій
            $('.menu__list').append(menuItem);
        }

        Lampa.Noty.show('UAKino: Плагін успішно ініціалізовано');
    }

    // Запускаємо при готовності Lampa
    if (window.appready) {
        registerUaPlugin();
    } else {
        document.addEventListener('appready', registerUaPlugin);
        setTimeout(registerUaPlugin, 4000);
    }
})();
