(function () {
    'use strict';

    function startPlugin() {
        // 1. Реєструємо компонент (вікно з результатами)
        Lampa.Component.add('ua_online_mod', function (object) {
            var scroll = new Lampa.Scroll({ mask: true, over: true });
            this.create = function () {
                var _this = this;
                this.activity.loader(false);
                scroll.clear();
                var card = Lampa.Template.get('button', { 
                    title: 'Пошук для: ' + (object.movie.title || object.movie.name) 
                });
                scroll.append(card);
                return scroll.render();
            };
        });

        // 2. Використовуємо системний таймер для "впорскування"
        // Це спрацює навіть якщо ядро перемальовує інтерфейс
        setInterval(function() {
            if ($('.full-start__buttons').length && !$('.view--ua-online').length) {
                var btn = $('<div class="full-start__button selector view--ua-online"><span>UA Онлайн</span></div>');
                
                btn.on('hover:enter click', function () {
                    // Отримуємо дані фільму безпосередньо з активної картки
                    var active_card = Lampa.Activity.active().card;
                    Lampa.Activity.push({
                        url: '',
                        title: 'UA Онлайн',
                        component: 'ua_online_mod',
                        movie: active_card
                    });
                });

                // Додаємо кнопку
                $('.full-start__buttons').append(btn);
                
                // Змушуємо Лампу перерахувати кнопки для пульта
                if (Lampa.Controller.enabled().name == 'full') {
                    Lampa.Controller.enable('full');
                }
            }
        }, 1000);

        Lampa.Noty.show('UA-Plugin: Спроба через системний цикл');
    }

    // Офіційний метод запуску для ядра
    if (window.appready) startPlugin();
    else Lampa.Listener.follow('app', function (e) { if (e.type == 'ready') startPlugin(); });
    
    // Резервний запуск
    setTimeout(function() {
        if (!window.UA_PLUGIN_INITED) {
            startPlugin();
            window.UA_PLUGIN_INITED = true;
        }
    }, 3000);
})();
