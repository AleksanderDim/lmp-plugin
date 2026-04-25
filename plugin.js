(function () {
    'use strict';

    function startPlugin() {
        // 1. Створюємо компонент за зразком Lampac
        Lampa.Component.add('ua_online_mod', function (object) {
            var scroll = new Lampa.Scroll({ mask: true, over: true });
            
            this.create = function () {
                var _this = this;
                this.activity.loader(true);
                
                // Емуляція завантаження списку
                setTimeout(function(){
                    _this.activity.loader(false);
                    var results = [
                        {title: 'UA: Пошук на Anitube'},
                        {title: 'UA: Пошук на UAKino'},
                        {title: 'UA: Пошук на Ashdi'}
                    ];
                    _this.draw(results);
                }, 800);

                return scroll.render();
            };

            this.draw = function(data) {
                scroll.clear();
                data.forEach(function(item) {
                    var card = Lampa.Template.get('button', { title: item.title });
                    card.on('hover:enter', function() {
                        Lampa.Noty.show('Скоро тут будуть прямі посилання!');
                    });
                    scroll.append(card);
                });
            };
        });

        // 2. Метод додавання кнопки, який використовується в ядрі
        Lampa.Listener.follow('full', function (e) {
            if (e.type == 'complite') {
                var render = e.object.render(); // Отримуємо об'єкт картки
                var container = render.find('.full-start__buttons');

                if (container.length && !container.find('.view--ua-online').length) {
                    // Створюємо кнопку з правильними класами Лампи
                    var btn = $('<div class="full-start__button selector view--ua-online"><span>UA Онлайн</span></div>');
                    
                    btn.on('hover:enter', function () {
                        Lampa.Activity.push({
                            title: 'UA Онлайн',
                            component: 'ua_online_mod',
                            movie: e.data.movie
                        });
                    });

                    // Додаємо в контейнер
                    container.append(btn);
                    
                    // КРИТИЧНО: змушуємо ядро перерахувати навігацію в об'єкті
                    if (e.object.navigation) e.object.navigation();
                }
            }
        });

        Lampa.Noty.show('UA-Plugin: Завантажено як системний модуль');
    }

    // Запуск через офіційний Listener, як у коді Lampac
    Lampa.Listener.follow('app', function (e) {
        if (e.type == 'ready') {
            startPlugin();
        }
    });

    // Резервний запуск для браузерів
    if (window.appready) startPlugin();
})();
