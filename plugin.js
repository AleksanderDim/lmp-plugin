(function () {
    'use strict';

    function startPlugin() {
        // 1. Реєструємо компонент пошуку
        Lampa.Component.add('ua_online_mod', function (object) {
            var scroll = new Lampa.Scroll({ mask: true, over: true });
            
            this.create = function () {
                var _this = this;
                this.activity.loader(true);
                
                // Тестовий результат
                setTimeout(function(){
                    _this.activity.loader(false);
                    _this.draw([{title: 'Пошук джерел для: ' + (object.movie.title || object.movie.name)}]);
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

        // 2. ІНТЕГРАЦІЯ У ВКЛАДКИ (Опис, Актори, Рекомендації...)
        Lampa.Listener.follow('full', function (e) {
            if (e.type == 'complite') {
                var body = e.object.render();
                var tabs = body.find('.full-tabs'); // Шукаємо ряд вкладок

                if (tabs.length && !tabs.find('.view--ua-online-tab').length) {
                    // Створюємо нову вкладку
                    var tab = $('<div class="full-tabs__item selector view--ua-online-tab">UA Онлайн</div>');
                    
                    tab.on('hover:enter click', function () {
                        Lampa.Activity.push({
                            title: 'UA Онлайн',
                            component: 'ua_online_mod',
                            movie: e.data.movie
                        });
                    });

                    // Додаємо вкладку в кінець списку (після Рекомендацій)
                    tabs.append(tab);
                }
            }
        });

        Lampa.Noty.show('UA-Plugin: Перевірте вкладку поруч із "Опис"');
    }

    if (window.Lampa) startPlugin();
    else document.addEventListener('appready', startPlugin);
})();
