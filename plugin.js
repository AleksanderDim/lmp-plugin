(function () {
    'use strict';

    function startPlugin() {
        // 1. Створюємо компонент, який буде відкриватися
        Lampa.Component.add('ua_online_search', function (object) {
            var scroll = new Lampa.Scroll({ mask: true, over: true });
            this.create = function () {
                var _this = this;
                this.activity.loader(true);
                setTimeout(function(){
                    _this.activity.loader(false);
                    _this.draw([{title: 'Пошук на ' + (object.movie.title || object.movie.name) + '...'}]);
                }, 800);
                return scroll.render();
            };
            this.draw = function(data) {
                scroll.clear();
                data.forEach(function(item) {
                    var card = Lampa.Template.get('button', { title: item.title });
                    scroll.append(card);
                });
            };
        });

        // 2. Додаємо кнопку через Listener на стадії "Повна картка готова"
        Lampa.Listener.follow('full', function (e) {
            if (e.type == 'complite') {
                // Використовуємо універсальний метод додавання кнопок Lampa
                var btn = $('<div class="full-start__button selector view--ua-online"><span>UA Онлайн</span></div>');
                
                btn.on('hover:enter click', function () {
                    Lampa.Activity.push({
                        url: '',
                        title: 'UA Онлайн',
                        component: 'ua_online_search',
                        movie: e.data.movie,
                        card: e.data.card
                    });
                });

                // Шукаємо будь-який контейнер кнопок і вставляємо ПЕРШИМ
                var container = $('.full-start__buttons, .movie-full__buttons, .buttons--full, .full-buttons');
                if (container.length && !$('.view--ua-online').length) {
                    container.prepend(btn);
                    // Оновлюємо навігацію, щоб кнопка була активна
                    Lampa.Controller.enable('full');
                }
            }
        });

        Lampa.Noty.show('UA-Plugin: Спроба #10 — Шукайте кнопку!');
    }

    // Реєстрація плагіна
    if (window.Lampa) {
        startPlugin();
    } else {
        document.addEventListener('appready', startPlugin);
    }
})();
