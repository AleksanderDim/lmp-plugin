(function () {
    'use strict';

    function startPlugin() {
        // 1. Реєструємо компонент
        Lampa.Component.add('ua_online_mod', function (object) {
            var scroll = new Lampa.Scroll({ mask: true, over: true });
            this.create = function () {
                var _this = this;
                this.activity.loader(false);
                scroll.clear();

                var card = Lampa.Template.get('button', { title: 'UA Онлайн: Меню працює' });
                scroll.append(card);

                return scroll.render();
            };
        });

        // 2. Розширена функція вставки кнопки
        function injectButton() {
            // Перевіряємо одразу кілька можливих контейнерів для кнопок у різних версіях Lampa
            var containers = [
                $('.full-start__buttons'),
                $('.full-start__actions'),
                $('.view--item .info__actions')
            ];

            var activeActivity = Lampa.Activity.active();
            var activeMovie = activeActivity ? activeActivity.card : null;

            containers.forEach(function ($container) {
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
                    
                    Lampa.Noty.show('UA Онлайн: Кнопку додано!');
                }
            });
        }

        // Запускаємо з більшою затримкою, щоб сторінка встигла повністю промалюватися
        setTimeout(injectButton, 3500);

        // Відстежуємо зміни в інтерфейсі (якщо користувач перемикає фільми)
        var observer = new MutationObserver(function (mutations) {
            injectButton();
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        Lampa.Noty.show('UA-Plugin: Ініціалізовано');
    }

    if (window.appready) {
        startPlugin();
    } else {
        document.addEventListener('appready', startPlugin);
        setTimeout(startPlugin, 3500);
    }
})();
