(function () {
    'use strict';

    function startPlugin() {
        // 1. Створюємо компонент пошуку
        Lampa.Component.add('ua_online_mod', function (object) {
            var scroll = new Lampa.Scroll({ mask: true, over: true });
            this.create = function () {
                var _this = this;
                this.activity.loader(false);
                scroll.clear();
                var card = Lampa.Template.get('button', { 
                    title: 'Пошук джерел для: ' + (object.movie.title || object.movie.name) 
                });
                scroll.append(card);
                return scroll.render();
            };
        });

        // 2. ДОДАЄМО В КОНТЕКСТНЕ МЕНЮ (кнопка "Меню" або довге натискання)
        Lampa.Listener.follow('app', function (e) {
            if (e.type == 'contextmenu') {
                // Додаємо пункт у список, який випадає
                e.variables.menu.push({
                    title: 'UA Онлайн (Пошук)',
                    subtitle: 'Шукати українською',
                    icon: '<svg height="36" viewBox="0 0 24 24" width="36" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" fill="white"/></svg>',
                    action: 'ua_online_go'
                });
            }
        });

        // Слухаємо натискання на наш пункт у меню
        Lampa.Listener.follow('menu', function (e) {
            if (e.action == 'ua_online_go') {
                Lampa.Activity.push({
                    title: 'UA Онлайн',
                    component: 'ua_online_mod',
                    movie: Lampa.Activity.active().card || {}
                });
            }
        });

        // 3. ТАКОЖ ДОДАМО В ПЕРШИЙ РЯДОК НАЛАШТУВАНЬ (як запасний вихід)
        Lampa.Listener.follow('settings', function (e) {
            if (e.type == 'open' && e.name == 'main') {
                setTimeout(function(){
                    var container = $('.settings-main');
                    if (container.length && !$('.view--ua-set').length) {
                        var item = $('<div class="settings-param selector view--ua-set"><div class="settings-param__name">UA Онлайн</div><div class="settings-param__value">Перевірити роботу</div></div>');
                        item.on('hover:enter click', function(){
                            Lampa.Noty.show('Плагін активний!');
                        });
                        container.prepend(item);
                    }
                }, 100);
            }
        });

        Lampa.Noty.show('UA-Plugin: Спробуйте довге натискання на фільм');
    }

    if (window.Lampa) startPlugin();
    else document.addEventListener('appready', startPlugin);
})();
