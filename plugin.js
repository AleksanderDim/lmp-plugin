(function () {
    'use strict';

    function startPlugin() {
        // 1. Реєструємо компонент пошуку
        Lampa.Component.add('ua_online_search', function (object) {
            var scroll = new Lampa.Scroll({ mask: true, over: true });
            this.create = function () {
                var _this = this;
                this.activity.loader(false);
                scroll.clear();
                var card = Lampa.Template.get('button', { title: 'Пошук джерел для: ' + (object.movie ? (object.movie.title || object.movie.name) : 'обраного фільму') });
                scroll.append(card);
                return scroll.render();
            };
        });

        // 2. ДОДАЄМО ПУНКТ У ГОЛОВНЕ МЕНЮ (ЛІВОРУЧ)
        // Це перевірить, чи взагалі плагін може міняти інтерфейс
        var menu_item = $('<li class="menu__item selector" data-action="ua_online_search"><div class="menu__ico"><svg height="36" viewBox="0 0 24 24" width="36" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" fill="white"/></svg></div><div class="menu__text">UA Онлайн</div></li>');
        
        menu_item.on('hover:enter', function(){
            Lampa.Noty.show('Виберіть фільм у картці');
        });

        $('.menu .menu__list').append(menu_item);

        // 3. СПРОБА #11: Додати кнопку в картку через інший обробник
        Lampa.Listener.follow('full', function (e) {
            if (e.type == 'complite') {
                setTimeout(function(){
                    var container = $('.full-start__buttons, [data-component="full_start"] .full-start__buttons');
                    if (container.length && !$('.view--ua-online').length) {
                        var btn = $('<div class="full-start__button selector view--ua-online"><span>UA Онлайн</span></div>');
                        btn.on('hover:enter', function () {
                            Lampa.Activity.push({
                                title: 'UA Онлайн',
                                component: 'ua_online_search',
                                movie: e.data.movie
                            });
                        });
                        container.append(btn);
                    }
                }, 500);
            }
        });

        Lampa.Noty.show('UA-Plugin: Перевірте меню ліворуч!');
    }

    if (window.Lampa) startPlugin();
    else document.addEventListener('appready', startPlugin);
})();
