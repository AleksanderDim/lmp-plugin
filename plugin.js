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
                var card = Lampa.Template.get('button', { title: 'Шукаємо UA джерела для: ' + movieTitle });
                scroll.append(card);
                return scroll.render();
            };
        });

        // 2. ФУНКЦІЯ ВСТАВКИ КНОПКИ
        function injectButton() {
            var container = $('.full-start__buttons');
            
            // Якщо знайшли контейнер і кнопки там ще немає
            if (container.length && !container.find('.view--ua-online').length) {
                var btn = $('<div class="full-start__button selector view--ua-online"><span>UA Онлайн</span></div>');
                
                btn.on('hover:enter click', function () {
                    Lampa.Activity.push({
                        title: 'UA Онлайн',
                        component: 'ua_online_mod',
                        movie: Lampa.Activity.active() ? Lampa.Activity.active().card : {}
                    });
                });

                // Додаємо в самий початок
                container.prepend(btn);
                
                // Оновлюємо навігацію, щоб пульт бачив кнопку
                if (window.Lampa && Lampa.Controller) {
                    Lampa.Controller.enable('full');
                }
            }
        }

        // 3. МЕХАНІЗМ "НЕВИДИМОГО ОКА" (MutationObserver)
        // Він буде стежити за змінами на екрані та вставляти кнопку автоматично
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
