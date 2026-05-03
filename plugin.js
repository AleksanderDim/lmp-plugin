(function () {
    'use strict';

    function startPlugin() {
        // 1. Реєструємо компонент вікна результатів, який не конфліктує з BwaRC
        Lampa.Component.add('ua_online_mod', function (object) {
            var scroll = new Lampa.Scroll({ mask: true, over: true });
            
            this.create = function () {
                var _this = this;
                this.activity.loader(false);
                scroll.clear();

                var movieTitle = object.movie ? (object.movie.title || object.movie.name) : 'фільм';
                
                var card = Lampa.Template.get('button', { title: 'Джерела для: ' + movieTitle });
                scroll.append(card);

                var btnSrc = Lampa.Template.get('button', { title: 'UAKino' });
                btnSrc.on('hover:enter click', function () {
                    window.open('https://uakino.club', '_blank');
                });
                
                scroll.append(btnSrc);

                return scroll.render();
            };
        });

        // 2. Додаємо пункт у меню вибору (без спроби вклинитися у full-start__buttons)
        function addMenuItem() {
            var $menuList = $('.menu .menu__list, .torrent-filter'); 

            // Створюємо кнопку меню, якщо її ще немає
            if (!$('.view--ua-online-menu').length) {
                var menuBtn = $('<div class="menu__item selector view--ua-online-menu"><span>UAKino Онлайн</span></div>');
                
                menuBtn.on('hover:enter click', function () {
                    var activeActivity = Lampa.Activity.active();
                    var activeMovie = activeActivity ? activeActivity.card : null;

                    Lampa.Activity.push({
                        title: 'UA Онлайн',
                        component: 'ua_online_mod',
                        movie: activeMovie
                    });
                });

                // Додаємо кнопку до загального меню Lampa
                if ($menuList.length) {
                    $menuList.first().append(menuBtn);
                } else {
                    // Резервний варіант: якщо меню не знайдено, виводимо сповіщення
                    $('.menu__items').append(menuBtn);
                }
            }
        }

        setTimeout(addMenuItem, 3000);
        Lampa.Noty.show('UA-Plugin: UAKino ініціалізовано');
    }

    if (window.appready) {
        startPlugin();
    } else {
        document.addEventListener('appready', startPlugin);
        setTimeout(startPlugin, 3500);
    }
})();
