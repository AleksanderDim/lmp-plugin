(function () {
    'use strict';

    function startPlugin() {
        // Перевіряємо, чи існує вже зареєстрований компонент bwarch, щоб не зламати інші плагіни
        if (window.Lampa && Lampa.Component && Lampa.Component.get('bwarch')) {
            // Перехоплюємо створення компонента або додаємо нову логіку
            var originalBwarch = Lampa.Component.get('bwarch');
            
            Lampa.Component.add('bwarch', function (object) {
                var instance = new originalBwarch(object);

                // Якщо ми хочемо додати UAKino в список джерел (якщо компонент це дозволяє)
                var oldCreate = instance.create;
                instance.create = function () {
                    var rendered = oldCreate.apply(this, arguments);

                    // Додаємо власну кнопку дочірнього меню всередині вікна bwarch
                    var btnUa = Lampa.Template.get('button', { title: 'UAKino (UA Онлайн)' });
                    btnUa.on('hover:enter click', function () {
                        window.open('https://uakino.club', '_blank');
                    });

                    // Шукаємо місце, куди можна вставити (наприклад, панель кнопок)
                    var $panel = rendered.find('.torrent-filter, .filter');
                    if ($panel.length) {
                        $panel.append(btnUa);
                    } else {
                        rendered.append(btnUa);
                    }

                    return rendered;
                };

                return instance;
            });
            
            Lampa.Noty.show('UA-Plugin: Інтеграцію з BwaRC активовано');
        } else {
            Lampa.Noty.show('UA-Plugin: BwaRC ще не ініціалізовано. Спроба 2...');
            setTimeout(startPlugin, 2000);
        }
    }

    if (window.appready) {
        startPlugin();
    } else {
        document.addEventListener('appready', startPlugin);
        setTimeout(startPlugin, 3500);
    }
})();
