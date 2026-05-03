(function () {
    'use strict';

    function startPlugin() {
        // 1. Реєструємо компонент вікна результатів
        Lampa.Component.add('ua_online_mod', function (object) {
            var scroll = new Lampa.Scroll({ mask: true, over: true });
            this.create = function () {
                var _this = this;
                this.activity.loader(false);
                scroll.clear();
                
                var movieTitle = object.movie ? (object.movie.title || object.movie.name) : 'фільм';
                
                // Перевіряємо список джерел
                var uaSources = getSourcesForMovie(object.movie);
                
                if (uaSources.length > 0) {
                    var card = Lampa.Template.get('button', { title: 'Знайдено UA джерела для: ' + movieTitle });
                    scroll.append(card);
                    
                    uaSources.forEach(function(source) {
                        var btnSrc = Lampa.Template.get('button', { title: source.title });
                        btnSrc.on('hover:enter click', function () {
                            window.open(source.url, '_blank'); // Відкриваємо у браузері або плеєрі
                        });
                        scroll.append(btnSrc);
                    });
                } else {
                    var emptyCard = Lampa.Template.get('button', { title: 'Немає доступних UA джерел для: ' + movieTitle });
                    scroll.append(emptyCard);
                }

                return scroll.render();
            };
        });

        function getSourcesForMovie(movie) {
            if (movie) {
                return [
                    { title: 'UAKino', url: 'https://uakino.club' }
                ];
            }
            return [];
        }

        // 2. Вставка кнопки з безпечною перевіркою
        function injectButton() {
            var container = $('.full-start__buttons');
            var activeMovie = Lampa.Activity.active() ? Lampa.Activity.active().card : null;

            if (container.length && !container.find('.view--ua-online').length) {
                var sources = getSourcesForMovie(activeMovie);
                
                if (sources.length > 0) {
                    var btn = $('<div class="full-start__button selector view--ua-online"><span>UA Онлайн</span></div>');
                    
                    btn.on('hover:enter click', function () {
                        Lampa.Activity.push({
                            title: 'UA Онлайн',
                            component: 'ua_online_mod',
                            movie: activeMovie
                        });
                    });

                    container.prepend(btn);
                    
                    if (window.Lampa && Lampa.Controller) {
                        Lampa.Controller.enable('full');
                    }
                }
            }
        }

        // 3. Відкладений запуск для коректної ініціалізації
        setTimeout(injectButton, 2000);

        // 4. Механізм відстеження зміни сторінок
        var observer = new MutationObserver(function(mutations) {
            injectButton();
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
        
        Lampa.Noty.show('UA-Plugin: Контроль інтерфейсу активовано');
    }

    if (window.appready) startPlugin();
    else {
        document.addEventListener('appready', startPlugin);
        setTimeout(startPlugin, 3000);
    }
})();
