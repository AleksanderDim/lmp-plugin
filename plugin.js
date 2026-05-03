(function () {
    'use strict';

    function registerPlugin() {
        // Реєструємо наш компонент у системі Lampa
        Lampa.Component.add('ua_online_mod', function (object) {
            var _this = this;
            var scroll = new Lampa.Scroll({ mask: true, over: true });
            var files = new Lampa.Explorer(object); // Використовуємо стандартний провідник Lampa

            this.create = function () {
                var movieTitle = object.movie ? (object.movie.title || object.movie.name) : 'фільм';

                this.activity.loader(false);
                scroll.clear();

                var card = Lampa.Template.get('button', { title: 'Знайдено джерела для: ' + movieTitle });
                scroll.append(card);

                // Додаємо кнопку з посиланням
                var btnSrc = Lampa.Template.get('button', { title: 'UAKino' });
                btnSrc.on('hover:enter click', function () {
                    window.open('https://uakino.club', '_blank');
                });
                
                scroll.append(btnSrc);

                return scroll.render();
            };

            this.start = function () {
                Lampa.Controller.enable('content');
            };

            this.pause = function () {};
            this.stop = function () {};
        });

        // Додаємо пункт у головне меню Lampa (наприклад, у розділ "Пошук" або "Головна")
        if (window.Lampa && Lampa.Main) {
            var menuElement = $('<div class="menu__item selector" data-action="ua_online_mod"><span>UA Онлайн</span></div>');

            menuElement.on('hover:enter', function () {
                Lampa.Activity.push({
                    title: 'UA Онлайн',
                    component: 'ua_online_mod',
                    movie: { title: 'Пошук' }
                });
            });

            // Додаємо кнопку в меню (якщо воно завантажилось)
            $('.menu .menu__list').append(menuElement);
            
            Lampa.Noty.show('UA-Plugin: Меню успішно додано');
        }
    }

    if (window.appready) {
        registerPlugin();
    } else {
        document.addEventListener('appready', registerPlugin);
        setTimeout(registerPlugin, 3500);
    }
})();
