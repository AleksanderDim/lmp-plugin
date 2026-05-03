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
                
                // Перевіряємо список джерел перед виведенням
                var uaSources = getSourcesForMovie(object.movie);
                
                if (uaSources.length > 0) {
                    var card = Lampa.Template.get('button', { title: 'Знайдено UA джерела для: ' + movieTitle });
                    scroll.append(card);
                    // Тут ви можете додати список результатів/посилань, наприклад, через цикл:
                    // uaSources.forEach(function(source) { ... });
                } else {
                    var emptyCard = Lampa.Template.get('button', { title: 'Немає доступних UA джерел для: ' + movieTitle });
                    scroll.append(emptyCard);
                }

                return scroll.render();
            };
        });

        // Допоміжна функція для отримання джерел (тут ви можете додати реальну логіку парсингу)
        function getSourcesForMovie(movie) {
            // У реальному сценарії тут можна робити запит або перевіряти масив:
            // Для прикладу, повертаємо фіктивний масив, якщо фільм взагалі існує
            if (movie) {
                return [
                    { title: 'UAKino', url: 'https://uakino.club' }
                ];
            }
            return [];
        }

        // 2. ФУНКЦІЯ ВСТАВКИ КНОПКИ З ПЕРЕВІРКОЮ
        function injectButton() {
            var container = $('.full-start__buttons');
            var activeMovie = Lampa.Activity.active() ? Lampa.Activity.active().card : null;

            // Перевіряємо, чи є для цього фільму джерела
            var sources = getSourcesForMovie(activeMovie);

            // Якщо є контейнер і джерела, і кнопки ще немає
            if (container.length && sources.length > 0 && !container.find('.view--ua-online').length) {
                var btn = $('<div class="full-start__button selector view--ua-online"><span>UA Онлайн</span></div>');
                
                btn.on('hover:enter click', function () {
                    Lampa.Activity.push({
                        title: 'UA Онлайн',
                        component: 'ua_online_mod',
                        movie: activeMovie
                    });
                });

                // Додаємо в самий початок
                container.prepend(btn);
                
                // Оновлюємо навігацію, щоб пульт бачив кнопку
                if (window.Lampa && Lampa.Controller) {
                    Lampa.Controller.enable('full');
                }
            }
            // Якщо джерел немає або вони порожні — ховаємо (якщо вона вже була створена раніше)
            else if (sources.length === 0) {
                container.find('.view--ua-online').remove();
            }
        }

        // 3. МЕХАНІЗМ "НЕВИДИМОГО ОКА" (MutationObserver)
        var observer = new MutationObserver(function(mutations) {
            injectButton();
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        // Запускаємо відразу для перевірки
        injectButton();
        
        Lampa.Noty.show('UA-Plugin: Контроль інтерфейсу активовано');
    }

    // Запуск
    if (window.appready) startPlugin();
    else {
        document.addEventListener('appready', startPlugin);
        // Резерв для ядра
        setTimeout(startPlugin, 3000);
    }
})();
