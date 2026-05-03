(function () {
    'use strict';

    function createUaPlugin() {
        if (!window.Lampa) {
            setTimeout(createUaPlugin, 2000);
            return;
        }

        // 1. Створюємо абсолютно новий, ізольований компонент
        Lampa.Component.add('ua_online_uakino', function (object) {
            var scroll = new Lampa.Scroll({ mask: true, over: true });

            this.create = function () {
                this.activity.loader(false);
                scroll.clear();

                var card = Lampa.Template.get('button', { title: 'UAKino: Перегляд та медіатека' });
                scroll.append(card);

                var btnSite = Lampa.Template.get('button', { title: 'Відкрити сайт UAKino' });
                btnSite.on('hover:enter click', function () {
                    window.open('https://uakino.club', '_blank');
                });

                scroll.append(btnSite);

                return scroll.render();
            };
        });

        // 2. Додаємо пункт в головне меню через хук ініціалізації Lampa
        Lampa.listener.follow('app', function (e) {
            if (e.type === 'ready') {
                var btn = $('<div class="menu__item selector" data-action="ua_online_uakino"><span>UAKino (UA)</span></div>');

                btn.on('hover:enter click', function () {
                    Lampa.Activity.push({
                        title: 'UAKino Онлайн',
                        component: 'ua_online_uakino',
                        movie: { title: 'UAKino' }
                    });
                });

                // Використовуємо контейнер для бічного меню додатку Lampa
                $('.menu__list').append(btn);
            }
        });

        Lampa.Noty.show('UAKino: Модуль ініціалізовано в обхід BwaRC');
    }

    if (window.appready) {
        createUaPlugin();
    } else {
        document.addEventListener('appready', createUaPlugin);
    }
})();
